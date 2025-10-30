export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif">Dashboard</h2>
      <p className="text-gray-600">
        Resumen general de ventas, productos y talleres.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Ingresos (30d)", value: "$ 8.4 M" },
          { label: "Pedidos", value: "142" },
          { label: "Talleres activos", value: "5" },
          { label: "Clientes nuevos", value: "23" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-2xl border bg-white p-4">
            <p className="text-sm text-gray-500">{kpi.label}</p>
            <p className="text-2xl font-semibold mt-2">{kpi.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
