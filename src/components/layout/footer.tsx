import Link from "next/link";
import { SiteLogo } from "@/components/brand/site-logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <SiteLogo variant="horizontal" tone="dark" className="h-10 max-w-[200px]" />
            <p className="mt-3 text-sm text-muted-foreground">
              Tu tienda de confianza para suplementos alimenticios, proteínas,
              creatinas y vitaminas de la más alta calidad.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
              Productos
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/products?category=proteinas" className="hover:text-primary">Proteínas</Link></li>
              <li><Link href="/products?category=creatinas" className="hover:text-primary">Creatinas</Link></li>
              <li><Link href="/products?category=vitaminas" className="hover:text-primary">Vitaminas</Link></li>
              <li><Link href="/products?category=pre-workout" className="hover:text-primary">Pre-Workout</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
              Mi cuenta
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/account" className="hover:text-primary">Perfil</Link></li>
              <li><Link href="/orders" className="hover:text-primary">Mis pedidos</Link></li>
              <li><Link href="/wishlist" className="hover:text-primary">Favoritos</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
              Empresa
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/nosotros" className="hover:text-primary">Nosotros</Link></li>
              <li><Link href="/contacto" className="hover:text-primary">Contacto</Link></li>
              <li><Link href="/faq" className="hover:text-primary">Preguntas frecuentes</Link></li>
              <li><Link href="/terminos" className="hover:text-primary">Términos y condiciones</Link></li>
              <li><Link href="/aviso-privacidad" className="hover:text-primary">Aviso de privacidad</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} LC Suplements. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
