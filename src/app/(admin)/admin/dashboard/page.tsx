import { db } from "@/lib/db";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard | LC Admin" };

export default async function DashboardPage() {
  const [totalOrders, totalRevenue, totalProducts, totalUsers, recentOrders] = await Promise.all([
    db.order.count(),
    db.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID" } }),
    db.product.count({ where: { isActive: true } }),
    db.user.count(),
    db.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } }, address: true },
    }),
  ]);

  const revenue = Number(totalRevenue._sum.total ?? 0);

  const stats = [
    { label: "Pedidos totales", value: totalOrders.toLocaleString("es-MX") },
    { label: "Ingresos (pagados)", value: `$${revenue.toLocaleString("es-MX", { minimumFractionDigits: 2 })}` },
    { label: "Productos activos", value: totalProducts.toLocaleString("es-MX") },
    { label: "Clientes", value: totalUsers.toLocaleString("es-MX") },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Dashboard</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-primary">{stat.value}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-3 text-base font-semibold">Pedidos recientes</h2>
      <div className="overflow-x-auto rounded border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Cliente</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Total</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Estado</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {recentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs">#{order.id.slice(-8).toUpperCase()}</td>
                <td className="px-4 py-3">{order.user.name}</td>
                <td className="px-4 py-3 font-medium">
                  ${Number(order.total).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString("es-MX")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
