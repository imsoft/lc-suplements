"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signUp.email({ name, email, password });

    if (result.error) {
      setError(result.error.message ?? "Error al crear la cuenta.");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Crear cuenta</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium">
            Nombre completo
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Juan Pérez"
          />
        </div>

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

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">
            Contraseña
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

        {error && (
          <p className="rounded bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>
    </div>
  );
}
