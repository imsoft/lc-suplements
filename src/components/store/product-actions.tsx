"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { FavouriteIcon, ShoppingCart02Icon } from "@hugeicons/core-free-icons";
import { addToCart } from "@/lib/actions/cart";
import { toggleWishlist } from "@/lib/actions/wishlist";

interface Variant {
  id: string;
  name: string;
  value: string;
  price: number | string;
  comparePrice?: number | string | null;
  stock: number;
}

interface ProductActionsProps {
  product: { id: string; name: string };
  variants: Variant[];
  userId: string | null;
  isInWishlist: boolean;
}

export function ProductActions({
  product,
  variants,
  userId,
  isInWishlist: initialWishlist,
}: ProductActionsProps) {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [wishlistActive, setWishlistActive] = useState(initialWishlist);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const price = Number(selectedVariant?.price ?? 0);
  const comparePrice = selectedVariant?.comparePrice
    ? Number(selectedVariant.comparePrice)
    : null;
  const inStock = (selectedVariant?.stock ?? 0) > 0;

  function handleAddToCart() {
    startTransition(async () => {
      const result = await addToCart({
        productId: product.id,
        variantId: selectedVariant.id,
        quantity,
      });
      setMessage(result.error ?? "¡Agregado al carrito!");
      setTimeout(() => setMessage(""), 3000);
    });
  }

  function handleWishlist() {
    if (!userId) {
      router.push("/auth/login");
      return;
    }
    startTransition(async () => {
      await toggleWishlist({ productId: product.id });
      setWishlistActive((prev) => !prev);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold">
          ${price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
        </span>
        {comparePrice && comparePrice > price && (
          <span className="text-lg text-muted-foreground line-through">
            $
            {comparePrice.toLocaleString("es-MX", {
              minimumFractionDigits: 2,
            })}
          </span>
        )}
      </div>

      {/* Variants */}
      {variants.length > 1 && (
        <div>
          <p className="mb-2 text-sm font-medium">
            {variants[0]?.name}:{" "}
            <span className="text-primary">{selectedVariant?.value}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                disabled={v.stock === 0}
                className={`rounded border px-3 py-1.5 text-sm font-medium transition-colors ${
                  selectedVariant?.id === v.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : v.stock === 0
                      ? "cursor-not-allowed border-border text-muted-foreground opacity-50"
                      : "border-border hover:border-primary"
                }`}
              >
                {v.value}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stock */}
      <p
        className={`text-sm font-medium ${inStock ? "text-green-600" : "text-destructive"}`}
      >
        {inStock
          ? `En stock (${selectedVariant?.stock} disponibles)`
          : "Agotado"}
      </p>

      {/* Quantity */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Cantidad:</span>
        <div className="flex items-center rounded border border-border">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-1 text-lg hover:bg-accent"
          >
            −
          </button>
          <span className="w-10 text-center text-sm">{quantity}</span>
          <button
            onClick={() =>
              setQuantity((q) => Math.min(selectedVariant?.stock ?? 1, q + 1))
            }
            className="px-3 py-1 text-lg hover:bg-accent"
          >
            +
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          className="flex-1"
          disabled={!inStock || isPending}
          onClick={handleAddToCart}
        >
          <HugeiconsIcon icon={ShoppingCart02Icon} size={18} className="mr-2" />
          {inStock ? "Agregar al carrito" : "Agotado"}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handleWishlist}
          disabled={isPending}
        >
          <HugeiconsIcon
            icon={FavouriteIcon}
            size={18}
            className={wishlistActive ? "fill-primary text-primary" : ""}
          />
        </Button>
      </div>

      {message && (
        <p className="rounded bg-primary/10 px-3 py-2 text-sm text-primary">
          {message}
        </p>
      )}
    </div>
  );
}
