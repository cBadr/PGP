import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { VerifyForm } from "@/components/VerifyForm";
import { CheckCircle2 } from "lucide-react";

export default async function VerifyPage() {
  const session = await auth();
  const user = session?.user as { id?: string } | undefined;
  if (!user?.id) redirect("/login");

  const keys = await prisma.pgpKey.findMany({
    where: { userId: user.id },
    select: { id: true, name: true, fingerprint: true, publicKey: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <span className="size-11 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
          <CheckCircle2 className="text-white" />
        </span>
        <div>
          <h1 className="text-3xl font-bold">Verify</h1>
          <p className="text-white/55 text-sm">Verify a cleartext signature against a public key.</p>
        </div>
      </div>
      <VerifyForm keys={keys} />
    </div>
  );
}
