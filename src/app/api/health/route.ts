import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Health endpoint. Hit /api/health to diagnose deployment / DB issues
 * from the browser without logging in. Returns 200 if everything works,
 * 500 with the failure reason otherwise.
 */
export async function GET() {
  const startedAt = Date.now();
  try {
    // Lightweight round-trip to verify the DB connection and that the
    // schema is in sync.
    const userCount = await prisma.user.count();
    return NextResponse.json({
      ok: true,
      database: "connected",
      users: userCount,
      latencyMs: Date.now() - startedAt,
      env: {
        databaseUrlSet: Boolean(process.env.DATABASE_URL),
        databaseUrlHost: process.env.DATABASE_URL?.replace(/^postgres(?:ql)?:\/\/[^@]+@([^/]+).*/i, "$1") ?? null,
        authSecretSet: Boolean(process.env.AUTH_SECRET),
        authTrustHost: process.env.AUTH_TRUST_HOST ?? null,
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV ?? null,
      },
    });
  } catch (e) {
    const err = e as Error;
    return NextResponse.json(
      {
        ok: false,
        database: "failed",
        error: err.message,
        name: err.name,
        latencyMs: Date.now() - startedAt,
        env: {
          databaseUrlSet: Boolean(process.env.DATABASE_URL),
          databaseUrlHost: process.env.DATABASE_URL?.replace(/^postgres(?:ql)?:\/\/[^@]+@([^/]+).*/i, "$1") ?? null,
          authSecretSet: Boolean(process.env.AUTH_SECRET),
          authTrustHost: process.env.AUTH_TRUST_HOST ?? null,
          nodeEnv: process.env.NODE_ENV,
          vercelEnv: process.env.VERCEL_ENV ?? null,
        },
      },
      { status: 500 },
    );
  }
}
