import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logAdminRead } from "@/lib/activity";
import { KeyRound, ChevronDown, Lock, Trash2 } from "lucide-react";

export default async function AdminKeys() {
  const session = await auth();
  const me = session?.user as { id?: string } | undefined;
  if (me?.id) await logAdminRead(me.id, "keys_list");

  // Admin sees only metadata. publicKey / privateKey / passphrase bodies are
  // intentionally NOT selected so they're never read into memory here.
  const keys = await prisma.pgpKey.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, name: true, email: true,
      fingerprint: true, keyId: true, algorithm: true,
      createdAt: true, expiresAt: true,
      user: { select: { email: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <KeyRound className="text-cyan-300" /> All PGP Keys
          <span className="badge badge-cyan">{keys.length}</span>
        </h1>
        <p className="text-white/55 text-sm mt-1 inline-flex items-center gap-1.5">
          <Lock size={13} className="text-emerald-300" />
          Admin sees key metadata only — public keys, private keys and passphrases stay with their owner.
        </p>
      </div>

      <div className="space-y-3">
        {keys.map((k) => (
          <div key={k.id} className="glass-card p-5 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-4 min-w-0">
              <span className="size-10 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center shadow-lg shadow-cyan-500/30 shrink-0">
                <KeyRound size={18} className="text-white" />
              </span>
              <div className="min-w-0">
                <div className="font-semibold truncate">
                  {k.name} {k.email && <span className="text-white/50 font-normal">&lt;{k.email}&gt;</span>}
                </div>
                <div className="text-xs text-white/40 font-mono mt-0.5 truncate">{k.fingerprint.slice(-32)}</div>
                <div className="text-[11px] text-white/40 mt-0.5">
                  Owner: <span className="text-white/65">{k.user.email}</span> · created {k.createdAt.toLocaleDateString()}
                  {k.expiresAt && ` · expires ${k.expiresAt.toLocaleDateString()}`}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="badge badge-cyan">{k.algorithm}</span>
              <Link href={`/admin/keys/${k.id}/edit`} className="btn-ghost text-xs py-1.5 px-3">
                <Trash2 size={13} /> Manage
              </Link>
            </div>
          </div>
        ))}
        {keys.length === 0 && (
          <div className="glass-card p-12 text-center text-white/45">No keys in the system yet.</div>
        )}
      </div>
    </div>
  );
}
