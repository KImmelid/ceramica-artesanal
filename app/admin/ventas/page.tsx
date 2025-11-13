import ClientTable, { type SaleRow } from "./ClientTable";
import { prisma } from "@/lib/db";
import { qpNumber, qpString, qpEnum } from "@/lib/qs";
import { pageInfo, prismaSkipTake } from "@/lib/paginate";
import { Prisma } from "@prisma/client";

type SearchParams = { [k: string]: string | string[] | undefined };

export const runtime = "nodejs";

export default async function VentasPage({ searchParams }: { searchParams: SearchParams }) {
  const q = qpString((searchParams.q as string) || null);
  const sort = qpEnum((searchParams.sort as string) || null, ["date_desc", "date_asc", "total_desc", "total_asc", "id_desc", "id_asc"], "date_desc");
  const page = Math.max(1, qpNumber((searchParams.page as string) || null, 1));
  const perPage = Math.min(50, Math.max(5, qpNumber((searchParams.perPage as string) || null, 20)));
  const dateFromStr = qpString((searchParams.dateFrom as string) || null, "");
  const dateToStr = qpString((searchParams.dateTo as string) || null, "");
  const dateFrom = dateFromStr ? new Date(dateFromStr) : undefined;
  const dateTo = dateToStr ? new Date(dateToStr) : undefined;

  const and: Prisma.OrderWhereInput[] = [];
  if (q) {
    const maybeId = Number(q);
    and.push({
      OR: [
        { user: { is: { name: { contains: q, mode: "insensitive" } } } },
        { user: { is: { email: { contains: q, mode: "insensitive" } } } },
        ...(Number.isFinite(maybeId) ? [{ id: maybeId }] : []),
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
  const where: Prisma.OrderWhereInput = and.length ? { AND: and } : {};

  const total = await prisma.order.count({ where });
  const { skip, take } = prismaSkipTake(page, perPage);

  const orderBy: Prisma.OrderOrderByWithRelationInput =
    sort === "date_asc" ? { createdAt: "asc" } :
    sort === "total_desc" ? { total: "desc" } :
    sort === "total_asc" ? { total: "asc" } :
    sort === "id_desc" ? { id: "desc" } :
    sort === "id_asc" ? { id: "asc" } :
    { createdAt: "desc" };

  const dataRows = await prisma.order.findMany({
    where,
    orderBy,
    skip,
    take,
    select: { id: true, total: true, createdAt: true, user: { select: { name: true } } },
  });
  const meta = pageInfo(total, page, perPage);

  return <ClientTable rows={dataRows as SaleRow[]} page={meta.page} pages={meta.pages} />;
}
