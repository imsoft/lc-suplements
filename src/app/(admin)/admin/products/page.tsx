import Link from "next/link";
import { db } from "@/lib/db";
import { AdminProductActions } from "@/components/admin/admin-product-actions";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Productos | LC Admin" };

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    include: {
      category: true,
      variants: { where: { isActive: true }, orderBy: { price: "asc" }, take: 1 },
      images: { where: { isPrimary: true }, take: 1 },
      _count: { select: { variants: true, reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Productos</h1>
        <Button asChild>
          <Link href="/admin/products/new">+ Nuevo producto</Link>
        </Button>
      </div>

      <div className="rounded border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Producto</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Categoría</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Precio desde</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Variantes</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Estado</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <p className="font-medium">{product.name}</p>
                  {product.brand && (
                    <p className="text-xs text-muted-foreground">{product.brand}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{product.category.name}</td>
                <td className="px-4 py-3 font-medium">
                  {product.variants[0]
                    ? `$${Number(product.variants[0].price).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`
                    : "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{product._count.variants}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium ${
                      product.isActive
                        ? "bg-green-500/10 text-green-700"
                        : "bg-red-500/10 text-red-700"
                    }`}
                  >
                    {product.isActive ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <AdminProductActions productId={product.id} productSlug={product.slug} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
