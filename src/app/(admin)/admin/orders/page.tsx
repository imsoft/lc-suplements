import Link from "next/link";
import { db } from "@/lib/db";
import { AdminOrderActions } from "@/components/admin/admin-order-actions";
import { Badge } from "@/components/store/order-badge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pedidos | LC Admin" };

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      address: true,
      items: { include: { product: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Pedidos</h1>

      <div className="rounded border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Cliente</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Total</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Pago</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Estado</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Fecha</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs">
                  <Link href={`/admin/orders/${order.id}`} className="text-primary hover:underline">
                    #{order.id.slice(-8).toUpperCase()}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{order.user?.name ?? "Invitado"}</p>
                  <p className="text-xs text-muted-foreground">{order.user?.email ?? order.guestEmail ?? "—"}</p>
                </td>
                <td className="px-4 py-3 font-medium">
                  ${Number(order.total).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3">
                  <Badge status={order.paymentStatus} type="payment" />
                </td>
                <td className="px-4 py-3">
                  <Badge status={order.status} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString("es-MX")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <AdminOrderActions orderId={order.id} currentStatus={order.status} />
                    <Link href={`/admin/orders/${order.id}`} className="whitespace-nowrap text-xs text-primary hover:underline">
                      Ver
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
