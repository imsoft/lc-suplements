"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteShippingZone } from "@/lib/actions/admin";

export function AdminShippingActions({ zoneId }: { zoneId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("¿Eliminar esta zona de envío?")) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteShippingZone(zoneId);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-3">
        <Link
          href={`/admin/shipping/${zoneId}/edit`}
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
      {error && (
        <p role="alert" className="max-w-xs text-right text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
