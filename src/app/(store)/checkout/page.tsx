import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { CheckoutForm } from "@/components/store/checkout-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Checkout | LC Suplements" };

export default async function CheckoutPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth/login?callbackUrl=/checkout");

  const cart = await db.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: { select: { id: true, name: true, slug: true } },
          variant: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) redirect("/cart");

  const defaultAddress = await db.address.findFirst({
    where: { userId: session.user.id, isDefault: true },
  });

  const shippingZones = await db.shippingZone.findMany({
    where: { isActive: true },
    orderBy: { cost: "asc" },
  });

  const serializedCart = {
    ...cart,
    items: cart.items.map((item) => ({
      ...item,
      variant: { ...item.variant, price: Number(item.variant.price) },
    })),
  };
  const serializedZones = shippingZones.map((z) => ({
    ...z,
    cost: Number(z.cost),
    freeThreshold: z.freeThreshold ? Number(z.freeThreshold) : null,
  }));
  const subtotal = serializedCart.items.reduce(
    (acc, item) => acc + item.variant.price * item.quantity,
    0
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Finalizar compra</h1>
      <CheckoutForm
        cart={serializedCart}
        subtotal={subtotal}
        defaultAddress={defaultAddress}
        shippingZones={serializedZones}
        userEmail={session.user.email}
        userName={session.user.name}
      />
    </div>
  );
}
