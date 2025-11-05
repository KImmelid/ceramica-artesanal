import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { qpNumber, qpString, qpEnum } from "@/lib/qs";
import { pageInfo, prismaSkipTake } from "@/lib/paginate";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";

// GET: listar clientes (solo ADMIN) con filtros / orden / paginación
export async function GET(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const q = qpString(searchParams.get("q"));
  const sort = qpEnum(
    searchParams.get("sort"),
    ["date_desc", "date_asc", "name_asc", "name_desc"],
    "date_desc"
  );
  const page = Math.max(1, qpNumber(searchParams.get("page"), 1));
  const perPage = Math.min(50, Math.max(5, qpNumber(searchParams.get("perPage"), 10)));

  let where: Prisma.UserWhereInput = {};
  if (q) {
    const maybeId = Number(q);
    where = {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        ...(Number.isFinite(maybeId) ? [{ id: maybeId }] as Prisma.UserWhereInput[] : []),
      ],
    };
  }

  const total = await prisma.user.count({ where });
  const { skip, take } = prismaSkipTake(page, perPage);

  const orderBy: Prisma.UserOrderByWithRelationInput =
    sort === "date_asc" ? { createdAt: "asc" } :
    sort === "name_asc" ? { name: "asc" } :
    sort === "name_desc" ? { name: "desc" } :
    { createdAt: "desc" };

  const rows = await prisma.user.findMany({
    where,
    orderBy,
    skip,
    take,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return NextResponse.json({ meta: pageInfo(total, page, perPage), rows });
}

