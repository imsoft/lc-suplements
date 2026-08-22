"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { uploadProductImage, deleteProductImage } from "@/lib/cloudinary";
import { slugify, uniqueSlug } from "@/lib/slug";

/** Resultado uniforme de las acciones del admin: nunca se lanza al cliente. */
export type ActionResult<T = unknown> = { success: true; data?: T } | { error: string };

const MAX_IMAGES = 6;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB por imagen
const MAX_TOTAL_BYTES = 20 * 1024 * 1024; // 20 MB por envío

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "ADMIN") throw new Error("No autorizado.");
  return session;
}

/** Traduce errores conocidos de Prisma a un mensaje que el admin pueda entender. */
function readableError(error: unknown, fallback: string): string {
  const code = (error as { code?: string })?.code;
  const message = error instanceof Error ? error.message : "";

  if (message === "No autorizado.") return "Tu sesión expiró o no tienes permisos. Vuelve a iniciar sesión.";
  if (code === "P2002") return "Ya existe un registro con esos datos únicos.";
  if (code === "P2003" || code === "P2014")
    return "No se puede completar: hay otros registros relacionados que dependen de este.";
  if (code === "P2025") return "El registro ya no existe. Actualiza la página.";

  console.error(fallback, error);
  return fallback;
}

// ─── Orders ──────────────────────────────────────────────────────────────────

const VALID_ORDER_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;
type OrderStatus = typeof VALID_ORDER_STATUSES[number];

export async function updateOrderStatus(orderId: string, status: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    if (!VALID_ORDER_STATUSES.includes(status as OrderStatus)) {
      return { error: "Estado inválido." };
    }
    await db.order.update({ where: { id: orderId }, data: { status: status as OrderStatus } });
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    return { error: readableError(error, "No se pudo actualizar el estado del pedido.") };
  }
}

// ─── Products ────────────────────────────────────────────────────────────────

interface ParsedVariant {
  name: string;
  value: string;
  price: number;
  stock: number;
}

/** Lee y valida las variantes del FormData. Devuelve un mensaje si algo está mal. */
function parseVariants(formData: FormData): { variants: ParsedVariant[] } | { error: string } {
  const names = formData.getAll("variantName").map(String);
  const values = formData.getAll("variantValue").map(String);
  const prices = formData.getAll("variantPrice").map(String);
  const stocks = formData.getAll("variantStock").map(String);

  const variants: ParsedVariant[] = [];

  for (let i = 0; i < names.length; i++) {
    const name = names[i]?.trim();
    const value = values[i]?.trim();
    const price = Number(prices[i]);
    const stock = Number.parseInt(stocks[i] ?? "0", 10);

    // Una fila totalmente vacía simplemente se ignora.
    if (!name && !value && !prices[i]?.trim()) continue;

    if (!name) return { error: `Variante ${i + 1}: falta el tipo (ej. "Sabor").` };
    if (!value) return { error: `Variante ${i + 1}: falta el valor (ej. "Chocolate").` };
    if (!Number.isFinite(price) || price <= 0)
      return { error: `Variante "${value}": el precio debe ser un número mayor a 0.` };
    if (price > 9_999_999)
      return { error: `Variante "${value}": el precio es demasiado alto.` };
    if (!Number.isFinite(stock) || stock < 0)
      return { error: `Variante "${value}": el stock debe ser un número igual o mayor a 0.` };

    variants.push({ name, value, price: Math.round(price * 100) / 100, stock });
  }

  if (variants.length === 0)
    return { error: "Agrega al menos una variante con valor y precio." };

  return { variants };
}

/** Valida los archivos de imagen antes de gastar tiempo subiéndolos. */
function parseImageFiles(formData: FormData, field: string): { files: File[] } | { error: string } {
  const files = (formData.getAll(field) as File[]).filter((f) => f instanceof File && f.size > 0);

  if (files.length > MAX_IMAGES)
    return { error: `Máximo ${MAX_IMAGES} imágenes por producto.` };

  let total = 0;
  for (const file of files) {
    if (!file.type.startsWith("image/"))
      return { error: `"${file.name}" no es una imagen válida.` };
    if (file.size > MAX_IMAGE_BYTES)
      return { error: `"${file.name}" pesa más de 8 MB. Comprímela o usa una más ligera.` };
    total += file.size;
  }
  if (total > MAX_TOTAL_BYTES)
    return { error: "Las imágenes suman más de 20 MB en total. Sube menos imágenes o más ligeras." };

  return { files };
}

