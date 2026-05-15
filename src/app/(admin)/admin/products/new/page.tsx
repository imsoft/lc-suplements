import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/product-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Nuevo producto | LC Admin" };

export default async function NewProductPage() {
  const categories = await db.category.findMany({ orderBy: { name: "asc" } });
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Nuevo producto</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
