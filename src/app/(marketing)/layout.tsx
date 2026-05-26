import Link from "next/link";
import { auth } from "@/auth";
import { Logo } from "@/components/Logo";
import { ShieldCheck } from "lucide-react";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = session?.user as { email?: string; role?: string } | undefined;

  return (
    <>
      <header className="sticky top-0 z-30 glass border-b border-white/5">
        <nav className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <Logo subtitle="OpenPGP Toolkit" />

          <div className="hidden md:flex items-center gap-1 text-sm">
            <Link href="/faq" className="nav-link">FAQ</Link>
          </div>

          <div className="flex items-center gap-2 text-sm">
            {user ? (
              <Link href={user.role === "admin" ? "/admin" : "/dashboard"} className="btn-ghost">
                {user.role === "admin" ? "Admin Panel" : "Open Dashboard"}
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn-ghost">Login</Link>
                <Link href="/register" className="btn-primary">Get Started →</Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4 text-xs text-white/45">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-emerald-400/80" />
            Built with OpenPGP.js · client-side cryptography
          </span>
          <span className="flex items-center gap-4">
            <Link href="/faq" className="hover:text-white">FAQ</Link>
            <Link href="/login" className="hover:text-white">Login</Link>
            <Link href="/register" className="hover:text-white">Register</Link>
            <a href="https://t.me/Idlexaz" target="_blank" rel="noreferrer" className="hover:text-white">Contact</a>
          </span>
        </div>
      </footer>
    </>
  );
}
