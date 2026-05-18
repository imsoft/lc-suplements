import { db } from "@/lib/db";
import { CreateCategoryForm } from "@/components/admin/create-category-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Nueva categoría | LC Admin" };

export default async function NewCategoryPage() {
  const categories = await db.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Nueva categoría</h1>
      <div className="max-w-lg">
        <CreateCategoryForm categories={categories} />
      </div>
    </div>
  );
}
