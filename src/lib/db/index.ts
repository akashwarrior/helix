import { PrismaClient } from "@prisma/client";

declare global {
  // Using var is required here to augment the Node.js global scope
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
