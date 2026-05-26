import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Vault3D } from "@/components/Vault3D";
import { KeyRound, Plus, Download, Lock, Unlock, PenLine, CheckCircle2, Activity, Sparkles } from "lucide-react";

export default async function Dashboard() {
  const session = await auth();
  const user = session?.user as { id?: string; email?: string; name?: string } | undefined;
  if (!user?.id) redirect("/login");

  const [keysCount, recentKey, logs, opCounts] = await Promise.all([
    prisma.pgpKey.count({ where: { userId: user.id } }),
    prisma.pgpKey.findFirst({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }),
    prisma.activityLog.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.activityLog.groupBy({ by: ["action"], where: { userId: user.id }, _count: true }),
  ]);

  const count = (a: string) => opCounts.find((x) => x.action === a)?._count ?? 0;
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-10">
      {/* HERO ROW */}
      <section className="grid lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 glass-card p-8 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />
          <span className="badge badge-violet"><Sparkles size={12} /> {greeting}</span>
          <h1 className="text-3xl md:text-4xl font-bold mt-3">
            Welcome back, <span className="gradient-text">{user.name ?? user.email}</span>
          </h1>
          <p className="text-white/55 mt-2">Your vault is ready. Pick what you want to do.</p>

          <div className="grid sm:grid-cols-2 gap-3 mt-7 relative">
            <QuickAction href="/keys/new"    icon={<Plus />}      title="Generate key"  hint="RSA / ECC"     color="violet" />
            <QuickAction href="/keys/import" icon={<Download />}  title="Import key"    hint="ASCII armor"   color="cyan" />
            <QuickAction href="/encrypt"     icon={<Lock />}      title="Encrypt"       hint="to one or many" color="emerald" />
            <QuickAction href="/sign"        icon={<PenLine />}   title="Sign message"  hint="cleartext"      color="amber" />
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-fuchsia-500/15 via-transparent to-transparent" />
          <div className="scale-75 lg:scale-90 -my-12">
            <Vault3D size={320} />
          </div>
          <Link href="/keys" className="btn-primary mt-2 relative">
            <KeyRound size={15} /> Manage your {keysCount} key{keysCount === 1 ? "" : "s"}
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard icon={<KeyRound />}       label="Total Keys"  value={keysCount}            color="violet" />
        <StatCard icon={<Lock />}           label="Encrypted"   value={count("encrypt")}     color="cyan" />
        <StatCard icon={<Unlock />}         label="Decrypted"   value={count("decrypt")}     color="emerald" />
        <StatCard icon={<PenLine />}        label="Signed"      value={count("sign")}        color="amber" />
        <StatCard icon={<CheckCircle2 />}   label="Verified"    value={count("verify")}      color="rose" />
      </section>

      {/* TWO COLS */}
      <section className="grid lg:grid-cols-3 gap-6">
        {/* Recent activity */}
        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2"><Activity size={16} className="text-violet-300" /> Recent activity</h2>
            <span className="text-xs text-white/40">last 8 events</span>
          </div>
          {logs.length === 0 ? (
            <EmptyHint>No activity yet — generate a key to get started.</EmptyHint>
          ) : (
            <ul className="space-y-2">
              {logs.map((l) => (
                <li key={l.id} className="flex items-center justify-between text-sm px-3 py-2 rounded-lg hover:bg-white/[0.03]">
                  <span className="flex items-center gap-3">
                    <ActionIcon action={l.action} />
                    <span><strong>{l.action}</strong>{l.details && <span className="text-white/45"> — {l.details}</span>}</span>
                  </span>
                  <span className="text-xs text-white/40 font-mono">{l.createdAt.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Most recent key */}
        <div className="glass-card p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><KeyRound size={16} className="text-cyan-300" /> Latest key</h2>
          {recentKey ? (
            <Link href={`/keys/${recentKey.id}`} className="block group">
              <div className="font-semibold group-hover:text-violet-300 transition">{recentKey.name}</div>
              {recentKey.email && <div className="text-sm text-white/50">{recentKey.email}</div>}
              <div className="mt-3 font-mono text-[10px] text-white/40 break-all">{recentKey.fingerprint}</div>
              <div className="mt-3 flex gap-1.5">
                <span className="badge badge-violet">{recentKey.algorithm}</span>
                {recentKey.privateKey && <span className="badge badge-emerald">private</span>}
              </div>
            </Link>
          ) : (
            <EmptyHint>You don't have any keys yet.</EmptyHint>
          )}
        </div>
      </section>
    </div>
  );
}

function QuickAction({
  href, icon, title, hint, color,
}: { href: string; icon: React.ReactNode; title: string; hint: string; color: "violet" | "cyan" | "emerald" | "amber" }) {
  const grad: Record<string, string> = {
    violet:  "from-violet-500/30 to-fuchsia-500/20 border-violet-400/30",
    cyan:    "from-cyan-500/30 to-sky-500/20 border-cyan-400/30",
    emerald: "from-emerald-500/30 to-teal-500/20 border-emerald-400/30",
    amber:   "from-amber-500/30 to-orange-500/20 border-amber-400/30",
  };
  return (
    <Link href={href} className={`group flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br border ${grad[color]} hover:scale-[1.02] transition`}>
      <span className="size-9 rounded-lg bg-white/10 flex items-center justify-center group-hover:scale-110 transition">{icon}</span>
      <span>
        <div className="font-semibold text-sm">{title}</div>
        <div className="text-xs text-white/50">{hint}</div>
      </span>
    </Link>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: "violet" | "cyan" | "emerald" | "amber" | "rose" }) {
  const colors: Record<string, string> = {
    violet:  "text-violet-300",
    cyan:    "text-cyan-300",
    emerald: "text-emerald-300",
    amber:   "text-amber-300",
    rose:    "text-rose-300",
  };
  return (
    <div className="glass-card p-4">
      <div className={`${colors[color]} mb-2`}>{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-[11px] uppercase tracking-widest text-white/40 mt-1">{label}</div>
    </div>
  );
}

function ActionIcon({ action }: { action: string }) {
  const map: Record<string, { icon: React.ReactNode; cls: string }> = {
    generate_key: { icon: <Plus size={14} />,           cls: "text-violet-300 bg-violet-500/20" },
    import_key:   { icon: <Download size={14} />,       cls: "text-cyan-300 bg-cyan-500/20" },
    delete_key:   { icon: <KeyRound size={14} />,       cls: "text-rose-300 bg-rose-500/20" },
    encrypt:      { icon: <Lock size={14} />,           cls: "text-cyan-300 bg-cyan-500/20" },
    decrypt:      { icon: <Unlock size={14} />,         cls: "text-emerald-300 bg-emerald-500/20" },
    sign:         { icon: <PenLine size={14} />,        cls: "text-amber-300 bg-amber-500/20" },
    verify:       { icon: <CheckCircle2 size={14} />,   cls: "text-rose-300 bg-rose-500/20" },
  };
  const m = map[action] ?? { icon: <Activity size={14} />, cls: "text-white/60 bg-white/10" };
  return <span className={`size-7 rounded-md flex items-center justify-center ${m.cls}`}>{m.icon}</span>;
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return <div className="text-sm text-white/45 italic py-6 text-center">{children}</div>;
}
