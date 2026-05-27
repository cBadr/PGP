import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";

/**
 * Bulk-export every key in the system as one concatenated .asc file.
 * Most PGP tools (GnuPG, OpenPGP.js readKeys) accept files with multiple
 * armored blocks in sequence, so we skip the dependency on a zip lib.
 *
 * Query:  ?scope=public        — only public blocks (safe to share)
 *         ?scope=full          — public + private blocks (operator backup)
 */
export async function GET(req: Request) {
  const session = await auth();
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const scope = (new URL(req.url).searchParams.get("scope") ?? "public").toLowerCase();
  const includePrivate = scope === "full";

  const keys = await prisma.pgpKey.findMany({
    orderBy: { createdAt: "asc" },
    include: { user: { select: { email: true } } },
  });

  const stamp = new Date().toISOString();
  const header = [
    `# PGP·Vault — bulk key export`,
    `# scope:       ${includePrivate ? "full (public + private)" : "public only"}`,
    `# generated:   ${stamp}`,
    `# exported by: ${session?.user?.email ?? user.id}`,
    `# total keys:  ${keys.length}`,
    "",
  ].join("\n");

  const blocks: string[] = [];
  for (const k of keys) {
    const meta = [
      `# ────────────────────────────────────────────────────────────`,
      `# ${k.name}${k.email ? ` <${k.email}>` : ""}`,
      `# owner:       ${k.user.email}`,
      `# fingerprint: ${k.fingerprint}`,
      `# key id:      ${k.keyId}`,
      `# algorithm:   ${k.algorithm ?? "—"}`,
      `# created:     ${k.createdAt.toISOString()}`,
      k.expiresAt ? `# expires:     ${k.expiresAt.toISOString()}` : "# expires:     never",
      includePrivate && k.passphrase ? `# passphrase:  ${k.passphrase}` : null,
      "",
    ].filter(Boolean).join("\n");

    let body = k.publicKey.trim();
    if (includePrivate && k.privateKey) body += `\n\n${k.privateKey.trim()}`;

    blocks.push(`${meta}\n${body}\n`);
  }

  const payload = `${header}\n${blocks.join("\n")}`;

  const filename = `pgpvault-export-${includePrivate ? "full" : "public"}-${stamp.replace(/[:.]/g, "-")}.asc`;

  await logActivity(
    user.id,
    "admin_export_bulk",
    `${includePrivate ? "full" : "public"} · ${keys.length} keys`,
  );

  return new NextResponse(payload, {
    status: 200,
    headers: {
      "Content-Type": "application/pgp-keys; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
