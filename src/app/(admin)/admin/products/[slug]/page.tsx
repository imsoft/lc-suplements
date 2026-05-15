import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/product-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Editar producto | LC Admin" };

interface EditProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { slug } = await params;
  const [product, categories] = await Promise.all([
    db.product.findUnique({
      where: { slug },
      include: {
        variants: { where: { isActive: true } },
        images: { orderBy: { sortOrder: "asc" } },
      },
    }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  const serializedProduct = {
    ...product,
    variants: product.variants.map((v) => ({
      ...v,
      price: Number(v.price),
      comparePrice: v.comparePrice ? Number(v.comparePrice) : null,
    })),
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Editar: {product.name}</h1>
      <ProductForm categories={categories} product={serializedProduct} />
    </div>
  );
}
