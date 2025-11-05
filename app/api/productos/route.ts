import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export const runtime = "nodejs";

export async function GET() {
  const productos = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(productos);
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { name, price, stock, image } = await req.json();
  if (!name || price == null || stock == null) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const nuevo = await prisma.product.create({
    data: { name, price: Number(price), stock: Number(stock), image: image ?? null },
  });
  return NextResponse.json(nuevo, { status: 201 });
}
