"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { mpPreference } from "@/lib/mercadopago";
import { getGuestSessionId, clearGuestSession } from "@/lib/guest-session";

interface CheckoutData {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  references: string;
  shippingZoneId: string;
  saveAddress: boolean;
}

const cartInclude = {
  items: {
    include: {
      product: { select: { name: true } },
      variant: true,
    },
  },
} as const;

export async function createCheckout(data: CheckoutData) {
  const session = await auth.api.getSession({ headers: await headers() });

  // ── Obtener carrito ──────────────────────────────────────────────────────
  let cart;
  let userId: string | undefined;
  let payerEmail: string;

  if (session) {
    userId = session.user.id;
    payerEmail = session.user.email;
    cart = await db.cart.findUnique({ where: { userId }, include: cartInclude });
  } else {
    const sessionId = await getGuestSessionId();
    if (!sessionId) return { error: "Carrito no encontrado." };
    cart = await db.cart.findUnique({ where: { sessionId }, include: cartInclude });
    payerEmail = data.email;
  }

  if (!cart || cart.items.length === 0) return { error: "Carrito vacío." };

  // ── Zona de envío ────────────────────────────────────────────────────────
  const shippingZone = await db.shippingZone.findUnique({
    where: { id: data.shippingZoneId },
  });
  if (!shippingZone) return { error: "Zona de envío inválida." };

  // ── Totales ──────────────────────────────────────────────────────────────
  const subtotal = cart.items.reduce(
    (acc, item) => acc + Number(item.variant.price) * item.quantity,
    0
  );
  const freeShipping =
    shippingZone.freeThreshold && subtotal >= Number(shippingZone.freeThreshold);
  const shippingCost = freeShipping ? 0 : Number(shippingZone.cost);
  const total = subtotal + shippingCost;

  // ── Crear orden ──────────────────────────────────────────────────────────
  const order = await db.order.create({
    data: {
      ...(userId ? { userId } : { guestEmail: payerEmail }),
      subtotal,
      shippingCost,
      total,
      address: {
        create: {
          fullName: data.fullName,
          phone: data.phone,
          street: data.street,
          neighborhood: data.neighborhood,
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

  // Guardar dirección solo para usuarios registrados
  if (data.saveAddress && userId) {
    await db.address.create({
      data: {
        userId,
        fullName: data.fullName,
        phone: data.phone,
        street: data.street,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        references: data.references,
      },
    });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://lcsuplements.com";

  // Los invitados van a /checkout/gracias, los usuarios a /orders/:id
  const successUrl = userId
    ? `${appUrl}/pedidos/${order.id}?status=success`
    : `${appUrl}/pagar/gracias?order=${order.id}`;

  // ── MercadoPago ──────────────────────────────────────────────────────────
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
        email: payerEmail,
        phone: { number: data.phone },
      },
      back_urls: {
        success: successUrl,
        failure: `${appUrl}/pagar?status=failure`,
        pending: successUrl,
      },
      auto_return: "approved",
      notification_url: `${appUrl}/api/webhooks/mercadopago`,
    },
  });

  await db.order.update({
    where: { id: order.id },
    data: { mpPreferenceId: preference.id },
  });

  // Vaciar carrito
  await db.cartItem.deleteMany({ where: { cartId: cart.id } });

  // Limpiar cookie de invitado
  if (!userId) await clearGuestSession();

  redirect(preference.init_point!);
}
