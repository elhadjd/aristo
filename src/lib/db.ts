import path from "node:path";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaAdapter?: PrismaLibSql;
};

/** Resolve SQLite file URL for Windows + Unix (libSQL / Prisma). */
export function resolveDatabaseUrl() {
  const raw = process.env.DATABASE_URL || "file:./prisma/dev.db";
  if (!raw.startsWith("file:")) return raw;

  const filePath = raw.replace(/^file:/, "");
  if (path.isAbsolute(filePath)) {
    // libSQL expects forward slashes even on Windows
    return `file:${filePath.replace(/\\/g, "/")}`;
  }

  const absolute = path.join(/* turbopackIgnore: true */ process.cwd(), filePath);
  return `file:${absolute.replace(/\\/g, "/")}`;
}

function createPrismaClient() {
  const adapter =
    globalForPrisma.prismaAdapter ??
    new PrismaLibSql({
      url: resolveDatabaseUrl(),
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prismaAdapter = adapter;
  }

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
