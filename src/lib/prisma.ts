import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL env var is missing. Set it in your Vercel project " +
      "(Settings → Environment Variables, enabled for All Environments).",
    );
  }

  // PrismaPg uses node-postgres under the hood. Pool tuning goes in the
  // pg config (first arg).
  //
  // IMPORTANT: DATABASE_URL must point at Supabase's TRANSACTION pooler
  // (port 6543), not the session pooler (5432). Transaction mode can serve
  // thousands of short-lived Vercel serverless invocations; session mode
  // caps at 15 and breaks under any real traffic.
  //
  // Per Vercel function we keep a tiny pool — serverless functions are
  // short-lived processes, so a large pool is wasted.
  const adapter = new PrismaPg({
    connectionString: url,
    max: 3,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 5_000,
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

/**
 * Lazy proxy — defers client instantiation until first use, so build-time
 * page-data collection on routes that don't touch the DB succeeds even when
 * DATABASE_URL is absent at build time.
 *
 * On the second access (e.g. `prisma.user` then `.findMany(...)`) Prisma's
 * own delegate object handles `this` binding internally — we only need to
 * bind top-level methods like `$connect`, `$transaction`, etc.
 */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_t, prop) {
    if (!globalForPrisma.prisma) globalForPrisma.prisma = createClient();
    const real = globalForPrisma.prisma as unknown as Record<PropertyKey, unknown>;
    const value = real[prop];
    return typeof value === "function"
      ? (value as (...a: unknown[]) => unknown).bind(real)
      : value;
  },
});
