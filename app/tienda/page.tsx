import { prisma } from "@/lib/db";
import ProductList, { type ProductListItem } from "@/components/ProductList";

export const runtime = "nodejs";

export default async function TiendaPage() {
  const products: ProductListItem[] = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 24,
    select: { id: true, name: true, price: true, stock: true, image: true },
  });
  return (
    <div className="section container">
      <h1 className="text-3xl font-serif mb-6">Tienda</h1>
      <ProductList products={products} />
    </div>
  );
}
