import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";

/**
 * Export a single key as an ASCII-armored .asc download.
 * Query:  ?type=public | private | both
 *
 * Admin only. Every export is recorded in the activity log so the
 * operator can audit who exported what.
 */
export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const url = new URL(req.url);
  const type = (url.searchParams.get("type") ?? "public").toLowerCase();

  const key = await prisma.pgpKey.findUnique({
    where: { id },
    include: { user: { select: { email: true } } },
  });
  if (!key) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const safeName = key.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "key";
  const fp = key.fingerprint.slice(-16).toLowerCase();

  let body = "";
  let suffix = "public";

  if (type === "private") {
    if (!key.privateKey) return NextResponse.json({ error: "No private key stored" }, { status: 404 });
    body = key.privateKey;
    suffix = "private";
  } else if (type === "both") {
    if (!key.privateKey) return NextResponse.json({ error: "No private key stored" }, { status: 404 });
    // GnuPG-style export: public block followed by private block.
    body = `${key.publicKey.trim()}\n\n${key.privateKey.trim()}\n`;
    suffix = "bundle";
  } else {
    body = key.publicKey;
    suffix = "public";
  }

  const filename = `${safeName}-${fp}-${suffix}.asc`;

  await logActivity(
    user.id,
    "admin_export_key",
    `${suffix} · ${key.fingerprint.slice(-16)} · owner=${key.user.email}`,
  );

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "application/pgp-keys; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
