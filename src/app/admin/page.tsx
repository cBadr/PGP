import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logAdminRead } from "@/lib/activity";
import { Users, KeyRound, Activity, Lock, Unlock, PenLine, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";

export default async function AdminOverview() {
  const session = await auth();
  const me = session?.user as { id?: string } | undefined;
  if (me?.id) await logAdminRead(me.id, "overview");

  const [userCount, keyCount, logCount, opCounts, recentUsers, recentLogs] = await Promise.all([
    prisma.user.count(),
    prisma.pgpKey.count(),
    prisma.activityLog.count(),
    prisma.activityLog.groupBy({ by: ["action"], _count: true }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" }, take: 5,
      select: { id: true, email: true, name: true, role: true },
    }),
    prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" }, take: 8,
      select: { id: true, action: true, details: true, createdAt: true, user: { select: { email: true } } },
    }),
  ]);

  const c = (a: string) => opCounts.find((x) => x.action === a)?._count ?? 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Overview</h1>
          <p className="text-white/55 text-sm mt-1">Snapshot of every user, key and event in the system.</p>
        </div>
        <span className="badge badge-rose"><ShieldCheck size={12} /> Operator mode · every admin action is logged</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <BigStat icon={<Users />}    label="Users"     value={userCount}  href="/admin/users"    color="violet" />
        <BigStat icon={<KeyRound />} label="Keys"      value={keyCount}   href="/admin/keys"     color="cyan" />
        <BigStat icon={<Activity />} label="Events"    value={logCount}   href="/admin/activity" color="emerald" />
        <BigStat icon={<Lock />}     label="Encrypt"   value={c("encrypt") + c("decrypt") + c("sign") + c("verify")} href="/admin/activity" color="amber" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MiniStat icon={<Lock size={15} />}        label="Encrypt"  value={c("encrypt")} />
        <MiniStat icon={<Unlock size={15} />}      label="Decrypt"  value={c("decrypt")} />
        <MiniStat icon={<PenLine size={15} />}     label="Sign"     value={c("sign")} />
        <MiniStat icon={<CheckCircle2 size={15} />} label="Verify"   value={c("verify")} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2"><Users size={16} className="text-violet-300" /> Recent users</h2>
            <Link href="/admin/users" className="text-xs text-violet-300 hover:text-violet-200 inline-flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>
          <ul className="space-y-2">
            {recentUsers.map((u) => (
              <li key={u.id} className="flex items-center justify-between text-sm px-3 py-2 rounded-lg hover:bg-white/[0.03]">
                <span className="flex items-center gap-3">
                  <span className="size-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold">{u.email[0].toUpperCase()}</span>
                  <span>
                    <div className="font-medium">{u.email}</div>
                    <div className="text-xs text-white/40">{u.name ?? "—"}</div>
                  </span>
                </span>
                <span className={`badge ${u.role === "admin" ? "badge-rose" : "badge-cyan"}`}>{u.role}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2"><Activity size={16} className="text-emerald-300" /> Latest activity</h2>
            <Link href="/admin/activity" className="text-xs text-emerald-300 hover:text-emerald-200 inline-flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>
          <ul className="space-y-2 text-sm">
            {recentLogs.map((l) => (
              <li key={l.id} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/[0.03]">
                <span className="truncate">
                  <strong>{l.action}</strong> <span className="text-white/40">· {l.user.email}</span>
                </span>
                <span className="text-[11px] text-white/40 font-mono shrink-0 ml-3">{l.createdAt.toLocaleTimeString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function BigStat({ icon, label, value, href, color }: { icon: React.ReactNode; label: string; value: number; href: string; color: "violet" | "cyan" | "emerald" | "amber" }) {
  const grad: Record<string, string> = {
    violet:  "from-violet-500/40 to-fuchsia-500/20 shadow-violet-500/30",
    cyan:    "from-cyan-500/40 to-sky-500/20 shadow-cyan-500/30",
    emerald: "from-emerald-500/40 to-teal-500/20 shadow-emerald-500/30",
    amber:   "from-amber-500/40 to-orange-500/20 shadow-amber-500/30",
  };
  return (
    <Link href={href} className={`glass-card p-5 hover:scale-[1.02] transition group bg-gradient-to-br ${grad[color]} shadow-xl`}>
      <div className="flex items-center justify-between">
        <span className="text-white/80">{icon}</span>
        <ArrowRight size={14} className="text-white/30 group-hover:translate-x-1 transition" />
      </div>
      <div className="text-3xl font-bold mt-3">{value}</div>
      <div className="text-[11px] uppercase tracking-widest text-white/55 mt-1">{label}</div>
    </Link>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="glass-card p-3 flex items-center gap-3">
      <span className="text-white/60">{icon}</span>
      <div>
        <div className="font-bold">{value}</div>
        <div className="text-[10px] uppercase tracking-widest text-white/40">{label}</div>
      </div>
    </div>
  );
}
