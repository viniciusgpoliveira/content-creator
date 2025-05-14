import { PrismaClient } from "@generated/prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Ensures that the Prisma connection is active and properly initialized
 * This helps prevent the "prepared statement does not exist" error
 * that can occur in serverless environments where connections may be dropped
 *
 * @returns {Promise<boolean>} - Returns true if connection is successful
 */
export async function ensureConnection() {
  try {
    // Test the connection with a simple query
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (e) {
    console.log("Database connection error, attempting to reconnect...", e);

    try {
      // Force a complete disconnect and reconnect cycle
      await prisma.$disconnect();

      // Small delay to ensure clean disconnect
      await new Promise(resolve => setTimeout(resolve, 100));

      await prisma.$connect();

      // Verify the connection is working after reconnect
      await prisma.$queryRaw`SELECT 1`;
      console.log("Database reconnection successful");
      return true;
    } catch (reconnectError) {
      console.error("Failed to reconnect to database:", reconnectError);
      return false;
    }
  }
}
