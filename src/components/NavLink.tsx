"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({
  href, children, exact = false, className = "",
}: {
  href: string;
  children: React.ReactNode;
  exact?: boolean;
  className?: string;
}) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
  return (
    <Link href={href} className={`${className} ${isActive ? "active" : ""}`}>
      {children}
    </Link>
  );
}
