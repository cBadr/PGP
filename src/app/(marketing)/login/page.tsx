import { redirect } from "next/navigation";
import Link from "next/link";
import { signIn, auth } from "@/auth";
import { LogoMark } from "@/components/Logo";

async function login(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  await signIn("credentials", { email, password, redirectTo: "/dashboard" });
}

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="glass-card p-8 w-full max-w-md">
        <div className="flex flex-col items-center text-center mb-6">
          <LogoMark size={56} />
          <h1 className="text-2xl font-bold mt-4">Welcome back</h1>
          <p className="text-sm text-white/55 mt-1">Sign in to your vault</p>
        </div>

        <form action={login} className="space-y-4">
          <label className="block">
            <span className="block text-xs uppercase tracking-widest text-white/50 mb-1.5">Email</span>
            <input name="email" type="email" required autoComplete="email" className="input" />
          </label>
          <label className="block">
            <span className="block text-xs uppercase tracking-widest text-white/50 mb-1.5">Password</span>
            <input name="password" type="password" required autoComplete="current-password" className="input" />
          </label>
          <button className="btn-primary w-full mt-2">Sign in →</button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/5 text-center text-sm text-white/55">
          No account?{" "}
          <Link href="/register" className="text-violet-300 hover:text-violet-200 font-medium">Create one</Link>
        </div>

      </div>
    </div>
  );
}
