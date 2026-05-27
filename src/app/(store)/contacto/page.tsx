import { ContactForm } from "@/components/store/contact-form";
import { AnimateIn } from "@/components/ui/animate-in";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto | LC Suplements",
  description:
    "¿Tienes dudas? Contáctanos y nuestro equipo de expertos te responderá en menos de 24 horas.",
};

export default function ContactoPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-secondary py-32">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-primary/20 blur-[100px]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700 mb-4 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.4em] text-primary">
            <span className="inline-block h-px w-10 bg-primary" />
            Estamos aquí para ti
          </p>
          <h1 className="animate-in fade-in slide-in-from-bottom-8 fill-mode-both delay-150 duration-700 max-w-3xl text-7xl font-black uppercase leading-none tracking-tight text-white sm:text-9xl">
            CONTÁC-
            <br />
            <span className="text-primary">TANOS</span>
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-5">
          {/* Info */}
          <AnimateIn className="lg:col-span-2" from="left">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Información
            </p>
            <h2 className="mb-10 text-3xl font-black uppercase tracking-tight">
              Hablemos
            </h2>

            <div className="space-y-8">
              {[
                {
                  label: "Correo electrónico",
                  content: "contacto@lcsuplements.com",
                },
                {
                  label: "Teléfono / WhatsApp",
                  content: "33 3949 4924",
                },
                {
                  label: "Dirección",
                  content: "Av. Patria 3343B, Loma Bonita Ejidal, 45080 Zapopan, Jal.",
                  href: "https://maps.app.goo.gl/8Tmd4Y9M9TFveS1t8",
                },
                {
                  label: "Horario de atención",
                  content: "Lun – Vie: 9:00 – 18:00",
                  sub: "Sábados: 10:00 – 14:00",
                },
              ].map((item, i) => (
                <AnimateIn key={item.label} delay={i * 100}>
                  <div className="border-l-2 border-primary pl-6">
                    <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold hover:text-primary hover:underline"
                      >
                        {item.content}
                      </a>
                    ) : (
                      <p className="font-semibold">{item.content}</p>
                    )}
                    {item.sub && (
                      <p className="text-sm text-muted-foreground">{item.sub}</p>
                    )}
                  </div>
                </AnimateIn>
              ))}

              <AnimateIn delay={300}>
                <div className="border-l-2 border-primary pl-6">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Redes sociales
                  </p>
                  <div className="flex gap-4">
                    {[
                      { label: "Instagram", href: "https://instagram.com/lcsuplements" },
                      { label: "Facebook", href: "https://facebook.com/lcsuplements" },
                      { label: "TikTok", href: "https://tiktok.com/@lcsuplements" },
                    ].map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-primary hover:underline"
                      >
                        {social.label}
                      </a>
                    ))}
                  </div>
                </div>
              </AnimateIn>
            </div>
          </AnimateIn>

          {/* Form */}
          <AnimateIn className="lg:col-span-3" from="right" delay={100}>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Formulario
            </p>
            <h2 className="mb-10 text-3xl font-black uppercase tracking-tight">
              Envíanos un mensaje
            </h2>
            <ContactForm />
          </AnimateIn>
        </div>
      </section>

      {/* FAQ promo */}
      <section className="border-t border-border bg-secondary/5 py-16">
        <AnimateIn className="mx-auto max-w-3xl px-4 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-primary">
            Respuestas rápidas
          </p>
          <h3 className="mb-4 text-3xl font-black uppercase tracking-tight">
            ¿Tienes una pregunta frecuente?
          </h3>
          <p className="mb-8 text-muted-foreground">
            Es posible que ya tengamos la respuesta en nuestra sección de
            preguntas frecuentes.
          </p>
          <a
            href="/faq"
            className="inline-block border border-border px-8 py-4 text-sm font-bold uppercase tracking-wider transition-colors hover:border-primary hover:text-primary"
          >
            Ver preguntas frecuentes →
          </a>
        </AnimateIn>
      </section>
    </div>
  );
}
