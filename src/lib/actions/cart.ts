"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

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
  if (!session) return { error: "Debes iniciar sesión." };

  const variant = await db.productVariant.findUnique({ where: { id: variantId } });
  if (!variant || variant.stock < quantity) return { error: "Stock insuficiente." };

  let cart = await db.cart.findUnique({ where: { userId: session.user.id } });
  if (!cart) {
    cart = await db.cart.create({ data: { userId: session.user.id } });
  }

  const existing = await db.cartItem.findUnique({
    where: { cartId_variantId: { cartId: cart.id, variantId } },
  });

  if (existing) {
    const newQty = existing.quantity + quantity;
    if (newQty > variant.stock) return { error: "Stock insuficiente." };
    await db.cartItem.update({
      where: { id: existing.id },
      data: { quantity: newQty },
    });
  } else {
    await db.cartItem.create({
      data: { cartId: cart.id, productId, variantId, quantity },
    });
  }

  revalidatePath("/cart");
  return { success: true };
}

export async function updateCartItem({
  itemId,
  quantity,
}: {
  itemId: string;
  quantity: number;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "No autorizado." };

  if (quantity <= 0) {
    await db.cartItem.delete({ where: { id: itemId } });
  } else {
    await db.cartItem.update({ where: { id: itemId }, data: { quantity } });
  }

  revalidatePath("/cart");
  return { success: true };
}

export async function removeCartItem(itemId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "No autorizado." };

  await db.cartItem.delete({ where: { id: itemId } });
  revalidatePath("/cart");
  return { success: true };
}
