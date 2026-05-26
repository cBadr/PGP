import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { NavLink } from "@/components/NavLink";
import { Logo } from "@/components/Logo";
import { LayoutDashboard, KeyRound, Lock, Unlock, PenLine, CheckCircle2, LogOut, ShieldCheck, AlertTriangle } from "lucide-react";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = session?.user as { id?: string; email?: string; role?: string } | undefined;
  if (!user?.id) redirect("/login");

  return (
    <>
      <header className="sticky top-0 z-30 glass border-b border-white/5">
        <nav className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <Logo href="/dashboard" subtitle="User Console" />

          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            <NavLink href="/dashboard" exact className="nav-link"><LayoutDashboard size={15} /> Dashboard</NavLink>
            <NavLink href="/keys" className="nav-link"><KeyRound size={15} /> Keys</NavLink>
            <NavLink href="/encrypt" className="nav-link"><Lock size={15} /> Encrypt</NavLink>
            <NavLink href="/decrypt" className="nav-link"><Unlock size={15} /> Decrypt</NavLink>
            <NavLink href="/sign" className="nav-link"><PenLine size={15} /> Sign</NavLink>
            <NavLink href="/verify" className="nav-link"><CheckCircle2 size={15} /> Verify</NavLink>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {user.role === "admin" && (
              <Link href="/admin" className="badge badge-rose">
                <ShieldCheck size={12} /> Admin
              </Link>
            )}
            <span className="text-xs text-white/50 hidden lg:inline">{user.email}</span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button className="btn-ghost text-xs"><LogOut size={14} /> Logout</button>
            </form>
          </div>
        </nav>

        {/* mobile nav row */}
        <div className="md:hidden border-t border-white/5 px-4 py-2 flex gap-1 overflow-x-auto">
          <NavLink href="/dashboard" exact className="nav-link text-xs">Dashboard</NavLink>
          <NavLink href="/keys" className="nav-link text-xs">Keys</NavLink>
          <NavLink href="/encrypt" className="nav-link text-xs">Encrypt</NavLink>
          <NavLink href="/decrypt" className="nav-link text-xs">Decrypt</NavLink>
          <NavLink href="/sign" className="nav-link text-xs">Sign</NavLink>
          <NavLink href="/verify" className="nav-link text-xs">Verify</NavLink>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">{children}</main>

      <footer className="border-t border-white/5 py-4 text-center text-xs text-white/40">
        <span className="inline-flex items-center gap-1.5">
          <AlertTriangle size={12} className="text-amber-400/80" />
          Training build — keys &amp; passphrases stored as plain text.
        </span>
      </footer>
    </>
  );
}
