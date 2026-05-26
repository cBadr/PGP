import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { NavLink } from "@/components/NavLink";
import { LogoMark } from "@/components/Logo";
import { ShieldCheck, Users, KeyRound, Activity, LayoutDashboard, ArrowLeftRight, LogOut } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = session?.user as { id?: string; email?: string; role?: string } | undefined;
  if (!user?.id) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="sidebar w-64 shrink-0 flex flex-col sticky top-0 h-screen">
        <div className="p-5 border-b border-white/5">
          <Link href="/admin" className="logo-link group inline-flex items-center gap-2.5">
            <span className="relative">
              <LogoMark size={34} />
              <span className="absolute -bottom-1 -right-1 size-3.5 rounded-full bg-rose-500 border-2 border-[#1a0b2e] flex items-center justify-center">
                <ShieldCheck size={8} className="text-white" />
              </span>
            </span>
            <span className="flex flex-col leading-none">
              <span className="logo-wordmark">PGP·Vault</span>
              <span className="text-[9px] uppercase tracking-[0.22em] text-rose-300/80 mt-1">Admin Console</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 py-4 space-y-0.5">
          <NavLink href="/admin" exact className="side-link"><LayoutDashboard size={16} /> Overview</NavLink>
          <NavLink href="/admin/users" className="side-link"><Users size={16} /> Users</NavLink>
          <NavLink href="/admin/keys" className="side-link"><KeyRound size={16} /> All Keys</NavLink>
          <NavLink href="/admin/activity" className="side-link"><Activity size={16} /> Activity Log</NavLink>
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <Link href="/dashboard" className="side-link"><ArrowLeftRight size={16} /> Switch to User</Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button className="side-link w-full text-left"><LogOut size={16} /> Logout</button>
          </form>
          <div className="px-3 pt-2 text-[11px] text-white/40 truncate">{user.email}</div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="glass border-b border-white/5 sticky top-0 z-20 px-8 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm uppercase tracking-widest text-white/50 inline-flex items-center gap-2">
              <ShieldCheck size={14} className="text-rose-300" /> Admin Console
            </h2>
            <span className="badge badge-rose"><ShieldCheck size={12} /> Full visibility · plain-text mode</span>
          </div>
        </header>
        <main className="p-8 max-w-7xl">{children}</main>
      </div>
    </div>
  );
}
