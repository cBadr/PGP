import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { encryptText } from "@/lib/pgp";
import { logActivity } from "@/lib/activity";

export async function POST(req: Request) {
  const session = await auth();
  const user = session?.user as { id?: string } | undefined;
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { text, keyIds } = await req.json();
  if (!text || !Array.isArray(keyIds) || keyIds.length === 0) {
    return NextResponse.json({ error: "text and keyIds required" }, { status: 400 });
  }
  const keys = await prisma.pgpKey.findMany({
    where: { id: { in: keyIds }, userId: user.id },
  });
  if (keys.length === 0) return NextResponse.json({ error: "No keys found" }, { status: 404 });

  const encrypted = await encryptText(text, keys.map((k) => k.publicKey));
  await logActivity(user.id, "encrypt", `server-side · ${keys.length} recipient(s)`);
  return NextResponse.json({ result: encrypted });
}
