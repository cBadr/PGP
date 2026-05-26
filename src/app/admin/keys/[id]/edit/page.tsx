import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logActivity, logAdminRead } from "@/lib/activity";
import { KeyRound, ArrowLeft, ShieldCheck, Trash2, Lock } from "lucide-react";

async function del(formData: FormData) {
  "use server";
  const session = await auth();
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "admin") throw new Error("Forbidden");
  const id = String(formData.get("id"));
  const key = await prisma.pgpKey.findUnique({
    where: { id },
    select: { id: true, fingerprint: true, userId: true },
  });
  if (!key) throw new Error("Not found");
  await prisma.pgpKey.delete({ where: { id } });
  await logActivity(user.id, "admin_delete_key", `${key.fingerprint} (owner ${key.userId})`);
  revalidatePath("/admin/keys");
  redirect("/admin/keys");
}

export default async function AdminManageKey({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "admin") redirect("/dashboard");

  // Admin sees metadata only — never the public/private key body or passphrase.
  const key = await prisma.pgpKey.findUnique({
    where: { id },
    select: {
      id: true, name: true, email: true,
      fingerprint: true, keyId: true, algorithm: true,
      createdAt: true, expiresAt: true,
      user: { select: { email: true, id: true } },
    },
  });
  if (!key) notFound();

  await logAdminRead(user.id, "key_detail", `${key.fingerprint.slice(-16)} owner=${key.user.email}`);

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
          <h1 className="text-3xl font-bold inline-flex items-center gap-2">
            Manage key <span className="badge badge-rose"><ShieldCheck size={12} /> admin</span>
          </h1>
          <p className="text-white/55 text-sm">
            Owner: <span className="text-white/85">{key.user.email}</span> · {key.fingerprint.slice(-16)}
          </p>
        </div>
      </div>

      <div className="glass-card p-5 mb-4 flex items-start gap-3 text-sm">
        <Lock size={16} className="text-emerald-300 mt-0.5 shrink-0" />
        <div>
          <div className="font-semibold text-emerald-300">Privacy-respecting view</div>
          <div className="text-white/60 mt-1">
            You can rename or delete this key on the owner's behalf, but the public/private key material
            and the passphrase are not shown to admins. Owner editing happens at <code className="font-mono text-xs">/keys/[id]/edit</code>.
          </div>
        </div>
      </div>

      <div className="glass-card p-7 space-y-3 text-sm">
        <KV label="Name"        value={key.name} />
        <KV label="Email"       value={key.email ?? "—"} />
        <KV label="Algorithm"   value={key.algorithm ?? "—"} />
        <KV label="Fingerprint" value={key.fingerprint} mono />
        <KV label="Key ID"      value={key.keyId} mono />
        <KV label="Created"     value={key.createdAt.toLocaleString()} />
        <KV label="Expires"     value={key.expiresAt ? key.expiresAt.toLocaleString() : "Never"} />
      </div>

      <form action={del} className="mt-6 glass-card p-5 flex items-center justify-between flex-wrap gap-3 border-rose-400/30">
        <div>
          <div className="font-semibold text-rose-300 inline-flex items-center gap-2">
            <Trash2 size={16} /> Danger zone
          </div>
          <div className="text-xs text-white/50">Permanently delete this key from {key.user.email}'s vault. This is irreversible.</div>
        </div>
        <input type="hidden" name="id" value={key.id} />
        <button className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-200 border border-rose-400/40 hover:bg-rose-500/30 transition text-sm font-semibold">
          Delete key
        </button>
      </form>
    </div>
  );
}

function KV({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="text-xs uppercase tracking-widest text-white/45">{label}</div>
      <div className={`col-span-2 break-all ${mono ? "font-mono text-xs" : ""}`}>{value}</div>
    </div>
  );
}
