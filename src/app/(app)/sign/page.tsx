import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SignForm } from "@/components/SignForm";
import { PenLine } from "lucide-react";

export default async function SignPage() {
  const session = await auth();
  const user = session?.user as { id?: string } | undefined;
  if (!user?.id) redirect("/login");

  const raw = await prisma.pgpKey.findMany({
    where: { userId: user.id, privateKey: { not: null } },
    select: { id: true, name: true, fingerprint: true, privateKey: true, passphrase: true },
    orderBy: { createdAt: "desc" },
  });
  const keys = raw.map((k) => ({ ...k, privateKey: k.privateKey as string }));

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <span className="size-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
          <PenLine className="text-white" />
        </span>
        <div>
          <h1 className="text-3xl font-bold">Sign</h1>
          <p className="text-white/55 text-sm">Produce a cleartext signature.</p>
        </div>
      </div>
      <SignForm keys={keys} />
    </div>
  );
}