async function uploadAll(files: File[], slug: string) {
  const uploaded: { url: string; publicId: string }[] = [];
  for (const file of files) {
    const buffer = await file.arrayBuffer();
    const base64 = `data:${file.type};base64,${Buffer.from(buffer).toString("base64")}`;
    uploaded.push(await uploadProductImage(base64, slug));
  }
  return uploaded;
}

/** Borra de Cloudinary lo que se subió cuando la operación falla después. */
async function rollbackUploads(uploaded: { publicId: string }[]) {
  await Promise.allSettled(uploaded.map((u) => deleteProductImage(u.publicId)));
}

export async function createProduct(formData: FormData): Promise<ActionResult<{ productId: string }>> {
  let uploaded: { url: string; publicId: string }[] = [];

  try {
    await requireAdmin();

    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const brand = String(formData.get("brand") ?? "").trim();
    const categoryId = String(formData.get("categoryId") ?? "").trim();
    const isFeatured = formData.get("isFeatured") === "true";

    if (!name) return { error: "El nombre del producto es obligatorio." };
    if (!description) return { error: "La descripción es obligatoria." };
    if (!categoryId) return { error: "Selecciona una categoría." };
    if (!slugify(name)) return { error: "El nombre debe incluir al menos una letra o número." };

    const category = await db.category.findUnique({ where: { id: categoryId }, select: { id: true } });
    if (!category) return { error: "La categoría seleccionada ya no existe. Recarga la página." };

    const parsedVariants = parseVariants(formData);
    if ("error" in parsedVariants) return { error: parsedVariants.error };

    const parsedImages = parseImageFiles(formData, "images");
    if ("error" in parsedImages) return { error: parsedImages.error };

    const slug = await uniqueSlug(name, async (candidate) =>
      !!(await db.product.findUnique({ where: { slug: candidate }, select: { id: true } }))
    );

    // Las imágenes se suben ANTES de tocar la base de datos: si Cloudinary
    // falla no queda un producto huérfano sin variantes ni fotos.
    try {
      uploaded = await uploadAll(parsedImages.files, slug);
    } catch (error) {
      await rollbackUploads(uploaded);
      console.error("Cloudinary upload failed", error);
      return { error: "No se pudieron subir las imágenes. Revisa tu conexión e inténtalo de nuevo." };
    }

    const product = await db.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: { name, slug, description, brand: brand || null, categoryId, isFeatured },
      });

      await tx.productVariant.createMany({
        data: parsedVariants.variants.map((v) => ({ productId: created.id, ...v })),
      });

      if (uploaded.length) {
        await tx.productImage.createMany({
          data: uploaded.map((img, i) => ({
            productId: created.id,
            url: img.url,
            publicId: img.publicId,
            isPrimary: i === 0,
            sortOrder: i,
          })),
        });
      }

      return created;
    });

    revalidatePath("/admin/products");
    revalidatePath("/productos");
    revalidatePath("/");
    return { success: true, data: { productId: product.id } };
  } catch (error) {
    await rollbackUploads(uploaded);
    return { error: readableError(error, "No se pudo crear el producto. Inténtalo de nuevo.") };
  }
}

type ImageOrderEntry = { t: "e"; id: string } | { t: "n"; i: number };

