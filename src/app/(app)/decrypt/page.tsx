import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DecryptForm } from "@/components/DecryptForm";
import { Unlock } from "lucide-react";

export default async function DecryptPage() {
  const session = await auth();
  const user = session?.user as { id?: string } | undefined;
  if (!user?.id) redirect("/login");

  const raw = await prisma.pgpKey.findMany({
    where: { userId: user.id, privateKey: { not: null } },
    select: { id: true, name: true, email: true, fingerprint: true, privateKey: true, passphrase: true },
    orderBy: { createdAt: "desc" },
  });
  const keys = raw.map((k) => ({ ...k, privateKey: k.privateKey as string }));

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <span className="size-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <Unlock className="text-white" />
        </span>
        <div>
          <h1 className="text-3xl font-bold">Decrypt</h1>
          <p className="text-white/55 text-sm">Decrypt a message with one of your private keys.</p>
        </div>
      </div>
      <DecryptForm keys={keys} />
    </div>
  );
}
