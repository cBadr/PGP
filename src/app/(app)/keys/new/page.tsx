import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateKey } from "@/lib/pgp";
import { logActivity } from "@/lib/activity";
import { Plus } from "lucide-react";

async function create(formData: FormData) {
  "use server";
  const session = await auth();
  const user = session?.user as { id?: string } | undefined;
  if (!user?.id) throw new Error("Unauthorized");

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const passphrase = String(formData.get("passphrase") ?? "");
  const type = String(formData.get("type") ?? "rsa") as "rsa" | "ecc";
  const rsaBits = Number(formData.get("rsaBits") ?? 3072) as 2048 | 3072 | 4096;
  const curve = String(formData.get("curve") ?? "curve25519") as "curve25519" | "p256" | "p384" | "p521";
  const expiresInDays = Number(formData.get("expiresInDays") ?? 0);

  if (!name || !email || !passphrase) throw new Error("All fields required");

  const result = await generateKey({ name, email, passphrase, type, rsaBits, curve, expiresInDays });

  const key = await prisma.pgpKey.create({
    data: {
      userId: user.id,
      name: result.name,
      email: result.email,
      publicKey: result.publicKey,
      privateKey: result.privateKey,
      passphrase,
      fingerprint: result.fingerprint,
      keyId: result.keyId,
      algorithm: result.algorithm,
      expiresAt: result.expiresAt,
    },
  });
  await logActivity(user.id, "generate_key", `${name} <${email}> (${type})`);
  redirect(`/keys/${key.id}`);
}

export default async function NewKey() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <span className="size-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Plus className="text-white" />
          </span>
          Generate a new key
        </h1>
        <p className="text-white/55 mt-2 text-sm">RSA or elliptic curve, with passphrase and expiry.</p>
      </div>

      <form action={create} className="glass-card p-7 space-y-5">
        <Field name="name" label="Full name" required />
        <Field name="email" label="Email" type="email" required />
        <Field name="passphrase" label="Passphrase" required />

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <Label>Algorithm</Label>
            <select name="type" className="select">
              <option value="rsa">RSA — classic</option>
              <option value="ecc">ECC — modern, smaller</option>
            </select>
          </label>
          <Field name="expiresInDays" label="Expires in (days)" type="number" hint="0 = never" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <Label>RSA bits</Label>
            <select name="rsaBits" className="select" defaultValue="3072">
              <option value="2048">2048</option>
              <option value="3072">3072 (recommended)</option>
              <option value="4096">4096</option>
            </select>
          </label>
          <label className="block">
            <Label>ECC curve</Label>
            <select name="curve" className="select">
              <option value="curve25519">curve25519 (recommended)</option>
              <option value="p256">p256</option>
              <option value="p384">p384</option>
              <option value="p521">p521</option>
            </select>
          </label>
        </div>

        <button className="btn-primary w-full">
          <Plus size={15} /> Generate key (may take a few seconds)
        </button>
      </form>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="block text-xs uppercase tracking-widest text-white/50 mb-1.5">{children}</span>;
}
function Field({ name, label, type = "text", required, hint }: { name: string; label: string; type?: string; required?: boolean; hint?: string }) {
  return (
    <label className="block">
      <Label>{label} {hint && <span className="text-white/30 normal-case tracking-normal">· {hint}</span>}</Label>
      <input name={name} type={type} required={required} className="input" />
    </label>
  );
}
