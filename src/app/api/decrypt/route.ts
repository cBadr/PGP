import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { decryptText } from "@/lib/pgp";
import { logActivity } from "@/lib/activity";

export async function POST(req: Request) {
  const session = await auth();
  const user = session?.user as { id?: string } | undefined;
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { ciphertext, keyId, passphrase } = await req.json();
  if (!ciphertext || !keyId) {
    return NextResponse.json({ error: "ciphertext and keyId required" }, { status: 400 });
  }
  const key = await prisma.pgpKey.findFirst({ where: { id: keyId, userId: user.id } });
  if (!key || !key.privateKey) return NextResponse.json({ error: "Private key not found" }, { status: 404 });

  try {
    const plaintext = await decryptText(ciphertext, key.privateKey, passphrase ?? key.passphrase ?? "");
    await logActivity(user.id, "decrypt", `server-side · ${key.fingerprint.slice(-16)}`);
    return NextResponse.json({ result: plaintext });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
