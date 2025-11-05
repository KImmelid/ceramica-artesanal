import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { qpNumber, qpString, qpEnum } from "@/lib/qs";
import { pageInfo, prismaSkipTake } from "@/lib/paginate";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const q = qpString(searchParams.get("q"));
  const sort = qpEnum(searchParams.get("sort"), ["date_desc", "date_asc", "total_desc", "total_asc"], "date_desc");
  const page = Math.max(1, qpNumber(searchParams.get("page"), 1));
  const perPage = Math.min(50, Math.max(5, qpNumber(searchParams.get("perPage"), 20)));
  const dateFromStr = qpString(searchParams.get("dateFrom"), "");
  const dateToStr = qpString(searchParams.get("dateTo"), "");
  const dateFrom = dateFromStr ? new Date(dateFromStr) : undefined;
  const dateTo = dateToStr ? new Date(dateToStr) : undefined;

  const and: any[] = [];
  if (q) {
    const maybeId = Number(q);
    and.push({
      OR: [
        { user: { is: { name: { contains: q, mode: "insensitive" } } } },
        { user: { is: { email: { contains: q, mode: "insensitive" } } } },
        ...(Number.isFinite(maybeId) ? [{ id: maybeId }] as any[] : []),
      ],
    });
  }
  if ((dateFrom && !Number.isNaN(dateFrom.getTime())) || (dateTo && !Number.isNaN(dateTo.getTime()))) {
    and.push({
      createdAt: {
        ...(dateFrom ? { gte: dateFrom } : {}),
        ...(dateTo ? { lte: dateTo } : {}),
      },
    });
  }
  const where = and.length ? { AND: and } : {};

  const total = await prisma.order.count({ where });
  const { skip, take } = prismaSkipTake(page, perPage);

  const orderBy: Prisma.OrderOrderByWithRelationInput =
    sort === "date_asc" ? { createdAt: "asc" } :
    sort === "total_desc" ? { total: "desc" } :
    sort === "total_asc" ? { total: "asc" } :
    { createdAt: "desc" };

  const rows = await prisma.order.findMany({
    where,
    orderBy,
    skip,
    take,
    include: { user: true },
  });

  return NextResponse.json({ meta: pageInfo(total, page, perPage), rows });
}
