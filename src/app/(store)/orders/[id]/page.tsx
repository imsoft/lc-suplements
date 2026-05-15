import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge } from "@/components/store/order-badge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Detalle del pedido | LC Suplements" };

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
}

export default async function OrderDetailPage({ params, searchParams }: OrderDetailPageProps) {
  const { id } = await params;
  const { status } = await searchParams;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth/login");

  const order = await db.order.findFirst({
    where: { id, userId: session.user.id },
    include: {
      items: {
        include: {
          product: { select: { name: true, slug: true } },
          variant: { select: { name: true, value: true } },
        },
      },
      address: true,
    },
  });

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {status === "success" && (
        <div className="mb-6 rounded bg-green-500/10 border border-green-500/30 px-4 py-3 text-green-700">
          ¡Pago completado! Tu pedido ha sido confirmado.
        </div>
      )}
      {status === "pending" && (
        <div className="mb-6 rounded bg-yellow-500/10 border border-yellow-500/30 px-4 py-3 text-yellow-700">
          Tu pago está siendo procesado. Te notificaremos cuando se confirme.
        </div>
      )}

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pedido</h1>
          <p className="font-mono text-sm text-muted-foreground">
            #{order.id.slice(-8).toUpperCase()}
          </p>
          <p className="text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleDateString("es-MX", {
              year: "numeric", month: "long", day: "numeric",
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge status={order.status} />
          <Badge status={order.paymentStatus} type="payment" />
        </div>
      </div>

      <div className="space-y-4">
        {/* Items */}
        <div className="rounded border border-border">
          {order.items.map((item, i) => (
            <div
              key={item.id}
              className={`flex justify-between p-4 ${i < order.items.length - 1 ? "border-b border-border" : ""}`}
            >
              <div>
                <Link href={`/products/${item.product.slug}`} className="text-sm font-medium hover:text-primary">
                  {item.product.name}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {item.variant.name}: {item.variant.value} × {item.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold">
                ${Number(item.total).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="rounded border border-border p-4 text-sm">
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${Number(order.subtotal).toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Envío</span>
            <span>{Number(order.shippingCost) === 0 ? "GRATIS" : `$${Number(order.shippingCost).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 font-bold text-base">
            <span>Total</span>
            <span>${Number(order.total).toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Shipping address */}
        {order.address && (
          <div className="rounded border border-border p-4 text-sm">
            <h3 className="mb-2 font-semibold">Dirección de entrega</h3>
            <p>{order.address.fullName}</p>
            <p>{order.address.street}</p>
            <p>{order.address.city}, {order.address.state} {order.address.zipCode}</p>
            <p>{order.address.country}</p>
            {order.address.references && (
              <p className="text-muted-foreground">Ref: {order.address.references}</p>
            )}
          </div>
        )}
      </div>

      <div className="mt-6">
        <Link href="/orders" className="text-sm text-primary hover:underline">
          ← Volver a mis pedidos
        </Link>
      </div>
    </div>
  );
}
