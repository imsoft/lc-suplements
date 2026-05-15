import Link from "next/link";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LC Suplements | Suplementos de alta calidad",
  description:
    "Proteínas, creatinas, vitaminas y suplementos alimenticios de la más alta calidad. Envíos a todo México.",
};

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    db.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: 8,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        variants: { where: { isActive: true }, orderBy: { price: "asc" }, take: 1 },
        reviews: { select: { rating: true } },
      },
    }),
    db.category.findMany({
      where: { parentId: null },
      take: 6,
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-secondary px-4 text-center">
        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Suplementos de élite
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Lleva tu rendimiento
            <br />
            <span className="text-primary">al siguiente nivel</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Proteínas, creatinas, vitaminas y suplementos de la más alta calidad.
            Envíos a todo México.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/products">Ver catálogo</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/products?sort=newest">Nuevos productos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold tracking-tight">Categorías</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="flex flex-col items-center justify-center rounded border border-border bg-card p-6 text-center transition-shadow hover:border-primary hover:shadow-md"
              >
                <span className="text-sm font-semibold">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Productos destacados</h2>
            <Link href="/products" className="text-sm text-primary hover:underline">
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  variants: product.variants.map((v) => ({ price: Number(v.price) })),
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Value props */}
      <section className="border-t border-border bg-secondary px-4 py-12">
        <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3">
          {[
            { title: "Envíos a todo México", desc: "Recibe tus productos en la puerta de tu casa." },
            { title: "Productos originales", desc: "Solo marcas certificadas y de la más alta calidad." },
            { title: "Pago seguro", desc: "Paga con tarjeta, OXXO o transferencia vía MercadoPago." },
          ].map((prop) => (
            <div key={prop.title} className="text-center">
              <h3 className="font-bold text-primary">{prop.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{prop.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
