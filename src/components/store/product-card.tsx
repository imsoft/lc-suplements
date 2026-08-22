"use client";

// CldImage (next-cloudinary) usa hooks internamente, así que esta tarjeta
// no puede ser Server Component: el catálogo devolvía 500 en cuanto un
// producto de la lista tenía imagen.
import Link from "next/link";
import { CldImage } from "next-cloudinary";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    brand: string | null;
    images: { url: string; alt: string | null; publicId: string }[];
    variants: { price: number | string }[];
    reviews: { rating: number }[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const price = product.variants[0]?.price;
  const image = product.images[0];
  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) /
        product.reviews.length
      : null;

  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded border border-border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {image ? (
          <CldImage
            src={image.publicId}
            alt={image.alt ?? product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            crop="fill"
            gravity="auto"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
            Sin imagen
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        {product.brand && (
          <span className="mb-1 text-xs font-medium uppercase tracking-wider text-primary">
            {product.brand}
          </span>
        )}
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
          {product.name}
        </h3>

        {avgRating !== null && (
          <div className="mt-1 flex items-center gap-1">
            <svg
              viewBox="0 0 24 24"
              className="h-3 w-3 fill-primary text-primary"
              aria-hidden="true"
            >
              <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.3l6.5-.9L12 2.5z" />
            </svg>
            <span className="text-xs text-muted-foreground">
              {avgRating.toFixed(1)} ({product.reviews.length})
            </span>
          </div>
        )}

        <div className="mt-auto pt-3">
          {price !== undefined ? (
            <span className="text-base font-bold text-foreground">
              $
              {Number(price).toLocaleString("es-MX", {
                minimumFractionDigits: 2,
              })}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">Sin precio</span>
          )}
        </div>
      </div>
    </Link>
  );
}
