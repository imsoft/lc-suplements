"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { uploadProductImage, deleteProductImage } from "@/lib/cloudinary";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "ADMIN") throw new Error("No autorizado.");
  return session;
}

// ─── Orders ──────────────────────────────────────────────────────────────────

const VALID_ORDER_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;
type OrderStatus = typeof VALID_ORDER_STATUSES[number];

export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdmin();
  if (!VALID_ORDER_STATUSES.includes(status as OrderStatus)) {
    return { error: "Estado inválido." };
  }
  await db.order.update({ where: { id: orderId }, data: { status: status as OrderStatus } });
  revalidatePath("/admin/orders");
  return { success: true };
}

// ─── Products ────────────────────────────────────────────────────────────────

export async function createProduct(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const description = formData.get("description") as string;
  const brand = formData.get("brand") as string;
  const categoryId = formData.get("categoryId") as string;
  const isFeatured = formData.get("isFeatured") === "true";

  const product = await db.product.create({
    data: { name, slug, description, brand: brand || null, categoryId, isFeatured },
  });

  // Handle variants
  const variantNames = formData.getAll("variantName") as string[];
  const variantValues = formData.getAll("variantValue") as string[];
  const variantPrices = formData.getAll("variantPrice") as string[];
  const variantStocks = formData.getAll("variantStock") as string[];

  if (variantNames.length > 0) {
    await db.productVariant.createMany({
      data: variantNames.map((name, i) => ({
        productId: product.id,
        name,
        value: variantValues[i],
        price: parseFloat(variantPrices[i]),
        stock: parseInt(variantStocks[i] ?? "0"),
      })),
    });
  }

  // Handle images — max 6, organized by product slug
  const imageFiles = (formData.getAll("images") as File[])
    .filter((f) => f && f.size > 0)
    .slice(0, 6);

  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i];
    const buffer = await file.arrayBuffer();
    const base64 = `data:${file.type};base64,${Buffer.from(buffer).toString("base64")}`;
    const { url, publicId } = await uploadProductImage(base64, slug);
    await db.productImage.create({
      data: { productId: product.id, url, publicId, isPrimary: i === 0, sortOrder: i },
    });
  }

  revalidatePath("/admin/products");
  revalidatePath("/productos");
  return { success: true, productId: product.id };
}

export async function updateProduct(productId: string, formData: FormData) {
  await requireAdmin();

  await db.product.update({
    where: { id: productId },
    data: {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      brand: (formData.get("brand") as string) || null,
      categoryId: formData.get("categoryId") as string,
      isFeatured: formData.get("isFeatured") === "true",
      isActive: formData.get("isActive") === "true",
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/productos");
  return { success: true };
}

export async function deleteProduct(productId: string) {
  await requireAdmin();

  const images = await db.productImage.findMany({ where: { productId } });
  await Promise.all(images.map((img) => deleteProductImage(img.publicId)));

  await db.product.delete({ where: { id: productId } });
  revalidatePath("/admin/products");
  revalidatePath("/productos");
  return { success: true };
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function createCategory(data: {
  name: string;
  description?: string;
  parentId?: string;
}) {
  await requireAdmin();
  const slug = data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  await db.category.create({ data: { ...data, slug } });
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function updateCategory(
  categoryId: string,
  data: { name: string; description?: string; parentId?: string }
) {
  await requireAdmin();
  const slug = data.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  await db.category.update({ where: { id: categoryId }, data: { ...data, slug, parentId: data.parentId || null } });
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(categoryId: string) {
  await requireAdmin();
  await db.category.delete({ where: { id: categoryId } });
  revalidatePath("/admin/categories");
  return { success: true };
}

// ─── Shipping ────────────────────────────────────────────────────────────────

export async function saveShippingZone(data: {
  id?: string;
  name: string;
  states: string[];
  cost: number;
  freeThreshold?: number;
}) {
  await requireAdmin();

  if (data.id) {
    await db.shippingZone.update({
      where: { id: data.id },
      data: { name: data.name, states: data.states, cost: data.cost, freeThreshold: data.freeThreshold ?? null },
    });
  } else {
    await db.shippingZone.create({
      data: { name: data.name, states: data.states, cost: data.cost, freeThreshold: data.freeThreshold ?? null },
    });
  }

  revalidatePath("/admin/shipping");
  return { success: true };
}

export async function deleteShippingZone(id: string) {
  await requireAdmin();
  await db.shippingZone.delete({ where: { id } });
  revalidatePath("/admin/shipping");
  return { success: true };
}
