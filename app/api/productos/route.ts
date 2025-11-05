import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { qpNumber, qpString, qpEnum } from "@/lib/qs";
import { pageInfo, prismaSkipTake } from "@/lib/paginate";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";

// GET: listar con filtros / orden / paginación
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = qpString(searchParams.get("q"));
  const sort = qpEnum(
    searchParams.get("sort"),
    ["date_desc", "date_asc", "price_desc", "price_asc", "stock_desc", "stock_asc", "name_asc", "name_desc"],
    "date_desc"
  );
  const page = Math.max(1, qpNumber(searchParams.get("page"), 1));
  const perPage = Math.min(50, Math.max(5, qpNumber(searchParams.get("perPage"), 10)));

  let where: Prisma.ProductWhereInput = {};
  if (q) {
    const maybeId = Number(q);
    where = {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        ...(Number.isFinite(maybeId) ? [{ id: maybeId }] as Prisma.ProductWhereInput[] : []),
      ],
    };
  }

  const total = await prisma.product.count({ where });
  const { skip, take } = prismaSkipTake(page, perPage);

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "date_asc" ? { createdAt: "asc" } :
    sort === "price_desc" ? { price: "desc" } :
    sort === "price_asc" ? { price: "asc" } :
    sort === "stock_desc" ? { stock: "desc" } :
    sort === "stock_asc" ? { stock: "asc" } :
    sort === "name_asc" ? { name: "asc" } :
    sort === "name_desc" ? { name: "desc" } :
    { createdAt: "desc" };

  const rows = await prisma.product.findMany({ where, orderBy, skip, take });

  return NextResponse.json({ meta: pageInfo(total, page, perPage), rows });
}

// POST (igual que Semana 5; restringido a ADMIN)
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

