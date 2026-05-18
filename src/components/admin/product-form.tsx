"use client";

import { useState, useTransition, useRef, useCallback } from "react";
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
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function addVariant() {
    setVariants((prev) => [...prev, { name: prev[0]?.name ?? "Sabor", value: "", price: "", stock: 0 }]);
  }

  function removeVariant(i: number) {
    setVariants((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateVariant(i: number, field: keyof Variant, value: string | number) {
    setVariants((prev) => prev.map((v, idx) => (idx === i ? { ...v, [field]: value } : v)));
  }

  const addFiles = useCallback((files: File[]) => {
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (!imageFiles.length) return;
    setImages((prev) => [...prev, ...imageFiles]);
    setPreviews((prev) => [...prev, ...imageFiles.map((f) => URL.createObjectURL(f))]);
  }, []);

  function removeImage(i: number) {
    URL.revokeObjectURL(previews[i]);
    setImages((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) addFiles(Array.from(e.target.files));
    e.target.value = "";
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
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

    images.forEach((img) => formData.append("images", img));

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
          <section className="rounded border border-border p-5 space-y-4">
            <div>
              <h2 className="font-semibold">Imágenes</h2>
              <p className="text-xs text-muted-foreground mt-0.5">La primera imagen agregada será la principal.</p>
            </div>

            {/* Dropzone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer select-none rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/60 hover:bg-muted/30"
              }`}
            >
              <div className="flex flex-col items-center gap-3 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-10 w-10 transition-colors ${isDragging ? "text-primary" : "text-muted-foreground"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
                <div>
                  <p className="text-sm font-medium">
                    {isDragging ? "Suelta las imágenes aquí" : "Arrastra imágenes aquí"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    o <span className="text-primary underline underline-offset-2">haz clic para seleccionar</span>
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">PNG, JPG, WEBP · Múltiples archivos</p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileInput}
            />

            {/* Thumbnails */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
                {images.map((file, i) => (
                  <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previews[i]}
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />
                    {i === 0 && (
                      <span className="absolute left-1.5 top-1.5 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                        Principal
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                      className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-background/80 text-xs font-bold text-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      ×
                    </button>
                    <div className="absolute inset-x-0 bottom-0 bg-background/70 px-1.5 py-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <p className="truncate text-[10px] text-foreground">{file.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
