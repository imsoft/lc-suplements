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
  ArrowDown01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SiteLogo } from "@/components/brand/site-logo";

type Category = { id: string; name: string; slug: string };

interface HeaderProps {
  categories?: Category[];
}

export function Header({ categories = [] }: HeaderProps) {
  const session = useAuthStore((s) => s.session);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCatsOpen, setMobileCatsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setMobileCatsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

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

      {/* ── Top bar: logo / actions ── */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <SiteLogo variant="horizontal" tone="adaptive" priority />

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
                  <div className="border-b border-border px-4 py-3">
                    <p className="truncate text-sm font-bold">{session.user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{session.user.email}</p>
                  </div>
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
            <HugeiconsIcon icon={mobileOpen ? Cancel01Icon : Menu01Icon} size={20} />
          </Button>
        </div>
      </div>

      {/* ── Category bar — desktop only ── */}
      {categories.length > 0 && (
        <div className="hidden border-t border-border bg-secondary/40 md:block">
          <nav className="mx-auto flex max-w-7xl items-center gap-0 overflow-x-auto px-4 scrollbar-none sm:px-6 lg:px-8">
            {/* "Todos" shortcut */}
            <Link
              href="/productos"
              className="shrink-0 whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            >
              Todos
            </Link>
            <span className="h-4 w-px shrink-0 bg-border" />
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/productos?category=${cat.slug}`}
                className="shrink-0 whitespace-nowrap px-3 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="px-4 py-4">
            {/* Categories accordion */}
            {categories.length > 0 && (
              <div className="mb-3">
                <button
                  onClick={() => setMobileCatsOpen((v) => !v)}
                  className="flex w-full items-center justify-between py-2 text-sm font-semibold uppercase tracking-wide text-foreground"
                >
                  <span>Categorías</span>
                  <HugeiconsIcon
                    icon={mobileCatsOpen ? ArrowDown01Icon : ArrowRight01Icon}
                    size={16}
                    className="text-muted-foreground"
                  />
                </button>

                {mobileCatsOpen && (
                  <div className="mt-1 flex flex-col border-l-2 border-primary/30 pl-3">
                    <Link
                      href="/productos"
                      className="py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                      onClick={() => setMobileOpen(false)}
                    >
                      Todos los productos
                    </Link>
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/productos?category=${cat.slug}`}
                        className="py-2 text-sm text-muted-foreground hover:text-primary"
                        onClick={() => setMobileOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Other links */}
            <div className="flex flex-col border-t border-border pt-3">
              <Link
                href="/nosotros"
                className="py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                onClick={() => setMobileOpen(false)}
              >
                Nosotros
              </Link>
              <Link
                href="/faq"
                className="py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                onClick={() => setMobileOpen(false)}
              >
                FAQ
              </Link>
              <Link
                href="/contacto"
                className="py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                onClick={() => setMobileOpen(false)}
              >
                Contacto
              </Link>
            </div>

            {/* Auth section */}
            <div className="mt-3 flex flex-col gap-1 border-t border-border pt-3">
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
          </div>
        </div>
      )}
    </header>
  );
}
