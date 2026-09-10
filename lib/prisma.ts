import { PrismaClient } from "@prisma/client";

/**
 * Prisma-clientin singleton. Estää yhteyksien ehtymisen kehityksessä, kun
 * Next.js:n hot reload ajaa moduulit uudelleen.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
