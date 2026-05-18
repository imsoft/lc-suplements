"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { saveShippingZone } from "@/lib/actions/admin";

export function ShippingZoneForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [freeThreshold, setFreeThreshold] = useState("");
  const [statesInput, setStatesInput] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const states = statesInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    startTransition(async () => {
      await saveShippingZone({
        name,
        states,
        cost: parseFloat(cost),
        freeThreshold: freeThreshold ? parseFloat(freeThreshold) : undefined,
      });
      router.push("/admin/shipping");
    });
  }

  const inputClass =
    "w-full rounded border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded border border-border p-5">
      <div className="space-y-1">
        <label className="text-sm font-medium">Nombre de la zona *</label>
        <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="ej. Envío nacional" />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Estados (separados por coma)</label>
        <input value={statesInput} onChange={(e) => setStatesInput(e.target.value)} className={inputClass} placeholder="ej. CDMX, Jalisco, Nuevo León (vacío = todos)" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium">Costo (MXN) *</label>
          <input required type="number" step="0.01" min="0" value={cost} onChange={(e) => setCost(e.target.value)} className={inputClass} placeholder="99.00" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Envío gratis arriba de (MXN)</label>
          <input type="number" step="0.01" min="0" value={freeThreshold} onChange={(e) => setFreeThreshold(e.target.value)} className={inputClass} placeholder="999.00" />
        </div>
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>{isPending ? "Guardando..." : "Guardar zona"}</Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/shipping")}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
