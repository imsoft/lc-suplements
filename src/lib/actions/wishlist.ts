"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function toggleWishlist({ productId }: { productId: string }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "No autorizado." };

  const existing = await db.wishlistItem.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });

  if (existing) {
    await db.wishlistItem.delete({ where: { id: existing.id } });
  } else {
    await db.wishlistItem.create({
      data: { userId: session.user.id, productId },
    });
  }

  revalidatePath("/wishlist");
  return { success: true };
}
