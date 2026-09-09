import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

console.log(
  "DATABASE_URL:",
  process.env.DATABASE_URL ? "DEFINED" : "UNDEFINED",
);

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
  ssl: {
    rejectUnauthorized: false,
  },
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
