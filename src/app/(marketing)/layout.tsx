import Link from "next/link";
import { auth } from "@/auth";
import { Logo } from "@/components/Logo";
import { AlertTriangle } from "lucide-react";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = session?.user as { email?: string; role?: string } | undefined;

  return (
    <>
      <header className="sticky top-0 z-30 glass border-b border-white/5">
        <nav className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Logo subtitle="Educational SaaS" />
          <div className="flex items-center gap-2 text-sm">
            {user ? (
              <>
                <Link href={user.role === "admin" ? "/admin" : "/dashboard"} className="btn-ghost">
                  {user.role === "admin" ? "Admin Panel" : "Open Dashboard"}
                </Link>
              </>
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
      <footer className="border-t border-white/5 py-6 text-center text-xs text-white/40">
        <span className="inline-flex items-center gap-1.5">
          <AlertTriangle size={12} className="text-amber-400/80" />
          Training build — all data stored as plain text. Do not use real keys.
        </span>
      </footer>
    </>
  );
}
