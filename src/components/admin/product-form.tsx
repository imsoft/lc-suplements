"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createProduct, updateProduct } from "@/lib/actions/admin";

interface Category {
  id: string;
  name: string;
}

interface Variant {
  id?: string;
  name: string;
  value: string;
  price: number | string;
  stock: number;
}

interface ProductFormProps {
  categories: Category[];
  product?: {
    id: string;
    name: string;
    description: string;
    brand: string | null;
    categoryId: string;
    isFeatured: boolean;
    isActive: boolean;
    variants: Variant[];
  } | null;
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [variants, setVariants] = useState<Variant[]>(
    product?.variants ?? [{ name: "Presentación", value: "", price: "", stock: 0 }]
  );

  function addVariant() {
    setVariants((prev) => [...prev, { name: prev[0]?.name ?? "Sabor", value: "", price: "", stock: 0 }]);
  }

  function removeVariant(i: number) {
    setVariants((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateVariant(i: number, field: keyof Variant, value: string | number) {
    setVariants((prev) => prev.map((v, idx) => (idx === i ? { ...v, [field]: value } : v)));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    variants.forEach((v) => {
      formData.append("variantName", v.name);
      formData.append("variantValue", v.value);
      formData.append("variantPrice", String(v.price));
      formData.append("variantStock", String(v.stock));
    });

    startTransition(async () => {
      if (product) {
        await updateProduct(product.id, formData);
      } else {
        await createProduct(formData);
      }
      router.push("/admin/products");
      router.refresh();
    });
  }

  const inputClass =
    "w-full rounded border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary";

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <section className="rounded border border-border p-5 space-y-4">
          <h2 className="font-semibold">Información general</h2>
          <div className="space-y-1">
            <label className="text-sm font-medium">Nombre del producto *</label>
            <input name="name" required defaultValue={product?.name} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Descripción *</label>
            <textarea name="description" required rows={4} defaultValue={product?.description} className={inputClass} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Marca</label>
              <input name="brand" defaultValue={product?.brand ?? ""} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Categoría *</label>
              <select name="categoryId" required defaultValue={product?.categoryId} className={inputClass}>
                <option value="">Seleccionar...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" name="isFeatured" value="true" defaultChecked={product?.isFeatured} />
              Producto destacado
            </label>
            {product && (
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" name="isActive" value="true" defaultChecked={product.isActive} />
                Activo
              </label>
            )}
          </div>
        </section>

        <section className="rounded border border-border p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Variantes (sabor, tamaño, etc.)</h2>
            <Button type="button" variant="outline" size="sm" onClick={addVariant}>
              + Agregar
            </Button>
          </div>
          {variants.map((variant, i) => (
            <div key={i} className="grid gap-3 rounded border border-border p-3 sm:grid-cols-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Tipo (ej. Sabor)</label>
                <input
                  value={variant.name}
                  onChange={(e) => updateVariant(i, "name", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Valor (ej. Chocolate)</label>
                <input
                  value={variant.value}
                  onChange={(e) => updateVariant(i, "value", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Precio (MXN)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={variant.price}
                  onChange={(e) => updateVariant(i, "price", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex items-end gap-2">
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={variant.stock}
                    onChange={(e) => updateVariant(i, "stock", parseInt(e.target.value))}
                    className={inputClass}
                  />
                </div>
                {variants.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeVariant(i)} className="text-destructive mb-0.5">
                    ×
                  </Button>
                )}
              </div>
            </div>
          ))}
        </section>

        {!product && (
          <section className="rounded border border-border p-5 space-y-3">
            <h2 className="font-semibold">Imágenes</h2>
            <p className="text-xs text-muted-foreground">La primera imagen será la principal.</p>
            <input
              type="file"
              name="images"
              multiple
              accept="image/*"
              className="text-sm"
            />
          </section>
        )}
      </div>

      <div className="h-fit rounded border border-border p-5 space-y-3">
        <h2 className="font-semibold">Guardar</h2>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Guardando..." : product ? "Actualizar producto" : "Crear producto"}
        </Button>
        <Button type="button" variant="outline" className="w-full" onClick={() => router.push("/admin/products")}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
