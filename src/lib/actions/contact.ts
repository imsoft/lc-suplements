"use server";

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const subject = formData.get("subject")?.toString().trim();
  const message = formData.get("message")?.toString().trim();

  if (!name || !email || !message) {
    return { status: "error", message: "Por favor completa todos los campos requeridos." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "El correo electrónico no es válido." };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "LC Suplements <onboarding@resend.dev>",
      to: ["contacto@lcsuplements.com"],
      replyTo: email,
      subject: `Contacto: ${subject || "Sin asunto"} — ${name}`,
      text: `Nombre: ${name}\nCorreo: ${email}\nAsunto: ${subject || "—"}\n\nMensaje:\n${message}`,
    });

    return { status: "success" };
  } catch {
    return {
      status: "error",
      message: "No se pudo enviar el mensaje. Inténtalo de nuevo más tarde.",
    };
  }
}
