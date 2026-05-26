import type { Metadata } from "next";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import "./globals.css";

export const metadata: Metadata = {
  title: "PGP Vault — Educational SaaS",
  description: "Manage PGP keys, encrypt and sign messages — built for learning.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AnimatedBackground />
        {children}
      </body>
    </html>
  );
}
