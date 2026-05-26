import * as openpgp from "openpgp";

export type GenerateKeyInput = {
  name: string;
  email: string;
  passphrase: string;
  type?: "rsa" | "ecc";
  rsaBits?: 2048 | 3072 | 4096;
  curve?: "curve25519" | "p256" | "p384" | "p521";
  expiresInDays?: number;
};

export async function generateKey(input: GenerateKeyInput) {
  const opts: Record<string, unknown> = {
    userIDs: [{ name: input.name, email: input.email }],
    passphrase: input.passphrase,
    format: "armored",
  };
  if (input.expiresInDays && input.expiresInDays > 0) {
    opts.keyExpirationTime = input.expiresInDays * 24 * 60 * 60;
  }
  if (input.type === "ecc") {
    opts.type = "ecc";
    opts.curve = input.curve ?? "curve25519";
  } else {
    opts.type = "rsa";
    opts.rsaBits = input.rsaBits ?? 3072;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { privateKey, publicKey } = await openpgp.generateKey(opts as any);
  const meta = await readPublicKeyMeta(publicKey as string);
  return {
    publicKey: publicKey as string,
    privateKey: privateKey as string,
    ...meta,
  };
}

export async function readPublicKeyMeta(armored: string) {
  const key = await openpgp.readKey({ armoredKey: armored });
  const userIds = key.getUserIDs();
  const primary = userIds[0] ?? "";
  const emailMatch = primary.match(/<(.+?)>/);
  const nameMatch = primary.match(/^([^<]+?)\s*(<|$)/);

  let expiresAt: Date | null = null;
  try {
    const exp = await key.getExpirationTime();
    if (exp instanceof Date) expiresAt = exp;
  } catch {}

  return {
    fingerprint: key.getFingerprint().toUpperCase(),
    keyId: key.getKeyID().toHex().toUpperCase(),
    name: nameMatch ? nameMatch[1].trim() : primary,
    email: emailMatch ? emailMatch[1] : null,
    algorithm: key.getAlgorithmInfo().algorithm,
    expiresAt,
  };
}

export async function readPrivateKeyArmored(armored: string) {
  return openpgp.readPrivateKey({ armoredKey: armored });
}

/**
 * Split a blob of text into individual armored PGP public-key blocks.
 * Tolerant of extra whitespace and multiple keys concatenated.
 */
export function splitArmoredPublicKeys(text: string): string[] {
  const blocks: string[] = [];
  const lines = text.split(/\r?\n/);
  let current: string[] = [];
  let inBlock = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("-----BEGIN PGP PUBLIC KEY BLOCK-----")) {
      inBlock = true;
      current = [line];
    } else if (inBlock) {
      current.push(line);
      if (trimmed.startsWith("-----END PGP PUBLIC KEY BLOCK-----")) {
        blocks.push(current.join("\n"));
        current = [];
        inBlock = false;
      }
    }
  }
  return blocks;
}

export async function encryptText(plaintext: string, publicKeysArmored: string[]) {
  const encryptionKeys = await Promise.all(
    publicKeysArmored.map((k) => openpgp.readKey({ armoredKey: k })),
  );
  const message = await openpgp.createMessage({ text: plaintext });
  const encrypted = await openpgp.encrypt({
    message,
    encryptionKeys,
    format: "armored",
  });
  return encrypted as string;
}

export async function decryptText(
  ciphertext: string,
  privateKeyArmored: string,
  passphrase: string,
) {
  let privateKey = await openpgp.readPrivateKey({ armoredKey: privateKeyArmored });
  if (!privateKey.isDecrypted()) {
    privateKey = await openpgp.decryptKey({ privateKey, passphrase });
  }
  const message = await openpgp.readMessage({ armoredMessage: ciphertext });
  const { data } = await openpgp.decrypt({ message, decryptionKeys: privateKey });
  return data as string;
}

export async function signText(
  text: string,
  privateKeyArmored: string,
  passphrase: string,
) {
  let privateKey = await openpgp.readPrivateKey({ armoredKey: privateKeyArmored });
  if (!privateKey.isDecrypted()) {
    privateKey = await openpgp.decryptKey({ privateKey, passphrase });
  }
  const message = await openpgp.createCleartextMessage({ text });
  const signed = await openpgp.sign({ message, signingKeys: privateKey });
  return signed as string;
}

export async function verifyText(signedMessage: string, publicKeyArmored: string) {
  const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
  const message = await openpgp.readCleartextMessage({ cleartextMessage: signedMessage });
  const verification = await openpgp.verify({ message, verificationKeys: publicKey });
  const sig = verification.signatures[0];
  try {
    await sig.verified;
    return { valid: true, text: verification.data as string };
  } catch (e) {
    return { valid: false, text: verification.data as string, error: (e as Error).message };
  }
}
