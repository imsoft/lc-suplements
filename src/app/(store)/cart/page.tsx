import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { CartItemRow } from "@/components/store/cart-item-row";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Carrito | LC Suplements" };

export default async function CartPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth/login?callbackUrl=/cart");

  const cart = await db.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: { include: { images: { where: { isPrimary: true }, take: 1 } } },
          variant: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  const rawItems = cart?.items ?? [];
  const items = rawItems.map((item) => ({
    ...item,
    variant: { ...item.variant, price: Number(item.variant.price), stock: item.variant.stock },
  }));
  const subtotal = items.reduce(
    (acc, item) => acc + item.variant.price * item.quantity,
    0
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Tu carrito</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-muted-foreground">Tu carrito está vacío.</p>
          <Button asChild>
            <Link href="/products">Ver productos</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="divide-y divide-border rounded border border-border">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div className="rounded border border-border p-6 h-fit">
            <h2 className="mb-4 text-base font-semibold">Resumen</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Envío</span>
                <span className="text-muted-foreground">Se calcula al pagar</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>${subtotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <Button className="mt-4 w-full" asChild>
              <Link href="/checkout">Proceder al pago</Link>
            </Button>
            <Button variant="outline" className="mt-2 w-full" asChild>
              <Link href="/products">Seguir comprando</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
