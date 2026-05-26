import { prisma } from "@/lib/prisma";
import { Activity, Plus, Download, KeyRound, Lock, Unlock, PenLine, CheckCircle2 } from "lucide-react";

export default async function AdminActivity() {
  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { user: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Activity className="text-emerald-300" /> Activity Log
          <span className="badge badge-emerald">latest 200</span>
        </h1>
        <p className="text-white/55 text-sm mt-1">Every action performed in the system, server- or client-side.</p>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-widest text-white/50">
            <tr><Th>When</Th><Th>Action</Th><Th>User</Th><Th>Details</Th></tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                <Td className="whitespace-nowrap text-xs text-white/60 font-mono">{l.createdAt.toLocaleString()}</Td>
                <Td>
                  <span className="inline-flex items-center gap-2">
                    <ActionIcon action={l.action} />
                    <strong>{l.action}</strong>
                  </span>
                </Td>
                <Td className="text-white/70">{l.user.email}</Td>
                <Td className="text-white/55">{l.details ?? "—"}</Td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && <div className="p-12 text-center text-white/45">No activity yet.</div>}
      </div>
    </div>
  );
}

function ActionIcon({ action }: { action: string }) {
  const map: Record<string, { icon: React.ReactNode; cls: string }> = {
    generate_key: { icon: <Plus size={13} />,         cls: "text-violet-300 bg-violet-500/20" },
    import_key:   { icon: <Download size={13} />,     cls: "text-cyan-300 bg-cyan-500/20" },
    delete_key:   { icon: <KeyRound size={13} />,     cls: "text-rose-300 bg-rose-500/20" },
    encrypt:      { icon: <Lock size={13} />,         cls: "text-cyan-300 bg-cyan-500/20" },
    decrypt:      { icon: <Unlock size={13} />,       cls: "text-emerald-300 bg-emerald-500/20" },
    sign:         { icon: <PenLine size={13} />,      cls: "text-amber-300 bg-amber-500/20" },
    verify:       { icon: <CheckCircle2 size={13} />, cls: "text-rose-300 bg-rose-500/20" },
  };
  const m = map[action] ?? { icon: <Activity size={13} />, cls: "text-white/60 bg-white/10" };
  return <span className={`size-6 rounded flex items-center justify-center ${m.cls}`}>{m.icon}</span>;
}

function Th({ children }: { children: React.ReactNode }) { return <th className="text-left px-5 py-3 font-semibold">{children}</th>; }
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) { return <td className={`px-5 py-3 ${className}`}>{children}</td>; }
