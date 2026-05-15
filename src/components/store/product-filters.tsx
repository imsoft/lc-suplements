"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFiltersProps {
  categories: Category[];
  brands: string[];
  currentParams: {
    category?: string;
    brand?: string;
    q?: string;
    sort?: string;
  };
}

const hasActiveFilter = (params: ProductFiltersProps["currentParams"]) =>
  !!(params.category || params.brand || params.sort);

export function ProductFilters({ categories, brands, currentParams }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function updateFilter(key: string, value: string | null) {
    const params = new URLSearchParams();
    if (currentParams.q) params.set("q", currentParams.q);
    if (currentParams.category && key !== "category")
      params.set("category", currentParams.category);
    if (currentParams.brand && key !== "brand")
      params.set("brand", currentParams.brand);
    if (currentParams.sort && key !== "sort")
      params.set("sort", currentParams.sort);
    if (value) params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  }

  const filterBody = (
    <>
      {/* Sort */}
      <div className="mb-6">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider">Ordenar</h3>
        <div className="space-y-1">
          {[
            { value: "", label: "Destacados" },
            { value: "newest", label: "Más nuevos" },
            { value: "price-asc", label: "Precio: menor a mayor" },
            { value: "price-desc", label: "Precio: mayor a menor" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateFilter("sort", opt.value || null)}
              className={cn(
                "block w-full rounded px-2 py-1.5 text-left text-sm transition-colors",
                currentParams.sort === opt.value || (!currentParams.sort && !opt.value)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider">Categorías</h3>
        <div className="space-y-1">
          <button
            onClick={() => updateFilter("category", null)}
            className={cn(
              "block w-full rounded px-2 py-1.5 text-left text-sm transition-colors",
              !currentParams.category
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent"
            )}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilter("category", cat.slug)}
              className={cn(
                "block w-full rounded px-2 py-1.5 text-left text-sm transition-colors",
                currentParams.category === cat.slug
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider">Marcas</h3>
          <div className="space-y-1">
            <button
              onClick={() => updateFilter("brand", null)}
              className={cn(
                "block w-full rounded px-2 py-1.5 text-left text-sm transition-colors",
                !currentParams.brand
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent"
              )}
            >
              Todas
            </button>
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => updateFilter("brand", brand)}
                className={cn(
                  "block w-full rounded px-2 py-1.5 text-left text-sm transition-colors",
                  currentParams.brand === brand
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent"
                )}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );

  return (
    <aside className="w-full shrink-0 lg:w-56">
      {/* Botón toggle — solo visible en móvil */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="mb-3 flex w-full items-center justify-between rounded border border-border px-3 py-2 text-sm font-medium lg:hidden"
      >
        <span>
          Filtros y orden
          {hasActiveFilter(currentParams) && (
            <span className="ml-2 inline-block h-2 w-2 rounded-full bg-primary" />
          )}
        </span>
        <span className="text-muted-foreground">{open ? "▲" : "▼"}</span>
      </button>

      {/* En móvil: colapsable. En desktop: siempre visible */}
      <div className={cn("lg:block", open ? "block" : "hidden")}>
        {filterBody}
      </div>
    </aside>
  );
}
