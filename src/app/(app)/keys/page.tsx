import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { KeyRound, Plus, Download, Fingerprint, Calendar } from "lucide-react";

export default async function KeysList() {
  const session = await auth();
  const user = session?.user as { id?: string } | undefined;
  if (!user?.id) redirect("/login");

  const keys = await prisma.pgpKey.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <KeyRound className="text-violet-300" /> Your Keyring
            <span className="badge badge-violet">{keys.length}</span>
          </h1>
          <p className="text-white/55 mt-1 text-sm">All PGP keys stored in your vault.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/keys/new" className="btn-primary"><Plus size={15} /> Generate</Link>
          <Link href="/keys/import" className="btn-ghost"><Download size={15} /> Import</Link>
        </div>
      </div>

      {keys.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <KeyRound size={48} className="mx-auto text-white/30 mb-4" />
          <h3 className="font-semibold text-lg">No keys yet</h3>
          <p className="text-white/50 text-sm mt-1 mb-6">Create your first PGP key in a few seconds.</p>
          <Link href="/keys/new" className="btn-primary"><Plus size={15} /> Generate your first key</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {keys.map((k) => (
            <Link key={k.id} href={`/keys/${k.id}`} className="glass-card p-5 hover:bg-white/[0.06] transition group">
              <div className="flex items-start justify-between">
                <div className="size-10 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:scale-110 transition">
                  <KeyRound size={18} className="text-white" />
                </div>
                <div className="flex flex-col gap-1 items-end">
                  {k.privateKey && <span className="badge badge-emerald">private</span>}
                  <span className="badge badge-violet">{k.algorithm}</span>
                </div>
              </div>
              <h3 className="font-semibold mt-4 truncate group-hover:text-violet-300 transition">{k.name}</h3>
              {k.email && <div className="text-sm text-white/55 truncate">{k.email}</div>}

              <div className="mt-3 flex items-center gap-1.5 text-[10px] text-white/40 font-mono">
                <Fingerprint size={10} />
                <span className="truncate">{k.fingerprint.slice(-32)}</span>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-white/40">
                <Calendar size={10} /> {k.createdAt.toLocaleDateString()}
                {k.expiresAt && <span className="text-amber-300/70">· exp {k.expiresAt.toLocaleDateString()}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
