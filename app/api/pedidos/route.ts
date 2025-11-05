import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session || !session.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  // Admin ve todos; usuario ve solo suyos
  const where = session.user.role === "ADMIN" ? {} : { userId: Number(session.user.id) };
  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { total, status } = await req.json();
  const nuevo = await prisma.order.create({
    data: {
      total: Number(total),
      status: status ?? "pendiente",
      userId: Number(session.user.id),
    },
  });
  return NextResponse.json(nuevo, { status: 201 });
}
