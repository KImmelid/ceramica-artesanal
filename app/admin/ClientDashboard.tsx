"use client";
import { LineKPI, BarKPI } from "./componentes/ChartKPI";

type KPI = { label: string; value: string; helper?: string };
type Point = { label: string; value: number };

export default function ClientDashboard({ kpis, sales, workshops }: { kpis: KPI[]; sales: Point[]; workshops: Point[] }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-400">Visor general</p>
          <h1 className="text-3xl font-serif">Dashboard</h1>
        </div>
        <span className="pill">
          <span className="pill-dot" aria-hidden="true" />
          Datos actualizados en tiempo real
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="card bg-white/95">
            <p className="text-sm text-neutral-500">{k.label}</p>
            <p className="text-3xl font-serif mt-2">{k.value}</p>
            {k.helper && <p className="text-xs text-neutral-400 mt-1">{k.helper}</p>}
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
