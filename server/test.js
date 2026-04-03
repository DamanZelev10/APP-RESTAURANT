import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const d = await prisma.reservation.findMany();
  console.log(JSON.stringify(d, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
