import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

// Prisma CLI loads `.env` by default; also pull Next.js `.env.local` / `.env.development`.
loadEnv({ path: ".env" });
loadEnv({ path: ".env.local", override: true });
loadEnv({ path: ".env.development", override: true });

const databaseUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
