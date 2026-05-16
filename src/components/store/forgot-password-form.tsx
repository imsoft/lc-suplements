"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { SiteLogo } from "@/components/brand/site-logo";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await authClient.requestPasswordReset({
      email,
      redirectTo: "/auth/reset-password",
    });

    setLoading(false);

    if (result.error) {
      setError("No pudimos procesar tu solicitud. Intenta de nuevo.");
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="mb-6 flex justify-center">
          <SiteLogo variant="horizontal" tone="adaptive" />
        </div>
        <div className="mb-4 text-4xl">✉️</div>
        <h1 className="mb-2 text-2xl font-bold tracking-tight">Revisa tu correo</h1>
        <p className="text-sm text-muted-foreground">
          Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña.
          El enlace expira en 1 hora.
        </p>
        <Link href="/auth/login" className="mt-6 inline-block text-sm text-primary hover:underline">
          Volver al inicio de sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 flex justify-center">
        <SiteLogo variant="horizontal" tone="adaptive" />
      </div>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">¿Olvidaste tu contraseña?</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ingresa tu correo y te enviaremos un enlace para restablecerla.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="tu@correo.com"
          />
        </div>

        {error && (
          <p className="rounded bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Enviando..." : "Enviar enlace"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/auth/login" className="text-primary hover:underline">
          Volver al inicio de sesión
        </Link>
      </p>
    </div>
  );
}
