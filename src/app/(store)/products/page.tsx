import { db } from "@/lib/db";
import { ProductCard } from "@/components/store/product-card";
import { ProductFilters } from "@/components/store/product-filters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Productos | LC Suplements",
  description: "Catálogo completo de suplementos alimenticios, proteínas, creatinas y vitaminas.",
};

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    q?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  const categories = await db.category.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" },
  });

  const where = {
    isActive: true,
    ...(params.category && {
      category: { slug: params.category },
    }),
    ...(params.brand && { brand: params.brand }),
    ...(params.q && {
      OR: [
        { name: { contains: params.q, mode: "insensitive" as const } },
        { description: { contains: params.q, mode: "insensitive" as const } },
        { brand: { contains: params.q, mode: "insensitive" as const } },
      ],
    }),
  };

  const orderBy: { createdAt?: "asc" | "desc"; isFeatured?: "asc" | "desc" } = (() => {
    switch (params.sort) {
      case "price-asc":
      case "price-desc":
        return { createdAt: "desc" as const };
      case "newest":
        return { createdAt: "desc" as const };
      default:
        return { isFeatured: "desc" as const };
    }
  })();

  const products = await db.product.findMany({
    where,
    orderBy,
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      variants: { where: { isActive: true }, orderBy: { price: "asc" }, take: 1 },
      category: true,
      reviews: { select: { rating: true } },
    },
  });

  const brands = await db.product.findMany({
    where: { isActive: true, brand: { not: null } },
    select: { brand: true },
    distinct: ["brand"],
    orderBy: { brand: "asc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          {params.q ? `Resultados para "${params.q}"` : "Todos los productos"}
        </h1>
        <span className="text-sm text-muted-foreground">
          {products.length} producto{products.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <ProductFilters
          categories={categories}
          brands={brands.map((b) => b.brand!).filter(Boolean)}
          currentParams={params}
        />

        <div className="flex-1">
          {products.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded border border-dashed border-border">
              <p className="text-muted-foreground">
                No se encontraron productos con esos filtros.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    variants: product.variants.map((v) => ({ price: Number(v.price) })),
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
