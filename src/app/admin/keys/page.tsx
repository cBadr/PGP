import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logAdminRead } from "@/lib/activity";
import { KeyRound, ChevronDown, Pencil, Download, Archive } from "lucide-react";

export default async function AdminKeys() {
  const session = await auth();
  const me = session?.user as { id?: string } | undefined;
  if (me?.id) await logAdminRead(me.id, "keys_list_full");

  // Admin oversight mode — full data is loaded so the operator can manage,
  // export, and audit every key in the system. The admin_read event above
  // records that this happened.
  const keys = await prisma.pgpKey.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, email: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <KeyRound className="text-cyan-300" /> All PGP Keys
            <span className="badge badge-cyan">{keys.length}</span>
          </h1>
          <p className="text-white/55 text-sm mt-1">
            Full admin view — public keys, private keys, passphrases and export tools below.
          </p>
        </div>

        {keys.length > 0 && (
          <div className="flex items-center gap-2">
            <a
              href="/api/admin/keys/export?scope=public"
              className="btn-ghost text-xs"
              title="Download every public key in one .asc file"
            >
              <Archive size={13} /> Export all public
            </a>
            <a
              href="/api/admin/keys/export?scope=full"
              className="btn-primary text-xs"
              title="Download every key with private bodies + a metadata.json sidecar"
            >
              <Archive size={13} /> Export all (full)
            </a>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {keys.map((k) => (
          <details key={k.id} className="glass-card overflow-hidden group">
            <summary className="cursor-pointer p-5 flex items-center justify-between list-none gap-3">
              <div className="flex items-center gap-4 min-w-0">
                <span className="size-10 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center shadow-lg shadow-cyan-500/30 shrink-0">
                  <KeyRound size={18} className="text-white" />
                </span>
                <div className="min-w-0">
                  <div className="font-semibold truncate">
                    {k.name} {k.email && <span className="text-white/50 font-normal">&lt;{k.email}&gt;</span>}
                  </div>
                  <div className="text-xs text-white/40 font-mono mt-0.5 truncate">{k.fingerprint.slice(-32)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="badge badge-violet text-[10px]">{k.user.email}</span>
                {k.privateKey && <span className="badge badge-emerald">private</span>}
                <span className="badge badge-cyan">{k.algorithm}</span>
                <ChevronDown size={16} className="text-white/40 group-open:rotate-180 transition" />
              </div>
            </summary>

            <div className="border-t border-white/5 p-5 space-y-4 bg-black/20">
              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <KV k="Owner"       v={k.user.email} />
                <KV k="Fingerprint" v={k.fingerprint} mono />
                <KV k="Key ID"      v={k.keyId} mono />
                <KV k="Passphrase"  v={k.passphrase ?? "(none)"} mono />
                <KV k="Created"     v={k.createdAt.toLocaleString()} />
                <KV k="Expires"     v={k.expiresAt ? k.expiresAt.toLocaleString() : "Never"} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs uppercase tracking-widest text-white/50">Public key</span>
                  <a
                    href={`/api/admin/keys/${k.id}/export?type=public`}
                    className="text-[11px] inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200"
                  >
                    <Download size={12} /> .asc
                  </a>
                </div>
                <pre className="code-block">{k.publicKey}</pre>
              </div>

              {k.privateKey && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs uppercase tracking-widest text-amber-300/80">Private key</span>
                    <span className="flex items-center gap-2">
                      <a
                        href={`/api/admin/keys/${k.id}/export?type=private`}
                        className="text-[11px] inline-flex items-center gap-1 text-amber-300 hover:text-amber-200"
                      >
                        <Download size={12} /> private.asc
                      </a>
                      <a
                        href={`/api/admin/keys/${k.id}/export?type=both`}
                        className="text-[11px] inline-flex items-center gap-1 text-violet-300 hover:text-violet-200"
                      >
                        <Download size={12} /> bundle.asc
                      </a>
                    </span>
                  </div>
                  <pre className="code-block">{k.privateKey}</pre>
                </div>
              )}

              <div className="flex gap-2 pt-2 border-t border-white/5">
                <Link href={`/admin/keys/${k.id}/edit`} className="btn-primary text-xs py-1.5 px-3">
                  <Pencil size={13} /> Edit / Delete
                </Link>
              </div>
            </div>
          </details>
        ))}
        {keys.length === 0 && (
          <div className="glass-card p-12 text-center text-white/45">No keys in the system yet.</div>
        )}
      </div>
    </div>
  );
}

function KV({ k, v, mono = false }: { k: string; v: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-white/40">{k}</div>
      <div className={`mt-0.5 break-all ${mono ? "font-mono" : ""}`}>{v}</div>
    </div>
  );
}
