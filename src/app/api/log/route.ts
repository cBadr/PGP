import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { logActivity } from "@/lib/activity";

export async function POST(req: Request) {
  const session = await auth();
  const user = session?.user as { id?: string } | undefined;
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { action, details } = await req.json();
  if (!action) return NextResponse.json({ error: "action required" }, { status: 400 });

  await logActivity(user.id, String(action), details ? String(details) : undefined);
  return NextResponse.json({ ok: true });
}
