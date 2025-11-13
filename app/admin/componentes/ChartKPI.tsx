"use client";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";

export function LineKPI({ data }: { data: { label: string; value: number }[] }) {
  return (
    <div className="card bg-white/95">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-neutral-500">Ventas ultimos 30 dias</p>
        <span className="pill text-xs">ARS</span>
      </div>
      <div className="h-56">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0e7df" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#c4623e" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function BarKPI({ data }: { data: { label: string; value: number }[] }) {
  return (
    <div className="card bg-white/95">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-neutral-500">Talleres por mes</p>
        <span className="pill text-xs">Agenda</span>
      </div>
      <div className="h-56">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0e7df" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#f0b9a3" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
