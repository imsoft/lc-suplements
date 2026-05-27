"use client";

import Link from "next/link";
import { signOut } from "@/lib/auth-client";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingCart02Icon,
  FavouriteIcon,
  UserCircleIcon,
  Menu01Icon,
  Search01Icon,
  Cancel01Icon,
  Logout03Icon,
  UserAccountIcon,
  DeliveryBox01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SiteLogo } from "@/components/brand/site-logo";

const NAV_LINKS = [
  { href: "/productos", label: "Productos" },
  { href: "/productos?category=proteinas", label: "Proteínas" },
  { href: "/productos?category=creatinas", label: "Creatinas" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/faq", label: "FAQ" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const session = useAuthStore((s) => s.session);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Cierra el dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/productos?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setSearchQuery("");
  }

  function handleSignOut() {
    setUserMenuOpen(false);
    signOut({ fetchOptions: { onSuccess: () => router.push("/") } });
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
        <SiteLogo variant="horizontal" tone="adaptive" priority />

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
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
            <HugeiconsIcon icon={Search01Icon} size={20} />
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <Link href="/favoritos">
              <HugeiconsIcon icon={FavouriteIcon} size={20} />
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <Link href="/carrito">
              <HugeiconsIcon icon={ShoppingCart02Icon} size={20} />
            </Link>
          </Button>

          {/* User menu desktop */}
          {session ? (
            <div className="relative hidden md:block" ref={userMenuRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setUserMenuOpen((v) => !v)}
                className={userMenuOpen ? "text-primary" : ""}
              >
                <HugeiconsIcon icon={UserCircleIcon} size={20} />
              </Button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 border border-border bg-background shadow-lg">
                  {/* User info */}
                  <div className="border-b border-border px-4 py-3">
                    <p className="text-sm font-bold truncate">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                  </div>

                  {/* Links */}
                  <nav className="py-1">
                    <Link
                      href="/cuenta"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary hover:text-secondary-foreground"
                    >
                      <HugeiconsIcon icon={UserAccountIcon} size={16} className="text-muted-foreground" />
                      Mi cuenta
                    </Link>
                    <Link
                      href="/pedidos"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary hover:text-secondary-foreground"
                    >
                      <HugeiconsIcon icon={DeliveryBox01Icon} size={16} className="text-muted-foreground" />
                      Mis pedidos
                    </Link>
                    {session.user.role === "ADMIN" && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-secondary"
                      >
                        <HugeiconsIcon icon={Settings01Icon} size={16} />
                        Panel admin
                      </Link>
                    )}
                  </nav>

                  {/* Sign out */}
                  <div className="border-t border-border py-1">
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <HugeiconsIcon icon={Logout03Icon} size={16} />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/autenticacion/iniciar-sesion">Iniciar sesión</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/autenticacion/registro">Registrarse</Link>
              </Button>
            </div>
          )}

          {/* Hamburger */}
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
            <div className="mt-2 flex flex-col gap-1 border-t border-border pt-3">
              {session ? (
                <>
                  <div className="mb-2 px-1">
                    <p className="text-sm font-bold">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground">{session.user.email}</p>
                  </div>
                  <Link
                    href="/cuenta"
                    className="flex items-center gap-2 py-2 text-sm font-medium hover:text-primary"
                    onClick={() => setMobileOpen(false)}
                  >
                    <HugeiconsIcon icon={UserAccountIcon} size={16} />
                    Mi cuenta
                  </Link>
                  <Link
                    href="/pedidos"
                    className="flex items-center gap-2 py-2 text-sm font-medium hover:text-primary"
                    onClick={() => setMobileOpen(false)}
                  >
                    <HugeiconsIcon icon={DeliveryBox01Icon} size={16} />
                    Mis pedidos
                  </Link>
                  {session.user.role === "ADMIN" && (
                    <Link
                      href="/admin/dashboard"
                      className="flex items-center gap-2 py-2 text-sm font-medium text-primary"
                      onClick={() => setMobileOpen(false)}
                    >
                      <HugeiconsIcon icon={Settings01Icon} size={16} />
                      Panel admin
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 py-2 text-left text-sm font-medium text-destructive"
                  >
                    <HugeiconsIcon icon={Logout03Icon} size={16} />
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/autenticacion/iniciar-sesion"
                    className="py-2 text-sm font-medium hover:text-primary"
                    onClick={() => setMobileOpen(false)}
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/autenticacion/registro"
                    className="py-2 text-sm font-medium text-primary"
                    onClick={() => setMobileOpen(false)}
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