export async function updateProduct(productId: string, formData: FormData): Promise<ActionResult> {
  let uploaded: { url: string; publicId: string }[] = [];

  try {
    await requireAdmin();

    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const brand = String(formData.get("brand") ?? "").trim();
    const categoryId = String(formData.get("categoryId") ?? "").trim();

    if (!name) return { error: "El nombre del producto es obligatorio." };
    if (!description) return { error: "La descripción es obligatoria." };
    if (!categoryId) return { error: "Selecciona una categoría." };

    const category = await db.category.findUnique({ where: { id: categoryId }, select: { id: true } });
    if (!category) return { error: "La categoría seleccionada ya no existe. Recarga la página." };

    const existing = await db.product.findUnique({
      where: { id: productId },
      select: { id: true, slug: true },
    });
    if (!existing) return { error: "El producto ya no existe." };

    const parsedVariants = parseVariants(formData);
    if ("error" in parsedVariants) return { error: parsedVariants.error };

    const parsedImages = parseImageFiles(formData, "newImages");
    if ("error" in parsedImages) return { error: parsedImages.error };

    let order: ImageOrderEntry[] = [];
    const orderRaw = formData.get("imageOrder");
    if (typeof orderRaw === "string" && orderRaw) {
      try {
        order = JSON.parse(orderRaw) as ImageOrderEntry[];
      } catch {
        return { error: "No se pudo leer el orden de las imágenes. Recarga la página." };
      }
    }

    const product = await db.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        brand: brand || null,
        categoryId,
        isFeatured: formData.get("isFeatured") === "true",
        isActive: formData.get("isActive") === "true",
      },
    });

    // ── Variantes: actualizar las existentes, crear las nuevas, desactivar las quitadas ──
    const currentVariants = await db.productVariant.findMany({
      where: { productId, isActive: true },
      select: { id: true, name: true, value: true },
    });
    const seen = new Set<string>();

    for (const v of parsedVariants.variants) {
      const match = currentVariants.find(
        (c) => c.name === v.name && c.value === v.value && !seen.has(c.id)
      );
      if (match) {
        seen.add(match.id);
        await db.productVariant.update({
          where: { id: match.id },
          data: { price: v.price, stock: v.stock },
        });
      } else {
        await db.productVariant.create({ data: { productId, ...v } });
      }
    }

    // Las variantes eliminadas se desactivan (no se borran) para no romper
    // los pedidos históricos que las referencian.
    const removed = currentVariants.filter((c) => !seen.has(c.id));
    if (removed.length) {
      await db.productVariant.updateMany({
        where: { id: { in: removed.map((r) => r.id) } },
        data: { isActive: false },
      });
    }

    // ── Imágenes: aplicar orden final, eliminar las quitadas y subir las nuevas ──
    if (orderRaw !== null) {
      const current = await db.productImage.findMany({ where: { productId } });
      const keptIds = new Set(order.filter((o) => o.t === "e").map((o) => o.id));
      const toDelete = current.filter((img) => !keptIds.has(img.id));

      try {
        uploaded = await uploadAll(parsedImages.files, product.slug);
      } catch (error) {
        await rollbackUploads(uploaded);
        console.error("Cloudinary upload failed", error);
        return { error: "No se pudieron subir las imágenes nuevas. Los demás cambios sí se guardaron." };
      }

      if (toDelete.length) {
        await db.productImage.deleteMany({ where: { id: { in: toDelete.map((i) => i.id) } } });
        await Promise.allSettled(toDelete.map((img) => deleteProductImage(img.publicId)));
      }

      for (let i = 0; i < order.length; i++) {
        const entry = order[i];
        if (entry.t === "e") {
          if (!keptIds.has(entry.id)) continue;
          await db.productImage.update({
            where: { id: entry.id },
            data: { sortOrder: i, isPrimary: i === 0 },
          });
        } else {
          const u = uploaded[entry.i];
          if (u) {
            await db.productImage.create({
              data: { productId, url: u.url, publicId: u.publicId, isPrimary: i === 0, sortOrder: i },
            });
          }
        }
      }
    }

    revalidatePath("/admin/products");
    revalidatePath("/productos");
    revalidatePath(`/productos/${product.slug}`);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    await rollbackUploads(uploaded);
    return { error: readableError(error, "No se pudo actualizar el producto. Inténtalo de nuevo.") };
  }
}

