import Link from "next/link";
import { auth } from "@/auth";
import { Vault3D } from "@/components/Vault3D";
import { KeyRound, Lock, PenLine, ShieldCheck, Sparkles, GitFork, Zap, Eye, Server, Globe, Repeat } from "lucide-react";

export default async function Landing() {
  const session = await auth();

  return (
    <div>
      {/* ───── HERO ───── */}
      <section className="relative max-w-7xl mx-auto px-6 pt-12 pb-24 grid lg:grid-cols-2 gap-10 items-center min-h-[78vh]">
        <div className="space-y-7 relative z-10">
          <span className="badge badge-violet">
            <Sparkles size={12} /> Educational SaaS · v0.1
          </span>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
            Tame your <span className="gradient-text">PGP keys</span><br />
            without the headache.
          </h1>
          <p className="text-lg text-white/65 max-w-xl leading-relaxed">
            Generate, import, encrypt, decrypt, sign and verify — all from one beautiful console.
            Built as a fully transparent training playground so you can <em>see</em> exactly what happens
            on the server and in your browser.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            {session ? (
              <Link href="/dashboard" className="btn-primary">Open Dashboard →</Link>
            ) : (
              <>
                <Link href="/register" className="btn-primary">Create free account →</Link>
                <Link href="/login" className="btn-ghost">I already have one</Link>
              </>
            )}
            <a href="https://github.com" target="_blank" rel="noreferrer" className="btn-ghost">
              <GitFork size={15} /> View source
            </a>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-8 text-center">
            <Stat value="6" label="crypto ops" />
            <Stat value="2" label="run modes" />
            <Stat value="100%" label="transparent" />
          </div>
        </div>

        {/* 3D centerpiece */}
        <div className="relative h-[600px] flex items-center justify-center -mr-10">
          <div className="absolute inset-0 bg-gradient-radial from-violet-500/20 via-transparent to-transparent blur-3xl" />
          <Vault3D size={580} />
        </div>
      </section>

      {/* ───── FEATURES ───── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <span className="badge badge-cyan"><Zap size={12} /> Everything you need</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4">A complete <span className="gradient-text">PGP toolbox</span></h2>
          <p className="text-white/55 mt-3 max-w-2xl mx-auto">
            Every operation runs either on the server or in your browser — pick the mode that matches what you're learning.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Feature icon={<KeyRound />} title="Manage Keys" color="violet"
            desc="Generate RSA or ECC keys, import existing ones, view everything in plain sight." />
          <Feature icon={<Lock />} title="Encrypt / Decrypt" color="cyan"
            desc="Encrypt to one or many recipients. Decrypt with a saved private key." />
          <Feature icon={<PenLine />} title="Sign & Verify" color="emerald"
            desc="Cleartext signatures with instant verification feedback." />
          <Feature icon={<Eye />} title="See Everything" color="amber"
            desc="Admin console exposes all keys, passphrases and an activity audit log." />
        </div>
      </section>

      {/* ───── MODES ───── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="glass-card p-8 md:p-12 text-center">
          <span className="badge badge-violet"><Repeat size={12} /> Dual mode</span>
          <h3 className="text-2xl md:text-3xl font-bold mt-4">
            Server-side <span className="text-white/30 mx-2">·</span> Client-side
          </h3>
          <p className="text-white/60 mt-3 max-w-xl mx-auto">
            Toggle between modes on every operation page to compare how each works and watch each call land in the activity log.
          </p>
          <div className="mt-8 inline-flex glass rounded-xl p-1 text-sm">
            <span className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white font-semibold">
              <Server size={14} /> Server-side
            </span>
            <span className="inline-flex items-center gap-1.5 px-5 py-2 text-white/60">
              <Globe size={14} /> Client-side
            </span>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <ShieldCheck size={42} className="mx-auto text-violet-400 mb-4" />
        <h3 className="text-2xl font-bold">Ready to play?</h3>
        <p className="text-white/55 mt-2 mb-6">
          Create a free account in seconds — no credit card, no email confirmation.
        </p>
        {session ? (
          <Link href="/dashboard" className="btn-primary">Open Dashboard →</Link>
        ) : (
          <div className="inline-flex gap-3">
            <Link href="/register" className="btn-primary">Create account →</Link>
            <Link href="/login" className="btn-ghost">Sign in</Link>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="glass-card py-4">
      <div className="text-2xl font-bold gradient-text">{value}</div>
      <div className="text-[11px] uppercase tracking-widest text-white/45 mt-1">{label}</div>
    </div>
  );
}

function Feature({
  icon, title, desc, color,
}: { icon: React.ReactNode; title: string; desc: string; color: "violet" | "cyan" | "emerald" | "amber" }) {
  const grad: Record<string, string> = {
    violet:  "from-violet-500 to-fuchsia-500",
    cyan:    "from-cyan-500 to-sky-500",
    emerald: "from-emerald-500 to-teal-500",
    amber:   "from-amber-500 to-orange-500",
  };
  return (
    <div className="glass-card p-5 hover:bg-white/[0.06] transition group">
      <div className={`size-11 rounded-xl bg-gradient-to-br ${grad[color]} flex items-center justify-center mb-4 group-hover:scale-110 transition text-white`}>
        {icon}
      </div>
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm text-white/55 leading-relaxed">{desc}</p>
    </div>
  );
}

