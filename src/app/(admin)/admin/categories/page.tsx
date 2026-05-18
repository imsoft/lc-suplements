import Link from "next/link";
import { db } from "@/lib/db";
import { AdminCategoryActions } from "@/components/admin/admin-category-actions";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Categorías | LC Admin" };

export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({
    include: { _count: { select: { products: true } }, parent: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Categorías</h1>
        <Button asChild>
          <Link href="/admin/categories/new">+ Nueva categoría</Link>
        </Button>
      </div>

      <div className="rounded border border-border overflow-x-auto">
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
  );
}
