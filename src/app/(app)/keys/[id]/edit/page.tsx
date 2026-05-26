import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { KeyRound, ArrowLeft, Save } from "lucide-react";

async function update(formData: FormData) {
  "use server";
  const session = await auth();
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id) throw new Error("Unauthorized");

  const id = String(formData.get("id"));
  const key = await prisma.pgpKey.findUnique({ where: { id } });
  if (!key) throw new Error("Not found");
  if (key.userId !== user.id && user.role !== "admin") throw new Error("Forbidden");

  const name       = String(formData.get("name") ?? "").trim();
  const email      = String(formData.get("email") ?? "").trim() || null;
  const passphrase = String(formData.get("passphrase") ?? "") || null;

  if (!name) throw new Error("Name is required");

  await prisma.pgpKey.update({
    where: { id },
    data: { name, email, passphrase },
  });
  await logActivity(user.id, "edit_key", `${key.fingerprint.slice(-16)} → ${name}`);
  revalidatePath(`/keys/${id}`);
  redirect(`/keys/${id}`);
}

export default async function EditKey({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id) redirect("/login");

  const key = await prisma.pgpKey.findUnique({ where: { id } });
  if (!key) notFound();
  if (key.userId !== user.id && user.role !== "admin") redirect("/keys");

  return (
    <div className="max-w-2xl mx-auto">
      <Link href={`/keys/${id}`} className="inline-flex items-center gap-1.5 text-sm text-white/55 hover:text-white">
        <ArrowLeft size={14} /> Back to key
      </Link>

      <div className="mt-4 mb-6 flex items-center gap-3">
        <span className="size-11 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
          <KeyRound className="text-white" />
        </span>
        <div>
          <h1 className="text-3xl font-bold">Edit key</h1>
          <p className="text-white/55 text-sm">
            Update display metadata and stored passphrase. The cryptographic key material itself is immutable.
          </p>
        </div>
      </div>

      <form action={update} className="glass-card p-7 space-y-5">
        <input type="hidden" name="id" value={key.id} />

        <Field name="name" label="Display name" defaultValue={key.name} required />
        <Field name="email" label="Email" defaultValue={key.email ?? ""} type="email" />
        <Field
          name="passphrase"
          label="Passphrase"
          defaultValue={key.passphrase ?? ""}
          hint="stored so you don't have to re-type it for decrypt/sign"
        />

        <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-white/5 text-xs">
          <RO label="Fingerprint" value={key.fingerprint} />
          <RO label="Algorithm"   value={key.algorithm ?? "—"} />
        </div>

        <div className="flex gap-3 pt-2">
          <button className="btn-primary flex-1"><Save size={15} /> Save changes</button>
          <Link href={`/keys/${id}`} className="btn-ghost">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

function Field({
  name, label, defaultValue = "", type = "text", required, hint,
}: { name: string; label: string; defaultValue?: string; type?: string; required?: boolean; hint?: string }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-widest text-white/50 mb-1.5">
        {label} {hint && <span className="text-white/30 normal-case tracking-normal">· {hint}</span>}
      </span>
      <input name={name} type={type} required={required} defaultValue={defaultValue} className="input" />
    </label>
  );
}

function RO({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
      <div className="text-white/40">{label}</div>
      <div className="mt-1 font-mono break-all">{value}</div>
    </div>
  );
}