export async function deleteProduct(productId: string): Promise<ActionResult> {
  try {
    await requireAdmin();

    // Un producto que ya se vendió no se puede borrar sin romper el historial
    // de pedidos: en ese caso se desactiva para que salga del catálogo.
    const ordered = await db.orderItem.count({ where: { productId } });
    if (ordered > 0) {
      await db.product.update({ where: { id: productId }, data: { isActive: false } });
      revalidatePath("/admin/products");
      revalidatePath("/productos");
      return {
        error:
          "Este producto tiene pedidos asociados, así que no se puede eliminar. Se desactivó y ya no aparece en la tienda.",
      };
    }

    const images = await db.productImage.findMany({ where: { productId } });
    await db.product.delete({ where: { id: productId } });
    await Promise.allSettled(images.map((img) => deleteProductImage(img.publicId)));

    revalidatePath("/admin/products");
    revalidatePath("/productos");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: readableError(error, "No se pudo eliminar el producto.") };
  }
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function createCategory(data: {
  name: string;
  description?: string;
  parentId?: string;
}): Promise<ActionResult> {
  try {
    await requireAdmin();

    const name = data.name.trim();
    if (!name) return { error: "El nombre de la categoría es obligatorio." };
    if (!slugify(name)) return { error: "El nombre debe incluir al menos una letra o número." };

    const slug = await uniqueSlug(
      name,
      async (candidate) => !!(await db.category.findUnique({ where: { slug: candidate }, select: { id: true } })),
      "categoria"
    );

    await db.category.create({
      data: {
        name,
        slug,
        description: data.description?.trim() || null,
        parentId: data.parentId || null,
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/productos");
    return { success: true };
  } catch (error) {
    return { error: readableError(error, "No se pudo crear la categoría.") };
  }
}

export async function updateCategory(
  categoryId: string,
  data: { name: string; description?: string; parentId?: string }
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const name = data.name.trim();
    if (!name) return { error: "El nombre de la categoría es obligatorio." };
    if (!slugify(name)) return { error: "El nombre debe incluir al menos una letra o número." };
    if (data.parentId && data.parentId === categoryId)
      return { error: "Una categoría no puede ser su propia categoría padre." };

    const slug = await uniqueSlug(
      name,
      async (candidate) => {
        const found = await db.category.findUnique({ where: { slug: candidate }, select: { id: true } });
        return !!found && found.id !== categoryId;
      },
      "categoria"
    );

    await db.category.update({
      where: { id: categoryId },
      data: {
        name,
        slug,
        description: data.description?.trim() || null,
        parentId: data.parentId || null,
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/productos");
    return { success: true };
  } catch (error) {
    return { error: readableError(error, "No se pudo actualizar la categoría.") };
  }
}

export async function deleteCategory(categoryId: string): Promise<ActionResult> {
  try {
    await requireAdmin();

    const [products, children] = await Promise.all([
      db.product.count({ where: { categoryId } }),
      db.category.count({ where: { parentId: categoryId } }),
    ]);

    if (products > 0)
      return {
        error: `No se puede eliminar: la categoría tiene ${products} producto(s). Muévelos a otra categoría primero.`,
      };
    if (children > 0)
      return {
        error: `No se puede eliminar: la categoría tiene ${children} subcategoría(s). Elimínalas primero.`,
      };

    await db.category.delete({ where: { id: categoryId } });
    revalidatePath("/admin/categories");
    revalidatePath("/productos");
    return { success: true };
  } catch (error) {
    return { error: readableError(error, "No se pudo eliminar la categoría.") };
  }
}

// ─── Shipping ────────────────────────────────────────────────────────────────

export async function saveShippingZone(data: {
  id?: string;
  name: string;
  states: string[];
  cost: number;
  freeThreshold?: number;
}): Promise<ActionResult> {
  try {
    await requireAdmin();

    const name = data.name.trim();
    if (!name) return { error: "El nombre de la zona es obligatorio." };
    if (!Number.isFinite(data.cost) || data.cost < 0)
      return { error: "El costo de envío debe ser un número igual o mayor a 0." };
    if (data.freeThreshold !== undefined && (!Number.isFinite(data.freeThreshold) || data.freeThreshold < 0))
      return { error: "El monto para envío gratis debe ser un número válido." };

    const payload = {
      name,
      states: data.states,
      cost: data.cost,
      freeThreshold: data.freeThreshold ?? null,
    };

    if (data.id) {
      await db.shippingZone.update({ where: { id: data.id }, data: payload });
    } else {
      await db.shippingZone.create({ data: payload });
    }

    revalidatePath("/admin/shipping");
    revalidatePath("/pagar");
    return { success: true };
  } catch (error) {
    return { error: readableError(error, "No se pudo guardar la zona de envío.") };
  }
}

export async function deleteShippingZone(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db.shippingZone.delete({ where: { id } });
    revalidatePath("/admin/shipping");
    revalidatePath("/pagar");
    return { success: true };
  } catch (error) {
    return { error: readableError(error, "No se pudo eliminar la zona de envío.") };
  }
}
