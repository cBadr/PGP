import { prisma } from "@/lib/prisma";
import { KeyRound, ChevronDown } from "lucide-react";

export default async function AdminKeys() {
  const keys = await prisma.pgpKey.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <KeyRound className="text-cyan-300" /> All PGP Keys
          <span className="badge badge-cyan">{keys.length}</span>
        </h1>
        <p className="text-white/55 text-sm mt-1">Every key in the system — public, private and passphrases visible.</p>
      </div>

      <div className="space-y-3">
        {keys.map((k) => (
          <details key={k.id} className="glass-card overflow-hidden group">
            <summary className="cursor-pointer p-5 flex items-center justify-between list-none">
              <div className="flex items-center gap-4">
                <span className="size-10 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <KeyRound size={18} className="text-white" />
                </span>
                <div>
                  <div className="font-semibold">{k.name} {k.email && <span className="text-white/50 font-normal">&lt;{k.email}&gt;</span>}</div>
                  <div className="text-xs text-white/40 font-mono mt-0.5">{k.fingerprint.slice(-32)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
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
                <div className="text-xs uppercase tracking-widest text-white/50 mb-1.5">Public key</div>
                <pre className="code-block">{k.publicKey}</pre>
              </div>
              {k.privateKey && (
                <div>
                  <div className="text-xs uppercase tracking-widest text-amber-300/80 mb-1.5">Private key</div>
                  <pre className="code-block">{k.privateKey}</pre>
                </div>
              )}
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
