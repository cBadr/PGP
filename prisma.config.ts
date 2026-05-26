import "dotenv/config";
import { defineConfig } from "prisma/config";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    [
      "❌ DATABASE_URL is not set.",
      "",
      "  Vercel: Project → Settings → Environment Variables",
      "          add DATABASE_URL, enable for Production/Preview/Development,",
      "          paste the value WITHOUT surrounding quotes, then redeploy.",
      "",
      "  Local:  copy .env.example to .env and fill DATABASE_URL.",
    ].join("\n"),
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: databaseUrl },
});
