"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { SiteLogo } from "@/components/brand/site-logo";
import { PasswordInput } from "@/components/ui/password-input";

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
        <div className="mb-6 flex justify-center">
          <SiteLogo variant="horizontal" tone="adaptive" />
        </div>
        <h1 className="mb-2 text-2xl font-bold tracking-tight">Enlace inválido</h1>
        <p className="text-sm text-muted-foreground">
          Este enlace no es válido o ya expiró.
        </p>
        <Link href="/autenticacion/olvide-contrasena" className="mt-6 inline-block text-sm text-primary hover:underline">
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

    router.push("/autenticacion/iniciar-sesion?reset=1");
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 flex justify-center">
        <SiteLogo variant="horizontal" tone="adaptive" />
      </div>
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
          <PasswordInput
            id="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            disabled={loading}
            autoComplete="new-password"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="confirm" className="text-sm font-medium">
            Confirmar contraseña
          </label>
          <PasswordInput
            id="confirm"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repite la contraseña"
            disabled={loading}
            autoComplete="new-password"
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
