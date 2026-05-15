"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/lib/actions/account";

interface AccountFormProps {
  userId: string;
  name: string;
  email: string;
  phone: string;
}

export function AccountForm({ name, email, phone }: AccountFormProps) {
  const [formName, setFormName] = useState(name);
  const [formPhone, setFormPhone] = useState(phone);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateProfile({ name: formName, phone: formPhone });
      setMessage(result.error ?? "Perfil actualizado.");
      setTimeout(() => setMessage(""), 3000);
    });
  }

  const inputClass =
    "w-full rounded border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium">Nombre completo</label>
          <input
            required
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Correo electrónico</label>
          <input
            value={email}
            disabled
            className={`${inputClass} opacity-60 cursor-not-allowed`}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Teléfono</label>
          <input
            value={formPhone}
            onChange={(e) => setFormPhone(e.target.value)}
            placeholder="10 dígitos"
            className={inputClass}
          />
        </div>
      </div>

      {message && (
        <p className="rounded bg-primary/10 px-3 py-2 text-sm text-primary">
          {message}
        </p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar cambios"}
      </Button>
    </form>
  );
}
