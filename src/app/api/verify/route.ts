import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { verifyText } from "@/lib/pgp";
import { logActivity } from "@/lib/activity";

export async function POST(req: Request) {
  const session = await auth();
  const user = session?.user as { id?: string } | undefined;
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { signedMessage, keyId, publicKey } = await req.json();
  if (!signedMessage) return NextResponse.json({ error: "signedMessage required" }, { status: 400 });

  let pub = publicKey as string | undefined;
  if (!pub && keyId) {
    const key = await prisma.pgpKey.findFirst({ where: { id: keyId, userId: user.id } });
    if (!key) return NextResponse.json({ error: "Key not found" }, { status: 404 });
    pub = key.publicKey;
  }
  if (!pub) return NextResponse.json({ error: "Public key required" }, { status: 400 });

  const result = await verifyText(signedMessage, pub);
  await logActivity(user.id, "verify", `server-side · valid=${result.valid}`);
  return NextResponse.json(result);
}
