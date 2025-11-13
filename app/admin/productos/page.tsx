import ClientTable, { type ProductRow } from "./ClientTable";
import NewProductForm from "./NewProductForm";
import { prisma } from "@/lib/db";
import { qpNumber, qpString, qpEnum } from "@/lib/qs";
import { pageInfo, prismaSkipTake } from "@/lib/paginate";
import { Prisma } from "@prisma/client";

export const runtime = "nodejs";

type AdminSearchParams = Record<string, string | string[] | undefined>;
const firstValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
};

export default async function AdminProductosPage({ searchParams }: { searchParams?: AdminSearchParams | Promise<AdminSearchParams> }) {
  const resolved = (await searchParams) ?? {};
  const q = qpString(firstValue(resolved.q));
  const sort = qpEnum(
    firstValue(resolved.sort),
    [
      "date_desc",
      "date_asc",
      "price_desc",
      "price_asc",
      "stock_desc",
      "stock_asc",
      "name_asc",
      "name_desc",
    ],
    "date_desc",
  );
  const page = Math.max(1, qpNumber(firstValue(resolved.page), 1));
  const perPage = Math.min(50, Math.max(5, qpNumber(firstValue(resolved.perPage), 20)));

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

  const rows: ProductRow[] = await prisma.product.findMany({
    where,
    orderBy,
    skip,
    take,
    select: { id: true, name: true, price: true, stock: true, image: true, createdAt: true },
  });
  const meta = pageInfo(total, page, perPage);

  return (
    <div className="space-y-5">
      <NewProductForm />
      <ClientTable rows={rows} page={meta.page} pages={meta.pages} />
    </div>
  );
}
