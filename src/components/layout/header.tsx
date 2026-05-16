"use client";

import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingCart02Icon,
  FavouriteIcon,
  UserCircleIcon,
  Menu01Icon,
  Search01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const NAV_LINKS = [
  { href: "/products", label: "Productos" },
  { href: "/products?category=proteinas", label: "Proteínas" },
  { href: "/products?category=creatinas", label: "Creatinas" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/faq", label: "FAQ" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/products?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setSearchQuery("");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      {/* Search overlay */}
      {searchOpen && (
        <div className="absolute inset-x-0 top-0 z-10 border-b border-border bg-background px-4 py-3 shadow-md">
          <form onSubmit={handleSearch} className="mx-auto flex max-w-2xl items-center gap-2">
            <HugeiconsIcon icon={Search01Icon} size={18} className="shrink-0 text-muted-foreground" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos, marcas..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
              className="text-muted-foreground hover:text-foreground"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={18} />
            </button>
          </form>
        </div>
      )}

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-widest text-primary uppercase">
            LC Suplements
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
          >
            <HugeiconsIcon icon={Search01Icon} size={20} />
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <Link href="/wishlist">
              <HugeiconsIcon icon={FavouriteIcon} size={20} />
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <HugeiconsIcon icon={ShoppingCart02Icon} size={20} />
            </Link>
          </Button>

          {session ? (
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/account">
                  <HugeiconsIcon icon={UserCircleIcon} size={20} />
                </Link>
              </Button>
              {session.user.role === "ADMIN" && (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/dashboard">Admin</Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                Salir
              </Button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Iniciar sesión</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/register">Registrarse</Link>
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <HugeiconsIcon icon={Menu01Icon} size={20} />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              {session ? (
                <>
                  <Link href="/account" className="text-sm font-medium">
                    Mi cuenta
                  </Link>
                  {session.user.role === "ADMIN" && (
                    <Link href="/admin/dashboard" className="text-sm font-medium">
                      Panel Admin
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="text-left text-sm font-medium text-destructive"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="text-sm font-medium">
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/auth/register"
                    className="text-sm font-medium text-primary"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
