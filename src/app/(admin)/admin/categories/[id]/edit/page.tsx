import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { EditCategoryForm } from "@/components/admin/edit-category-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Editar categoría | LC Admin" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;

  const [category, allCategories] = await Promise.all([
    db.category.findUnique({ where: { id } }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!category) notFound();

  // Exclude the category itself from the parent options to avoid cycles
  const parentOptions = allCategories.filter((c) => c.id !== id);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Editar categoría</h1>
      <div className="max-w-lg">
        <EditCategoryForm category={category} categories={parentOptions} />
      </div>
    </div>
  );
}
