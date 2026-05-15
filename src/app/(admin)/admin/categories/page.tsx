import { db } from "@/lib/db";
import { AdminCategoryActions } from "@/components/admin/admin-category-actions";
import { CreateCategoryForm } from "@/components/admin/create-category-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Categorías | LC Admin" };

export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({
    include: { _count: { select: { products: true } }, parent: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h1 className="mb-6 text-2xl font-bold tracking-tight">Categorías</h1>
        <div className="rounded border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nombre</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Padre</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Productos</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{cat.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{cat.parent?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{cat._count.products}</td>
                  <td className="px-4 py-3">
                    <AdminCategoryActions categoryId={cat.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="mb-6 text-lg font-semibold">Nueva categoría</h2>
        <CreateCategoryForm categories={categories} />
      </div>
    </div>
  );
}
