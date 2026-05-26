import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { EncryptForm } from "@/components/EncryptForm";
import { Lock } from "lucide-react";

export default async function EncryptPage() {
  const session = await auth();
  const user = session?.user as { id?: string } | undefined;
  if (!user?.id) redirect("/login");

  const keys = await prisma.pgpKey.findMany({
    where: { userId: user.id },
    select: { id: true, name: true, email: true, fingerprint: true, publicKey: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <span className="size-11 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <Lock className="text-white" />
        </span>
        <div>
          <h1 className="text-3xl font-bold">Encrypt</h1>
          <p className="text-white/55 text-sm">Encrypt a message for one or many recipients.</p>
        </div>
      </div>
      <EncryptForm keys={keys} />
    </div>
  );
}
