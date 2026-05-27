"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function submitReview({
  productId,
  rating,
  title,
  body,
}: {
  productId: string;
  rating: number;
  title: string;
  body: string;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Debes iniciar sesión." };

  if (rating < 1 || rating > 5) return { error: "Calificación inválida." };

  await db.review.upsert({
    where: { productId_userId: { productId, userId: session.user.id } },
    create: { productId, userId: session.user.id, rating, title, body },
    update: { rating, title, body },
  });

  const product = await db.product.findUnique({ where: { id: productId }, select: { slug: true } });
  revalidatePath(`/productos/${product?.slug}`);
  return { success: true };
}
