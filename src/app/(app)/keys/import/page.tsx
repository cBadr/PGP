import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { readPublicKeyMeta } from "@/lib/pgp";
import { logActivity } from "@/lib/activity";
import { Download } from "lucide-react";

async function importKey(formData: FormData) {
  "use server";
  const session = await auth();
  const user = session?.user as { id?: string } | undefined;
  if (!user?.id) throw new Error("Unauthorized");

  const publicKey = String(formData.get("publicKey") ?? "").trim();
  const privateKey = String(formData.get("privateKey") ?? "").trim() || null;
  const passphrase = String(formData.get("passphrase") ?? "") || null;

  if (!publicKey) throw new Error("Public key is required");

  const meta = await readPublicKeyMeta(publicKey);
  const key = await prisma.pgpKey.create({
    data: {
      userId: user.id,
      name: meta.name,
      email: meta.email,
      publicKey,
      privateKey,
      passphrase,
      fingerprint: meta.fingerprint,
      keyId: meta.keyId,
      algorithm: meta.algorithm,
      expiresAt: meta.expiresAt,
    },
  });
  await logActivity(user.id, "import_key", `${meta.name} <${meta.email}>`);
  redirect(`/keys/${key.id}`);
}

export default async function ImportKey() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <span className="size-10 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Download className="text-white" />
          </span>
          Import a key
        </h1>
        <p className="text-white/55 mt-2 text-sm">Paste an ASCII-armored key block.</p>
      </div>

      <form action={importKey} className="glass-card p-7 space-y-5">
        <label className="block">
          <span className="block text-xs uppercase tracking-widest text-white/50 mb-1.5">Public key <span className="text-rose-300 normal-case">required</span></span>
          <textarea name="publicKey" rows={9} required className="textarea" placeholder="-----BEGIN PGP PUBLIC KEY BLOCK-----" />
        </label>
        <label className="block">
          <span className="block text-xs uppercase tracking-widest text-white/50 mb-1.5">Private key <span className="text-white/30 normal-case">optional</span></span>
          <textarea name="privateKey" rows={9} className="textarea" placeholder="-----BEGIN PGP PRIVATE KEY BLOCK-----" />
        </label>
        <label className="block">
          <span className="block text-xs uppercase tracking-widest text-white/50 mb-1.5">Passphrase</span>
          <input name="passphrase" type="text" className="input" />
        </label>
        <button className="btn-primary w-full"><Download size={15} /> Import key</button>
      </form>
    </div>
  );
}
