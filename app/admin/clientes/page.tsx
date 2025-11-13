import ClientTable, { type ClientRow } from "./ClientTable";
import { prisma } from "@/lib/db";
import { qpNumber, qpString, qpEnum } from "@/lib/qs";
import { pageInfo, prismaSkipTake } from "@/lib/paginate";
import { Prisma } from "@prisma/client";

export const runtime = "nodejs";

export default async function AdminClientesPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const q = qpString(searchParams.q || null);
  const sort = qpEnum(searchParams.sort || null, ["date_desc", "date_asc", "name_asc", "name_desc"], "date_desc");
  const page = Math.max(1, qpNumber(searchParams.page || null, 1));
  const perPage = Math.min(50, Math.max(5, qpNumber(searchParams.perPage || null, 20)));

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

  const rows: ClientRow[] = await prisma.user.findMany({
    where,
    orderBy,
    skip,
    take,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  const meta = pageInfo(total, page, perPage);

  return <ClientTable rows={rows} page={meta.page} pages={meta.pages} />;
}
