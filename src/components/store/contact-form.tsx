"use client";

import { useActionState } from "react";
import { sendContactMessage, type ContactState } from "@/lib/actions/contact";
import { Button } from "@/components/ui/button";

const initialState: ContactState = { status: "idle" };

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContactMessage, initialState);

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="mb-4 text-6xl">✅</p>
        <h3 className="mb-2 text-2xl font-black uppercase tracking-tight">
          ¡Mensaje enviado!
        </h3>
        <p className="text-muted-foreground">
          Te responderemos en un plazo máximo de 24 horas hábiles.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider" htmlFor="name">
            Nombre completo <span className="text-primary">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Juan Pérez"
            className="border border-border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider" htmlFor="email">
            Correo electrónico <span className="text-primary">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="juan@ejemplo.com"
            className="border border-border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider" htmlFor="subject">
          Asunto
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          placeholder="¿En qué podemos ayudarte?"
          className="border border-border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider" htmlFor="message">
          Mensaje <span className="text-primary">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Escribe tu mensaje aquí..."
          className="resize-none border border-border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
        />
      </div>

      {state.status === "error" && (
        <p className="text-sm font-semibold text-destructive">{state.message}</p>
      )}

      <Button
        type="submit"
        disabled={pending}
        size="lg"
        className="w-full py-6 font-bold uppercase tracking-widest sm:w-auto"
      >
        {pending ? "Enviando..." : "Enviar mensaje"}
      </Button>
    </form>
  );
}
