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

  try {
    const body = await req.json();
    const items: Array<{ id: number; qty: number }> = Array.isArray(body?.items) ? body.items : [];
    const status: string = body?.status ?? "pagado";

    if (items.length === 0) {
      return NextResponse.json({ error: "Sin ítems" }, { status: 400 });
    }

    // Traer productos y validar stock
    const ids = items.map((i) => Number(i.id)).filter((n) => Number.isFinite(n));
    const products = await prisma.product.findMany({ where: { id: { in: ids } } });

    // Mapear cantidades solicitadas
    const qtyById = new Map<number, number>();
    for (const it of items) qtyById.set(Number(it.id), (qtyById.get(Number(it.id)) || 0) + Number(it.qty || 0));

    // Validaciones de stock
    for (const p of products) {
      const need = qtyById.get(p.id) || 0;
      if (need <= 0) return NextResponse.json({ error: "Cantidad inválida" }, { status: 400 });
      if (p.stock < need) {
        return NextResponse.json({ error: `Stock insuficiente para ${p.name}` }, { status: 409 });
      }
    }

    // Calcular total en servidor
    const total = products.reduce((acc, p) => acc + Number(p.price) * (qtyById.get(p.id) || 0), 0);

    // Transacción: descontar stock y crear pedido
    const created = await prisma.$transaction(async (tx) => {
      for (const p of products) {
        const qty = qtyById.get(p.id) || 0;
        await tx.product.update({ where: { id: p.id }, data: { stock: { decrement: qty } } });
      }
      const order = await tx.order.create({
        data: {
          total: Number(total),
          status,
          userId: Number(session.user.id),
        },
      });
      return order;
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
