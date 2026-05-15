"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createCategory } from "@/lib/actions/admin";

export function CreateCategoryForm({ categories }: { categories: { id: string; name: string }[] }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState("");
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await createCategory({ name, description, parentId: parentId || undefined });
      setName("");
      setDescription("");
      setParentId("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    });
  }

  const inputClass =
    "w-full rounded border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded border border-border p-5">
      <div className="space-y-1">
        <label className="text-sm font-medium">Nombre *</label>
        <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="ej. Proteínas" />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Descripción</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Categoría padre (opcional)</label>
        <select value={parentId} onChange={(e) => setParentId(e.target.value)} className={inputClass}>
          <option value="">Sin padre</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      {success && <p className="text-sm text-green-600">¡Categoría creada!</p>}
      <Button type="submit" disabled={isPending}>{isPending ? "Creando..." : "Crear categoría"}</Button>
    </form>
  );
}
