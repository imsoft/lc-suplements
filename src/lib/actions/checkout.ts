"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { mpPreference } from "@/lib/mercadopago";

interface CheckoutData {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  references: string;
  shippingZoneId: string;
  saveAddress: boolean;
}

export async function createCheckout(data: CheckoutData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "No autorizado." };

  const cart = await db.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: { select: { name: true } },
          variant: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) return { error: "Carrito vacío." };

  const shippingZone = await db.shippingZone.findUnique({
    where: { id: data.shippingZoneId },
  });

  if (!shippingZone) return { error: "Zona de envío inválida." };

  const subtotal = cart.items.reduce(
    (acc, item) => acc + Number(item.variant.price) * item.quantity,
    0
  );

  const freeShipping =
    shippingZone.freeThreshold && subtotal >= Number(shippingZone.freeThreshold);
  const shippingCost = freeShipping ? 0 : Number(shippingZone.cost);
  const total = subtotal + shippingCost;

  const order = await db.order.create({
    data: {
      userId: session.user.id,
      subtotal,
      shippingCost,
      total,
      address: {
        create: {
          fullName: data.fullName,
          phone: data.phone,
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          references: data.references,
        },
      },
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: item.variant.price,
          total: Number(item.variant.price) * item.quantity,
        })),
      },
    },
  });

  if (data.saveAddress) {
    await db.address.create({
      data: {
        userId: session.user.id,
        fullName: data.fullName,
        phone: data.phone,
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        references: data.references,
      },
    });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const preference = await mpPreference.create({
    body: {
      external_reference: order.id,
      items: cart.items.map((item) => ({
        id: item.variantId,
        title: `${item.product.name} - ${item.variant.value}`,
        quantity: item.quantity,
        unit_price: Number(item.variant.price),
        currency_id: "MXN",
      })),
      payer: {
        name: data.fullName,
        email: session.user.email,
        phone: { number: data.phone },
      },
      back_urls: {
        success: `${appUrl}/orders/${order.id}?status=success`,
        failure: `${appUrl}/checkout?status=failure`,
        pending: `${appUrl}/orders/${order.id}?status=pending`,
      },
      auto_return: "approved",
      notification_url: `${appUrl}/api/webhooks/mercadopago`,
    },
  });

  await db.order.update({
    where: { id: order.id },
    data: { mpPreferenceId: preference.id },
  });

  await db.cartItem.deleteMany({ where: { cartId: cart.id } });

  redirect(preference.init_point!);
}
