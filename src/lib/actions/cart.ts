"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getOrCreateGuestSessionId } from "@/lib/guest-session";

export async function addToCart({
  productId,
  variantId,
  quantity,
}: {
  productId: string;
  variantId: string;
  quantity: number;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  const variant = await db.productVariant.findUnique({ where: { id: variantId } });
  if (!variant || variant.stock < quantity) return { error: "Stock insuficiente." };

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
  if (quantity <= 0) {
    await db.cartItem.delete({ where: { id: itemId } });
  } else {
    await db.cartItem.update({ where: { id: itemId }, data: { quantity } });
  }
  revalidatePath("/carrito");
  return { success: true };
}

export async function removeCartItem(itemId: string) {
  await db.cartItem.delete({ where: { id: itemId } });
  revalidatePath("/carrito");
  return { success: true };
}
