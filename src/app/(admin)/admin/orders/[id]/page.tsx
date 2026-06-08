import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { Badge } from "@/components/store/order-badge";
import { AdminOrderActions } from "@/components/admin/admin-order-actions";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Detalle del pedido | LC Admin" };

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

const money = (n: unknown) =>
  `$${Number(n).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      address: true,
      items: {
        include: {
          product: { select: { name: true, slug: true } },
          variant: { select: { name: true, value: true } },
        },
      },
    },
  });

  if (!order) notFound();

  return (
    <div>
      <Link href="/admin/orders" className="text-sm text-primary hover:underline">
        ← Volver a pedidos
      </Link>

      <div className="mt-3 mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Pedido <span className="font-mono">#{order.id.slice(-8).toUpperCase()}</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleString("es-MX", {
              year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge status={order.status} />
          <Badge status={order.paymentStatus} type="payment" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Productos */}
          <section className="rounded border border-border">
            <h2 className="border-b border-border px-4 py-3 font-semibold">Productos</h2>
            {order.items.map((item, i) => (
              <div
                key={item.id}
                className={`flex justify-between gap-4 px-4 py-3 ${i < order.items.length - 1 ? "border-b border-border" : ""}`}
              >
                <div>
                  <Link href={`/productos/${item.product.slug}`} className="text-sm font-medium hover:text-primary">
                    {item.product.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {item.variant.name}: {item.variant.value} · {item.quantity} × {money(item.unitPrice)}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold">{money(item.total)}</p>
              </div>
            ))}
          </section>

          {/* Totales */}
          <section className="rounded border border-border p-4 text-sm">
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{money(order.subtotal)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Envío</span>
              <span>{Number(order.shippingCost) === 0 ? "GRATIS" : money(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
              <span>Total</span>
              <span>{money(order.total)}</span>
            </div>
          </section>
        </div>

        {/* Columna lateral */}
        <div className="space-y-6">
          {/* Estado */}
          <section className="rounded border border-border p-4">
            <h2 className="mb-3 font-semibold">Cambiar estado</h2>
            <AdminOrderActions orderId={order.id} currentStatus={order.status} />
          </section>

          {/* Cliente */}
          <section className="rounded border border-border p-4 text-sm">
            <h2 className="mb-2 font-semibold">Cliente</h2>
            <p className="font-medium">{order.user?.name ?? "Invitado"}</p>
            <p className="text-muted-foreground">{order.user?.email ?? order.guestEmail ?? "—"}</p>
            {order.address?.phone && <p className="text-muted-foreground">Tel: {order.address.phone}</p>}
          </section>

          {/* Dirección de envío */}
          {order.address && (
            <section className="rounded border border-border p-4 text-sm">
              <h2 className="mb-2 font-semibold">Dirección de envío</h2>
              <p>{order.address.fullName}</p>
              <p>{order.address.street}</p>
              {order.address.neighborhood && <p>{order.address.neighborhood}</p>}
              <p>{order.address.city}, {order.address.state} {order.address.zipCode}</p>
              <p>{order.address.country}</p>
              {order.address.references && (
                <p className="mt-1 text-muted-foreground">Ref: {order.address.references}</p>
              )}
            </section>
          )}

          {/* MercadoPago */}
          {(order.mpPaymentId || order.mpPreferenceId) && (
            <section className="rounded border border-border p-4 text-xs">
              <h2 className="mb-2 text-sm font-semibold">MercadoPago</h2>
              {order.mpPaymentId && (
                <p className="break-all text-muted-foreground">Pago: {order.mpPaymentId}</p>
              )}
              {order.mpPreferenceId && (
                <p className="break-all text-muted-foreground">Preferencia: {order.mpPreferenceId}</p>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
