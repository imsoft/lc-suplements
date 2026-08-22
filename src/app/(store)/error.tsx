"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function StoreError({
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
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-3 text-2xl font-bold tracking-tight">Algo salió mal</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        No pudimos cargar esta sección. Vuelve a intentarlo en unos segundos.
      </p>
      {error.digest && (
        <p className="mb-6 font-mono text-xs text-muted-foreground">
          Código de referencia: {error.digest}
        </p>
      )}
      <div className="flex gap-3">
        <Button onClick={() => unstable_retry()}>Reintentar</Button>
        <Button variant="outline" asChild>
          <Link href="/">Ir al inicio</Link>
        </Button>
      </div>
    </div>
  );
}
