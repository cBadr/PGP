import { redirect } from "next/navigation";
import Link from "next/link";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn, auth } from "@/auth";
import { LogoMark } from "@/components/Logo";
import { AlertTriangle } from "lucide-react";

async function register(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim() || null;

  if (!email || !password) throw new Error("Email and password required");

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new Error("User already exists");

  const passwordHash = await bcrypt.hash(password, 10);
  const userCount = await prisma.user.count();
  const role = userCount === 0 ? "admin" : "user";

  await prisma.user.create({
    data: { email, name, passwordHash, role },
  });
  await signIn("credentials", { email, password, redirectTo: "/dashboard" });
}

export default async function RegisterPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="glass-card p-8 w-full max-w-md">
        <div className="flex flex-col items-center text-center mb-6">
          <LogoMark size={56} />
          <h1 className="text-2xl font-bold mt-4">Create your account</h1>
          <p className="text-sm text-white/55 mt-1">Free · educational · no credit card</p>
        </div>

        <form action={register} className="space-y-4">
          <label className="block">
            <span className="block text-xs uppercase tracking-widest text-white/50 mb-1.5">Name (optional)</span>
            <input name="name" type="text" className="input" />
          </label>
          <label className="block">
            <span className="block text-xs uppercase tracking-widest text-white/50 mb-1.5">Email</span>
            <input name="email" type="email" required className="input" />
          </label>
          <label className="block">
            <span className="block text-xs uppercase tracking-widest text-white/50 mb-1.5">Password</span>
            <input name="password" type="password" required className="input" />
          </label>
          <button className="btn-primary w-full mt-2">Create account →</button>
          <p className="text-[11px] text-white/45 text-center inline-flex items-center justify-center gap-1.5 w-full">
            <AlertTriangle size={11} className="text-amber-400/80" />
            First registered user becomes admin
          </p>
        </form>

        <div className="mt-6 pt-6 border-t border-white/5 text-center text-sm text-white/55">
          Already have one?{" "}
          <Link href="/login" className="text-violet-300 hover:text-violet-200 font-medium">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
