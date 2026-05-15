"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";

export function AdminProductActions({
  productId,
  productSlug,
}: {
  productId: string;
  productSlug: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    startTransition(async () => {
      await deleteProduct(productId);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" asChild>
        <Link href={`/admin/products/${productSlug}`}>Editar</Link>
      </Button>
      <Button variant="ghost" size="sm" disabled={isPending} onClick={handleDelete} className="text-destructive hover:text-destructive">
        {isPending ? "..." : "Eliminar"}
      </Button>
    </div>
  );
}
