"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteCategory } from "@/lib/actions/admin";

export function AdminCategoryActions({ categoryId }: { categoryId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("¿Eliminar esta categoría?")) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteCategory(categoryId);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-1">
      {error && (
        <p role="alert" className="max-w-xs text-xs text-destructive">{error}</p>
      )}
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
    </div>
  );
}
