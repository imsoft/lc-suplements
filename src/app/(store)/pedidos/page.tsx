import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge } from "@/components/store/order-badge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mis pedidos | LC Suplements" };

export default async function OrdersPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/autenticacion/iniciar-sesion?callbackUrl=/pedidos");

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: { include: { product: { select: { name: true } } } },
      address: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Mis pedidos</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-muted-foreground">Aún no tienes pedidos.</p>
          <Link href="/productos" className="text-primary hover:underline text-sm">
            Ver productos →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/pedidos/${order.id}`}
              className="block rounded border border-border p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">
                    #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("es-MX", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge status={order.status} />
                  <Badge status={order.paymentStatus} type="payment" />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1 text-sm text-muted-foreground">
                {order.items.slice(0, 3).map((item) => (
                  <span key={item.id}>{item.product.name}{order.items.indexOf(item) < order.items.length - 1 ? "," : ""}</span>
                ))}
                {order.items.length > 3 && (
                  <span>+{order.items.length - 3} más</span>
                )}
              </div>

              <p className="mt-2 font-bold">
                ${Number(order.total).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
