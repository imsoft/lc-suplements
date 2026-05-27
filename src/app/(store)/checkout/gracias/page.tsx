import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "¡Gracias por tu compra! | LC Suplements" };

export default function GraciasPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-24 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-4xl">
        🎉
      </div>
      <h1 className="mb-3 text-4xl font-black uppercase tracking-tight">
        ¡Gracias por tu compra!
      </h1>
      <p className="mb-2 max-w-md text-muted-foreground">
        Tu pago fue procesado correctamente. En breve recibirás un correo con los
        detalles de tu pedido y la información de envío.
      </p>
      <p className="mb-8 text-sm text-muted-foreground">
        ¿Tienes dudas? Escríbenos por WhatsApp al{" "}
        <a
          href="https://wa.me/523339494924"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary hover:underline"
        >
          33 3949 4924
        </a>
      </p>
      <Button asChild>
        <Link href="/products">Seguir comprando</Link>
      </Button>
    </div>
  );
}
