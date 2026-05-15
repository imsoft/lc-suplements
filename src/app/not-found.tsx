import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página no encontrada | LC Suplements",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-7xl font-bold text-primary">404</p>
      <h1 className="text-2xl font-bold tracking-tight">Página no encontrada</h1>
      <p className="max-w-sm text-muted-foreground">
        La página que buscas no existe o fue movida.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/">Ir al inicio</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/products">Ver productos</Link>
        </Button>
      </div>
    </div>
  );
}
