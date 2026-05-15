"use client";

import { useTransition } from "react";
import { CldImage } from "next-cloudinary";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete01Icon } from "@hugeicons/core-free-icons";
import { updateCartItem, removeCartItem } from "@/lib/actions/cart";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    name: string;
    slug: string;
    images: { publicId: string; alt: string | null }[];
  };
  variant: {
    name: string;
    value: string;
    price: number | string;
    stock: number;
  };
}

export function CartItemRow({ item }: { item: CartItem }) {
  const [isPending, startTransition] = useTransition();
  const price = Number(item.variant.price);
  const image = item.product.images[0];

  function changeQty(newQty: number) {
    startTransition(async () => {
      await updateCartItem({ itemId: item.id, quantity: newQty });
    });
  }

  function remove() {
    startTransition(async () => {
      await removeCartItem(item.id);
    });
  }

  return (
    <div className={`flex gap-4 p-4 ${isPending ? "opacity-50" : ""}`}>
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded border border-border bg-muted">
        {image ? (
          <CldImage
            src={image.publicId}
            alt={image.alt ?? item.product.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <p className="text-sm font-semibold leading-tight">{item.product.name}</p>
        <p className="text-xs text-muted-foreground">
          {item.variant.name}: {item.variant.value}
        </p>
        <p className="text-sm font-bold">
          ${price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
        </p>
      </div>

      <div className="flex flex-col items-end justify-between gap-2">
        <button
          onClick={remove}
          disabled={isPending}
          className="text-destructive hover:text-destructive/80"
        >
          <HugeiconsIcon icon={Delete01Icon} size={18} />
        </button>

        <div className="flex items-center rounded border border-border text-sm">
          <button
            onClick={() => changeQty(item.quantity - 1)}
            disabled={isPending}
            className="px-2 py-1 hover:bg-accent"
          >
            −
          </button>
          <span className="w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => changeQty(item.quantity + 1)}
            disabled={isPending || item.quantity >= item.variant.stock}
            className="px-2 py-1 hover:bg-accent"
          >
            +
          </button>
        </div>

        <p className="text-sm font-semibold">
          $
          {(price * item.quantity).toLocaleString("es-MX", {
            minimumFractionDigits: 2,
          })}
        </p>
      </div>
    </div>
  );
}
