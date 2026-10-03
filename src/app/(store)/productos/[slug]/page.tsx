import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ProductGallery } from "@/components/store/product-gallery";
import { ProductActions } from "@/components/store/product-actions";
import { ReviewSection } from "@/components/store/review-section";
import { ProductCard } from "@/components/store/product-card";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
    select: {
      name: true,
      description: true,
      brand: true,
      images: { where: { isPrimary: true }, take: 1 },
    },
  });
  if (!product) return {};

  const description = product.description.slice(0, 155);
  const image = product.images[0];

  return {
    title: product.name,
    description,
    openGraph: {
      title: `${product.name} | LC Suplements`,
      description,
      type: "website",
      ...(image && { images: [{ url: image.url, alt: product.name }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | LC Suplements`,
      description,
      ...(image && { images: [image.url] }),
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug, isActive: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: { where: { isActive: true }, orderBy: { price: "asc" } },
      category: true,
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) notFound();

  const relatedProducts = await db.product.findMany({
    where: { isActive: true, categoryId: product.categoryId, id: { not: product.id } },
    orderBy: { isFeatured: "desc" },
    take: 8,
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      variants: { where: { isActive: true }, orderBy: { price: "asc" }, take: 1 },
      reviews: { select: { rating: true } },
    },
  });

  const categoryHref = `/productos?category=${product.category.slug}`;

  const session = await auth.api.getSession({ headers: await headers() });

  const isInWishlist = session
    ? !!(await db.wishlistItem.findUnique({
        where: { userId_productId: { userId: session.user.id, productId: product.id } },
      }))
    : false;

  const userReview = session
    ? product.reviews.find((r) => r.userId === session.user.id) ?? null
    : null;

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
      : null;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://lcsuplements.com";
  const lowestPrice = product.variants[0]?.price ? Number(product.variants[0].price) : null;
  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: product.brand
      ? { "@type": "Brand", name: product.brand }
      : undefined,
    image: primaryImage?.url,
    url: `${appUrl}/productos/${product.slug}`,
    ...(lowestPrice !== null && {
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "MXN",
        lowPrice: lowestPrice,
        offerCount: product.variants.length,
        availability: "https://schema.org/InStock",
        seller: { "@type": "Organization", name: "LC Suplements" },
      },
    }),
    ...(product.reviews.length > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: (
          product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
        ).toFixed(1),
        reviewCount: product.reviews.length,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Navegación del catálogo" className="mb-6 flex flex-col gap-3">
        <Link
          href={categoryHref}
          className="inline-flex w-fit items-center gap-2 rounded border border-border px-3 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
        >
          <span aria-hidden="true">←</span>
          Volver a {product.category.name}
        </Link>
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link href="/productos" className="hover:text-primary hover:underline">
              Productos
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={categoryHref} className="hover:text-primary hover:underline">
              {product.category.name}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="line-clamp-1 text-foreground">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="flex flex-col gap-4">
          <div>
            <span className="text-sm font-medium uppercase tracking-wider text-primary">
              {product.brand ?? product.category.name}
            </span>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">{product.name}</h1>
          </div>

          {avgRating !== null && (
            <div className="flex items-center gap-2">
              <div className="flex text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < Math.round(avgRating) ? "text-primary" : "text-muted"}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {avgRating.toFixed(1)} ({product.reviews.length} reseñas)
              </span>
            </div>
          )}

          <p className="leading-relaxed text-muted-foreground">{product.description}</p>

          <ProductActions
            product={{ id: product.id, name: product.name }}
            variants={product.variants.map((v) => ({
              ...v,
              price: Number(v.price),
              comparePrice: v.comparePrice ? Number(v.comparePrice) : null,
            }))}
            userId={session?.user.id ?? null}
            isInWishlist={isInWishlist}
          />
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-12">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold tracking-tight">
              Más de {product.category.name}
            </h2>
            <Link href={categoryHref} className="shrink-0 text-sm text-primary hover:underline">
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {relatedProducts.map((related) => (
              <ProductCard
                key={related.id}
                product={{
                  ...related,
                  variants: related.variants.map((v) => ({ price: Number(v.price) })),
                }}
              />
            ))}
          </div>
        </section>
      )}

      <ReviewSection
        productId={product.id}
        reviews={product.reviews}
        userReview={userReview}
        userId={session?.user.id ?? null}
      />
    </div>
  );
}
