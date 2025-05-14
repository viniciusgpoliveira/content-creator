import { PrismaClient } from "@generated/prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Ensures that the Prisma connection is active
 * This helps prevent the "prepared statement does not exist" error
 * that can occur in serverless environments where connections may be dropped
 */
export async function ensureConnection() {
  try {
    // Test the connection with a simple query
    await prisma.$queryRaw`SELECT 1`;
  } catch (e) {
    console.log("Reconnecting to database...");
    // Reconnect if the connection was dropped
    await prisma.$disconnect();
    await prisma.$connect();
  }
}
