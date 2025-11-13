import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Cliente directo para evitar problemas ESM/CJS al ejecutar el seed
const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash("admin123", 10);
  const userPass = await bcrypt.hash("user123", 10);

  const alice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: { name: "Alice", email: "alice@example.com", role: "ADMIN", password: adminPass },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: { name: "Bob", email: "bob@example.com", role: "USER", password: userPass },
  });

  const prods = await Promise.all([
    prisma.product.upsert({ where: { id: 1 }, update: {}, create: { id: 1, name: "Taza esmaltada", price: 12000, stock: 25 } }),
    prisma.product.upsert({ where: { id: 2 }, update: {}, create: { id: 2, name: "Plato decorativo", price: 18000, stock: 12 } }),
    prisma.product.upsert({ where: { id: 3 }, update: {}, create: { id: 3, name: "Jarrón artesanal", price: 35000, stock: 6 } }),
  ]);

  await prisma.order.create({ data: { userId: Number(alice.id), total: 50000, status: "pagado" } });
  await prisma.order.create({ data: { userId: Number(bob.id), total: 20000, status: "pendiente" } });

  console.log(`Seed completado.\n\nAdmin: ${alice.email} / admin123\nUser: ${bob.email} / user123\nProductos: ${prods.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

