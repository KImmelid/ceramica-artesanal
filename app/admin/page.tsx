import { prisma } from "@/lib/db";
import ClientDashboard from "./ClientDashboard";

type TrendPoint = { label: string; value: number };

function formatMoney(n: number) {
  return `$${n.toLocaleString("es-ES")}`;
}

async function salesTrendLast30(): Promise<TrendPoint[]> {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: since } },
    select: { total: true, createdAt: true },
  });
  const byDay = new Map<string, number>();
  for (const o of orders) {
    const key = new Date(o.createdAt).toISOString().slice(0, 10);
    byDay.set(key, (byDay.get(key) || 0) + Number(o.total));
  }
  return Array.from({ length: 30 }).map((_, i) => {
    const d = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    return { label: key.slice(5), value: byDay.get(key) || 0 };
  });
}

async function workshopsByMonth(): Promise<TrendPoint[]> {
  try {
    const workshops = await prisma.workshop.findMany({ select: { date: true } });
    const byMonth = new Map<string, number>();
    for (const workshop of workshops) {
      const key = new Date(workshop.date).toISOString().slice(0, 7);
      byMonth.set(key, (byMonth.get(key) || 0) + 1);
    }
    return Array.from(byMonth.entries()).map(([label, value]) => ({ label, value }));
  } catch {
    return [];
  }
}

export const runtime = "nodejs";

export default async function AdminDashboard() {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [{ _sum }, pedidos30d, clientes30d, sales, workshops] = await Promise.all([
    prisma.order.aggregate({ where: { createdAt: { gte: since } }, _sum: { total: true } }),
    prisma.order.count({ where: { createdAt: { gte: since } } }),
    prisma.user.count({ where: { createdAt: { gte: since } } }),
    salesTrendLast30(),
    workshopsByMonth(),
  ]);

  const ingresos30d = Number(_sum.total || 0);

  const KPIS = [
    { label: "Ingresos (30d)", value: formatMoney(ingresos30d), helper: "Ventas con entrega confirmada" },
    { label: "Pedidos (30d)", value: pedidos30d.toLocaleString("es-ES"), helper: "Incluye tienda y talleres" },
    { label: "Clientes nuevos (30d)", value: clientes30d.toLocaleString("es-ES"), helper: "Altas verificadas" },
  ];

  return <ClientDashboard kpis={KPIS} sales={sales} workshops={workshops} />;
}
