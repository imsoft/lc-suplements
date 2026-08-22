"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getOrCreateGuestSessionId, getGuestSessionId } from "@/lib/guest-session";

/**
 * Devuelve el carrito del visitante actual (usuario o invitado).
 * Todas las mutaciones pasan por aquí para que nadie pueda modificar
 * el carrito de otra persona conociendo el id de un renglón.
 */
async function getCurrentCartId(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    const cart = await db.cart.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });
    return cart?.id ?? null;
  }

  const sessionId = await getGuestSessionId();
  if (!sessionId) return null;
  const cart = await db.cart.findUnique({ where: { sessionId }, select: { id: true } });
  return cart?.id ?? null;
}

export async function addToCart({
  productId,
  variantId,
  quantity,
}: {
  productId: string;
  variantId: string;
  quantity: number;
}) {
  if (!Number.isInteger(quantity) || quantity < 1) return { error: "Cantidad inválida." };

  const session = await auth.api.getSession({ headers: await headers() });

  const variant = await db.productVariant.findUnique({ where: { id: variantId } });
  if (!variant || !variant.isActive) return { error: "Esta presentación ya no está disponible." };
  if (variant.productId !== productId) return { error: "Producto inválido." };
  if (variant.stock < quantity) return { error: "Stock insuficiente." };

  let cart;
  if (session) {
    cart = await db.cart.findUnique({ where: { userId: session.user.id } });
    if (!cart) cart = await db.cart.create({ data: { userId: session.user.id } });
  } else {
    const sessionId = await getOrCreateGuestSessionId();
    cart = await db.cart.findUnique({ where: { sessionId } });
    if (!cart) cart = await db.cart.create({ data: { sessionId } });
  }

  const existing = await db.cartItem.findUnique({
    where: { cartId_variantId: { cartId: cart.id, variantId } },
  });

  if (existing) {
    const newQty = existing.quantity + quantity;
    if (newQty > variant.stock) return { error: "Stock insuficiente." };
    await db.cartItem.update({ where: { id: existing.id }, data: { quantity: newQty } });
  } else {
    await db.cartItem.create({ data: { cartId: cart.id, productId, variantId, quantity } });
  }

  revalidatePath("/carrito");
  return { success: true };
}

export async function updateCartItem({
  itemId,
  quantity,
}: {
  itemId: string;
  quantity: number;
}) {
  const cartId = await getCurrentCartId();
  if (!cartId) return { error: "Carrito no encontrado." };

  const item = await db.cartItem.findFirst({
    where: { id: itemId, cartId },
    include: { variant: { select: { stock: true } } },
  });
  if (!item) return { error: "Ese producto ya no está en tu carrito." };

  if (quantity <= 0) {
    await db.cartItem.delete({ where: { id: item.id } });
  } else {
    if (!Number.isInteger(quantity)) return { error: "Cantidad inválida." };
    if (quantity > item.variant.stock)
      return { error: `Solo quedan ${item.variant.stock} piezas disponibles.` };
    await db.cartItem.update({ where: { id: item.id }, data: { quantity } });
  }

  revalidatePath("/carrito");
  revalidatePath("/pagar");
  return { success: true };
}

export async function removeCartItem(itemId: string) {
  const cartId = await getCurrentCartId();
  if (!cartId) return { error: "Carrito no encontrado." };

  const { count } = await db.cartItem.deleteMany({ where: { id: itemId, cartId } });
  if (count === 0) return { error: "Ese producto ya no está en tu carrito." };

  revalidatePath("/carrito");
  revalidatePath("/pagar");
  return { success: true };
}
