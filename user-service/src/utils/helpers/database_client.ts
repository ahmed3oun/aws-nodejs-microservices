import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

const prismaClient: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs> = new PrismaClient();

export { prismaClient };