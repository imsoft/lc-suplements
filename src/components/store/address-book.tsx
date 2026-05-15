"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { saveAddress, deleteAddress } from "@/lib/actions/account";

interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  references: string | null;
  isDefault: boolean;
}

const EMPTY_FORM = {
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  zipCode: "",
  references: "",
  isDefault: false,
};

export function AddressBook({
  addresses,
  userId,
}: {
  addresses: Address[];
  userId: string;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isPending, startTransition] = useTransition();

  function openNew() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(addr: Address) {
    setEditing(addr);
    setForm({
      fullName: addr.fullName,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      zipCode: addr.zipCode,
      references: addr.references ?? "",
      isDefault: addr.isDefault,
    });
    setShowForm(true);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await saveAddress({ ...form, id: editing?.id });
      setShowForm(false);
    });
  }

  function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta dirección?")) return;
    startTransition(async () => { await deleteAddress(id); });
  }

  const inputClass =
    "w-full rounded border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary";

  return (
    <div className="space-y-4">
      {addresses.length === 0 && !showForm && (
        <p className="text-sm text-muted-foreground">No tienes direcciones guardadas.</p>
      )}

      {addresses.map((addr) => (
        <div
          key={addr.id}
          className={`rounded border p-4 ${addr.isDefault ? "border-primary" : "border-border"}`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="text-sm">
              {addr.isDefault && (
                <span className="mb-1 inline-block rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  Principal
                </span>
              )}
              <p className="font-medium">{addr.fullName}</p>
              <p className="text-muted-foreground">{addr.street}</p>
              <p className="text-muted-foreground">
                {addr.city}, {addr.state} {addr.zipCode}
              </p>
              {addr.references && (
                <p className="text-muted-foreground">Ref: {addr.references}</p>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={() => openEdit(addr)}>
                Editar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive"
                disabled={isPending}
                onClick={() => handleDelete(addr.id)}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      ))}

      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-3 rounded border border-border p-4">
          <h3 className="text-sm font-semibold">
            {editing ? "Editar dirección" : "Nueva dirección"}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-medium">Nombre completo *</label>
              <input required name="fullName" value={form.fullName} onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Teléfono *</label>
              <input required name="phone" value={form.phone} onChange={handleChange} className={inputClass} />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-medium">Calle y número *</label>
              <input required name="street" value={form.street} onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Ciudad *</label>
              <input required name="city" value={form.city} onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Estado *</label>
              <input required name="state" value={form.state} onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Código postal *</label>
              <input required name="zipCode" value={form.zipCode} onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Referencias</label>
              <input name="references" value={form.references} onChange={handleChange} className={inputClass} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} />
            Establecer como dirección principal
          </label>
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar"}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      ) : (
        <Button variant="outline" onClick={openNew}>
          + Agregar dirección
        </Button>
      )}
    </div>
  );
}
