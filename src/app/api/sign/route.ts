import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { signText } from "@/lib/pgp";
import { logActivity } from "@/lib/activity";

export async function POST(req: Request) {
  const session = await auth();
  const user = session?.user as { id?: string } | undefined;
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { text, keyId, passphrase } = await req.json();
  if (!text || !keyId) return NextResponse.json({ error: "text and keyId required" }, { status: 400 });

  const key = await prisma.pgpKey.findFirst({ where: { id: keyId, userId: user.id } });
  if (!key || !key.privateKey) return NextResponse.json({ error: "Private key not found" }, { status: 404 });

  try {
    const effectivePass = (passphrase && String(passphrase)) || key.passphrase || "";
    const signed = await signText(text, key.privateKey, effectivePass);
    await logActivity(user.id, "sign", `server-side · ${key.fingerprint.slice(-16)}`);
    return NextResponse.json({ result: signed });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
