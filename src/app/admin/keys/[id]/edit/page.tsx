import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { KeyRound, ArrowLeft, Save, ShieldCheck } from "lucide-react";

async function update(formData: FormData) {
  "use server";
  const session = await auth();
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "admin") throw new Error("Forbidden");

  const id = String(formData.get("id"));
  const key = await prisma.pgpKey.findUnique({ where: { id } });
  if (!key) throw new Error("Not found");

  const name       = String(formData.get("name") ?? "").trim();
  const email      = String(formData.get("email") ?? "").trim() || null;
  const passphrase = String(formData.get("passphrase") ?? "") || null;
  if (!name) throw new Error("Name is required");

  await prisma.pgpKey.update({
    where: { id },
    data: { name, email, passphrase },
  });
  await logActivity(user.id, "admin_edit_key", `${key.fingerprint.slice(-16)} owned by ${key.userId}`);
  revalidatePath("/admin/keys");
  redirect("/admin/keys");
}

async function del(formData: FormData) {
  "use server";
  const session = await auth();
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "admin") throw new Error("Forbidden");
  const id = String(formData.get("id"));
  const key = await prisma.pgpKey.findUnique({ where: { id } });
  if (!key) throw new Error("Not found");
  await prisma.pgpKey.delete({ where: { id } });
  await logActivity(user.id, "admin_delete_key", `${key.fingerprint} (owner ${key.userId})`);
  revalidatePath("/admin/keys");
  redirect("/admin/keys");
}

export default async function AdminEditKey({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "admin") redirect("/dashboard");

  const key = await prisma.pgpKey.findUnique({ where: { id }, include: { user: true } });
  if (!key) notFound();

  return (
    <div className="max-w-2xl">
      <Link href="/admin/keys" className="inline-flex items-center gap-1.5 text-sm text-white/55 hover:text-white">
        <ArrowLeft size={14} /> Back to all keys
      </Link>

      <div className="mt-4 mb-6 flex items-center gap-3">
        <span className="size-11 rounded-xl bg-gradient-to-br from-rose-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
          <KeyRound className="text-white" />
        </span>
        <div>
          <h1 className="text-3xl font-bold inline-flex items-center gap-2">Edit key <span className="badge badge-rose"><ShieldCheck size={12} /> admin</span></h1>
          <p className="text-white/55 text-sm">
            Owner: <span className="text-white/85">{key.user.email}</span> · {key.fingerprint.slice(-16)}
          </p>
        </div>
      </div>

      <form action={update} className="glass-card p-7 space-y-5">
        <input type="hidden" name="id" value={key.id} />
        <Field name="name"       label="Display name" defaultValue={key.name} required />
        <Field name="email"      label="Email"        defaultValue={key.email ?? ""} type="email" />
        <Field name="passphrase" label="Passphrase"   defaultValue={key.passphrase ?? ""} />

        <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-white/5 text-xs">
          <RO label="Fingerprint" value={key.fingerprint} />
          <RO label="Algorithm"   value={key.algorithm ?? "—"} />
        </div>

        <div className="flex gap-3 pt-2">
          <button className="btn-primary flex-1"><Save size={15} /> Save changes</button>
          <Link href="/admin/keys" className="btn-ghost">Cancel</Link>
        </div>
      </form>

      <form action={del} className="mt-6 glass-card p-5 flex items-center justify-between flex-wrap gap-3 border-rose-400/30">
        <div>
          <div className="font-semibold text-rose-300">Danger zone</div>
          <div className="text-xs text-white/50">Permanently delete this key from {key.user.email}'s vault.</div>
        </div>
        <input type="hidden" name="id" value={key.id} />
        <button className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-200 border border-rose-400/40 hover:bg-rose-500/30 transition text-sm font-semibold">
          Delete key
        </button>
      </form>
    </div>
  );
}

function Field({
  name, label, defaultValue = "", type = "text", required,
}: { name: string; label: string; defaultValue?: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-widest text-white/50 mb-1.5">{label}</span>
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
