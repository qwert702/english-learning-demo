import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { DB, APP } from "@/lib/env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const isDev = APP.isDev;
  const dbUrl = DB.url;
  const adapter = new PrismaLibSql({ url: `file:${dbUrl}` });

  return new PrismaClient({
    adapter,
    log: isDev
      ? ["query", "warn", "error"]
      : ["warn", "error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (APP.isDev) globalForPrisma.prisma = prisma;
