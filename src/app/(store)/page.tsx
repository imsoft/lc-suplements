import Link from "next/link";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { AnimateIn } from "@/components/ui/animate-in";
import { CountUp } from "@/components/ui/count-up";
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
      <section className="relative flex min-h-screen items-center overflow-hidden bg-secondary">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute right-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-primary/20 blur-[140px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[80px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700 mb-6 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.4em] text-primary">
              <span className="inline-block h-px w-10 bg-primary" />
              Suplementos de élite
            </p>
            <h1 className="animate-in fade-in slide-in-from-bottom-8 fill-mode-both delay-150 duration-700 text-7xl font-black uppercase leading-none tracking-tight text-white sm:text-9xl">
              LLEVA TU
              <br />
              <span className="text-primary">RENDI-</span>
              <br />
              MIENTO
              <br />
              AL LÍMITE
            </h1>
            <p className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both delay-300 duration-700 mt-10 max-w-lg text-lg leading-relaxed text-white/60">
              Proteínas, creatinas, vitaminas y suplementos de la más alta
              calidad. Envíos a todo México. Sin excusas.
            </p>
            <div className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both delay-500 duration-700 mt-12 flex flex-wrap gap-4">
              <Button
                size="lg"
                className="px-10 py-6 text-base font-bold uppercase tracking-widest"
                asChild
              >
                <Link href="/products">Ver catálogo</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 px-10 py-6 text-base font-bold uppercase tracking-widest text-white hover:bg-white/10"
                asChild
              >
                <Link href="/nosotros">Nuestra historia</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />
      </section>

      {/* Stats */}
      <section className="border-y border-border py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { end: 500, prefix: "+", suffix: "", label: "Productos" },
              { end: 10, prefix: "+", suffix: "K", label: "Clientes" },
              { end: 100, prefix: "", suffix: "%", label: "Originales" },
              { end: 48, prefix: "", suffix: "h", label: "Entrega" },
            ].map((stat, i) => (
              <AnimateIn key={stat.label} className="text-center" delay={i * 100}>
                <CountUp
                  end={stat.end}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  className="text-4xl font-black text-primary"
                />
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
                  {stat.label}
                </p>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <AnimateIn className="mb-12">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Explora
            </p>
            <h2 className="text-5xl font-black uppercase tracking-tight">
              Categorías
            </h2>
          </AnimateIn>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat, i) => (
              <AnimateIn key={cat.id} delay={i * 80}>
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="group flex h-full flex-col items-center justify-center bg-secondary p-10 text-center transition-colors hover:bg-primary"
                >
                  <span className="text-sm font-bold uppercase tracking-wider text-secondary-foreground transition-colors group-hover:text-primary-foreground">
                    {cat.name}
                  </span>
                </Link>
              </AnimateIn>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="bg-secondary/5 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimateIn className="mb-12 flex items-end justify-between">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-primary">
                  Lo mejor
                </p>
                <h2 className="text-5xl font-black uppercase tracking-tight">
                  Destacados
                </h2>
              </div>
              <Link
                href="/products"
                className="text-sm font-bold uppercase tracking-wider text-primary hover:underline"
              >
                Ver todos →
              </Link>
            </AnimateIn>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {featuredProducts.map((product, i) => (
                <AnimateIn key={product.id} delay={i * 60}>
                  <ProductCard
                    product={{
                      ...product,
                      variants: product.variants.map((v) => ({
                        price: Number(v.price),
                      })),
                    }}
                  />
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why us */}
      <section className="bg-secondary py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn className="mb-16 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              ¿Por qué elegirnos?
            </p>
            <h2 className="text-5xl font-black uppercase tracking-tight text-secondary-foreground">
              Sin compromisos
            </h2>
          </AnimateIn>
          <div className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "🚚",
                title: "Envíos a todo México",
                desc: "Recibe tus productos en la puerta de tu casa en 24-48 horas.",
              },
              {
                icon: "✅",
                title: "100% Originales",
                desc: "Solo marcas certificadas, sin falsificaciones ni productos adulterados.",
              },
              {
                icon: "🔒",
                title: "Pago seguro",
                desc: "Tarjeta, OXXO o transferencia vía MercadoPago, siempre protegido.",
              },
              {
                icon: "💬",
                title: "Asesoría experta",
                desc: "Nuestros especialistas te ayudan a encontrar el suplemento ideal.",
              },
            ].map((prop, i) => (
              <AnimateIn key={prop.title} delay={i * 100} className="bg-secondary">
                <div className="p-8 text-secondary-foreground h-full">
                  <p className="mb-4 text-4xl">{prop.icon}</p>
                  <h3 className="mb-3 font-bold uppercase tracking-wider text-primary">
                    {prop.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/60">
                    {prop.desc}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-32 text-center">
        <AnimateIn className="mx-auto max-w-3xl px-4">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.4em] text-primary">
            Empieza hoy
          </p>
          <h2 className="text-6xl font-black uppercase tracking-tight sm:text-7xl">
            ¿Listo para
            <br />
            <span className="text-primary">superarte?</span>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-lg text-muted-foreground">
            Encuentra el suplemento perfecto para alcanzar tus metas. Somos tu
            aliado en cada entrenamiento.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="px-12 py-6 text-base font-bold uppercase tracking-widest"
              asChild
            >
              <Link href="/products">Comprar ahora</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-12 py-6 text-base font-bold uppercase tracking-widest"
              asChild
            >
              <Link href="/contacto">Contactarnos</Link>
            </Button>
          </div>
        </AnimateIn>
      </section>
    </div>
  );
}
