import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/store/product-card";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Favoritos | LC Suplements" };

export default async function WishlistPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth/login");

  const wishlist = await db.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          variants: { where: { isActive: true }, orderBy: { price: "asc" }, take: 1 },
          reviews: { select: { rating: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">
        Mis favoritos ({wishlist.length})
      </h1>

      {wishlist.length === 0 ? (
        <p className="text-muted-foreground">Aún no tienes productos favoritos.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {wishlist.map(({ product }) => (
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
  );
}
