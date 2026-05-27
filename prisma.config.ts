import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Migrations vs. runtime:
 *
 *   Runtime  (Vercel serverless) → uses DATABASE_URL via src/lib/prisma.ts.
 *                                  Should be the TRANSACTION pooler (6543).
 *
 *   Migrations (this config, used by `prisma migrate dev/deploy`)
 *                                → prefer DIRECT_URL (session pooler 5432
 *                                  or direct connection — supports
 *                                  prepared statements). Falls back to
 *                                  DATABASE_URL when DIRECT_URL is absent.
 *
 * Note: `prisma generate` ALSO loads this file but doesn't connect to the
 * database, so an empty url string is fine in that case — we don't throw
 * here, we let `prisma migrate` itself error out with a clear message if
 * the url is truly missing.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || "",
  },
});
