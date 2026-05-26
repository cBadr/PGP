import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { CopyBlock } from "@/components/CopyBlock";
import { PassphraseField } from "@/components/PassphraseField";
import { KeyRound, Trash2, Fingerprint, Calendar, KeySquare, Hash, ArrowLeft, Pencil } from "lucide-react";

async function del(formData: FormData) {
  "use server";
  const session = await auth();
  const user = session?.user as { id?: string } | undefined;
  if (!user?.id) throw new Error("Unauthorized");
  const id = String(formData.get("id"));
  const key = await prisma.pgpKey.findUnique({ where: { id } });
  if (!key || key.userId !== user.id) throw new Error("Not found");
  await prisma.pgpKey.delete({ where: { id } });
  await logActivity(user.id, "delete_key", key.fingerprint);
  revalidatePath("/keys");
  redirect("/keys");
}

export default async function KeyDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const user = session?.user as { id?: string } | undefined;
  if (!user?.id) redirect("/login");

  const key = await prisma.pgpKey.findUnique({ where: { id } });
  if (!key || key.userId !== user.id) notFound();

  return (
    <div className="max-w-4xl space-y-6">
      <Link href="/keys" className="inline-flex items-center gap-1.5 text-sm text-white/55 hover:text-white">
        <ArrowLeft size={14} /> Back to keys
      </Link>

      <div className="glass-card p-7">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div className="size-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-xl shadow-violet-500/40">
              <KeyRound size={26} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{key.name}</h1>
              {key.email && <div className="text-white/55">{key.email}</div>}
              <div className="flex gap-1.5 mt-2 flex-wrap">
                <span className="badge badge-violet">{key.algorithm}</span>
                {key.privateKey && <span className="badge badge-emerald">private</span>}
                <span className="badge badge-cyan">public</span>
                {key.expiresAt && <span className="badge badge-amber">expires {key.expiresAt.toLocaleDateString()}</span>}
              </div>
            </div>
          </div>
          <Link href={`/keys/${key.id}/edit`} className="btn-ghost">
            <Pencil size={14} /> Edit
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Info icon={<Fingerprint />} label="Fingerprint" value={key.fingerprint} mono />
        <Info icon={<Hash />}        label="Key ID"      value={key.keyId} mono />
        <Info icon={<Calendar />}    label="Created"     value={key.createdAt.toLocaleString()} />
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/45">
            <KeySquare size={14} /> Passphrase
          </div>
          <div className="mt-2">
            <PassphraseField value={key.passphrase} />
          </div>
        </div>
      </div>

      <CopyBlock label="Public key" value={key.publicKey} />
      {key.privateKey && <CopyBlock label="Private key" value={key.privateKey} />}

      <form action={del} className="glass-card p-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="font-semibold text-rose-300 flex items-center gap-2"><Trash2 size={16} /> Danger zone</div>
          <div className="text-xs text-white/50">Deleting a key removes it permanently from your vault.</div>
        </div>
        <input type="hidden" name="id" value={key.id} />
        <button className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-200 border border-rose-400/40 hover:bg-rose-500/30 transition text-sm font-semibold">
          Delete key
        </button>
      </form>
    </div>
  );
}

function Info({ icon, label, value, mono = false }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/45">
        {icon} {label}
      </div>
      <div className={`mt-2 break-all ${mono ? "font-mono text-xs" : "text-sm"}`}>{value}</div>
    </div>
  );
}
