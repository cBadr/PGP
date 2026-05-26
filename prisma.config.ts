import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Database URL strategy for Supabase / Neon / Vercel Postgres on serverless:
 *
 *   DATABASE_URL  — used at RUNTIME by the pg driver adapter.
 *                   Should point at the TRANSACTION pooler (port 6543).
 *                   Transaction mode supports thousands of concurrent
 *                   short-lived connections, which is what Vercel
 *                   serverless functions actually need.
 *
 *   DIRECT_URL    — used by `prisma migrate` / `prisma db push`.
 *                   Should point at the SESSION pooler (port 5432) or
 *                   the direct connection. Migrations need prepared
 *                   statements, which transaction mode doesn't support.
 *
 * If DIRECT_URL is missing, we fall back to DATABASE_URL — fine for local
 * dev against a direct/session connection, broken on Vercel + Supabase
 * with a transaction pooler URL.
 */
const migrationsUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!migrationsUrl) {
  throw new Error(
    [
      "❌ Neither DIRECT_URL nor DATABASE_URL is set.",
      "",
      "  Vercel: Project → Settings → Environment Variables",
      "          DATABASE_URL = Supabase TRANSACTION pooler URL (port 6543)",
      "          DIRECT_URL   = Supabase SESSION pooler URL  (port 5432)",
      "",
      "  Local:  copy .env.example to .env and fill both.",
    ].join("\n"),
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: migrationsUrl },
});
