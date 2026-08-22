"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-3 text-2xl font-bold tracking-tight">
        Ocurrió un error en el panel
      </h1>
      <p className="mb-2 max-w-md text-sm text-muted-foreground">
        La operación no se completó. Vuelve a intentarlo; si el problema
        continúa, comparte el código de referencia con soporte.
      </p>
      {error.digest && (
        <p className="mb-6 font-mono text-xs text-muted-foreground">
          Código de referencia: {error.digest}
        </p>
      )}
      <div className="mt-4 flex gap-3">
        <Button onClick={() => unstable_retry()}>Reintentar</Button>
        <Button variant="outline" asChild>
          <Link href="/admin/dashboard">Volver al dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
