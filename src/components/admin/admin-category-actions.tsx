"use client";

import { useTransition } from "react";
import { deleteCategory } from "@/lib/actions/admin";

export function AdminCategoryActions({ categoryId }: { categoryId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("¿Eliminar esta categoría?")) return;
    startTransition(async () => { await deleteCategory(categoryId); });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-xs text-destructive hover:underline disabled:opacity-50"
    >
      {isPending ? "Eliminando..." : "Eliminar"}
    </button>
  );
}
