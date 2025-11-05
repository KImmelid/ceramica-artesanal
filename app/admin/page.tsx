import { prisma } from "@/lib/db";
import { LineKPI, BarKPI } from "./componentes/ChartKPI";

// Fake aggregation simple; en la práctica usarías groupBy/aggregate
async function getSalesLast30() {
  const since = new Date(Date.now() - 30*24*60*60*1000);
  const orders = await prisma.order.findMany({ where: { createdAt: { gte: since } } });
  const byDay = new Map<string, number>();
  for (const o of orders) {
    const k = new Date(o.createdAt).toISOString().slice(0,10);
    byDay.set(k, (byDay.get(k) || 0) + Number(o.total));
  }
  const days = Array.from({length:30}).map((_,i)=>{
    const d = new Date(Date.now() - (29-i)*24*60*60*1000);
    const key = d.toISOString().slice(0,10);
    return { label: key.slice(5), value: byDay.get(key) || 0 };
  });
  return days;
}

async function getWorkshopsByMonth() {
  const ws = await prisma.workshop.findMany();
  const byMonth = new Map<string, number>();
  for (const w of ws) {
    const k = new Date(w.date).toISOString().slice(0,7);
    byMonth.set(k, (byMonth.get(k) || 0) + 1);
  }
  return Array.from(byMonth.entries()).map(([k,v])=>({ label: k, value: v }));
}

export default async function AdminDashboard() {
  const [sales, workshops] = await Promise.all([getSalesLast30(), getWorkshopsByMonth()]);
  const KPIS = [
    { label: "Ingresos (30d)", value: sales.reduce((a,b)=>a+b.value,0) },
    { label: "Pedidos", value: sales.length /* proxy simple */ },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {KPIS.map(k => (
          <div key={k.label} className="rounded-2xl border bg-white p-4">
            <div className="text-sm text-gray-500">{k.label}</div>
            <div className="text-2xl font-semibold mt-1">${k.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <LineKPI data={sales} />
        <BarKPI data={workshops} />
      </div>
    </div>
  );
}
