import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { encryptText, splitArmoredPublicKeys, readPublicKeyMeta } from "@/lib/pgp";
import { logActivity } from "@/lib/activity";

export async function POST(req: Request) {
  const session = await auth();
  const user = session?.user as { id?: string } | undefined;
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { text, keyIds, pastedPublicKeys } = (await req.json()) as {
    text?: string;
    keyIds?: string[];
    pastedPublicKeys?: string;
  };

  if (!text) return NextResponse.json({ error: "text is required" }, { status: 400 });

  // saved keys (only the user's own)
  const savedKeys = Array.isArray(keyIds) && keyIds.length > 0
    ? await prisma.pgpKey.findMany({ where: { id: { in: keyIds }, userId: user.id } })
    : [];

  // pasted keys — split + validate
  const pastedBlocks = pastedPublicKeys ? splitArmoredPublicKeys(pastedPublicKeys) : [];
  const validatedPasted: string[] = [];
  for (const block of pastedBlocks) {
    try {
      await readPublicKeyMeta(block);
      validatedPasted.push(block);
    } catch {
      return NextResponse.json({ error: "One of the pasted public keys is invalid." }, { status: 400 });
    }
  }

  const allArmored = [...savedKeys.map((k) => k.publicKey), ...validatedPasted];
  if (allArmored.length === 0) {
    return NextResponse.json({ error: "At least one recipient is required (saved or pasted)." }, { status: 400 });
  }

  try {
    const encrypted = await encryptText(text, allArmored);
    await logActivity(
      user.id,
      "encrypt",
      `server-side · ${savedKeys.length} saved + ${validatedPasted.length} pasted recipient(s)`,
    );
    return NextResponse.json({ result: encrypted });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
