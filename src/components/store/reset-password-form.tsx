"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return (
      <div className="w-full max-w-sm text-center">
        <h1 className="mb-2 text-2xl font-bold tracking-tight">Enlace inválido</h1>
        <p className="text-sm text-muted-foreground">
          Este enlace no es válido o ya expiró.
        </p>
        <Link href="/auth/forgot-password" className="mt-6 inline-block text-sm text-primary hover:underline">
          Solicitar un nuevo enlace
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);

    const result = await authClient.resetPassword({ newPassword: password, token });

    setLoading(false);

    if (result.error) {
      setError("El enlace expiró o no es válido. Solicita uno nuevo.");
      return;
    }

    router.push("/auth/login?reset=1");
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Nueva contraseña</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Elige una contraseña segura para tu cuenta.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">
            Nueva contraseña
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Mínimo 8 caracteres"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="confirm" className="text-sm font-medium">
            Confirmar contraseña
          </label>
          <input
            id="confirm"
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Repite la contraseña"
          />
        </div>

        {error && (
          <p className="rounded bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Guardando..." : "Guardar contraseña"}
        </Button>
      </form>
    </div>
  );
}
