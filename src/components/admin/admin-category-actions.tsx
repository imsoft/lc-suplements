"use client";

import Link from "next/link";
import { useTransition } from "react";
import { deleteCategory } from "@/lib/actions/admin";

export function AdminCategoryActions({ categoryId }: { categoryId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("¿Eliminar esta categoría?")) return;
    startTransition(async () => {
      await deleteCategory(categoryId);
    });
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href={`/admin/categories/${categoryId}/edit`}
        className="text-xs font-medium text-primary hover:underline"
      >
        Editar
      </Link>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="text-xs text-destructive hover:underline disabled:opacity-50"
      >
        {isPending ? "Eliminando..." : "Eliminar"}
      </button>
    </div>
  );
}
