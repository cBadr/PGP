import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logAdminRead } from "@/lib/activity";
import { Users, ShieldCheck, Lock } from "lucide-react";

export default async function AdminUsers() {
  const session = await auth();
  const me = session?.user as { id?: string } | undefined;
  if (me?.id) await logAdminRead(me.id, "users_list");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { keys: true, logs: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Users className="text-violet-300" /> Users
          <span className="badge badge-violet">{users.length}</span>
        </h1>
        <p className="text-white/55 text-sm mt-1 inline-flex items-center gap-1.5">
          <Lock size={13} className="text-emerald-300" />
          Admin sees account metadata only — passwords are bcrypt-hashed and not readable.
        </p>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-widest text-white/50">
            <tr>
              <Th>User</Th><Th>Role</Th><Th>Keys</Th><Th>Events</Th><Th>Joined</Th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                <Td>
                  <div className="flex items-center gap-3">
                    <span className="size-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-bold">{u.email[0].toUpperCase()}</span>
                    <div>
                      <div className="font-medium">{u.email}</div>
                      <div className="text-xs text-white/40">{u.name ?? "—"}</div>
                    </div>
                  </div>
                </Td>
                <Td>
                  <span className={`badge ${u.role === "admin" ? "badge-rose" : "badge-cyan"}`}>
                    {u.role === "admin" && <ShieldCheck size={11} />}
                    {u.role}
                  </span>
                </Td>
                <Td className="font-mono">{u._count.keys}</Td>
                <Td className="font-mono">{u._count.logs}</Td>
                <Td className="text-xs text-white/55">{u.createdAt.toLocaleString()}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) { return <th className="text-left px-5 py-3 font-semibold">{children}</th>; }
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) { return <td className={`px-5 py-3 ${className}`}>{children}</td>; }
