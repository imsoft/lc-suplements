import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes | LC Suplements",
  description:
    "Encuentra respuestas sobre envíos, pagos, devoluciones y nuestros productos. Si no encuentras lo que buscas, contáctanos.",
};

const faqs = [
  {
    category: "Envíos",
    items: [
      {
        q: "¿Cuánto tiempo tarda mi pedido en llegar?",
        a: "Los pedidos se procesan en 1-2 días hábiles. El tiempo de entrega depende de tu ubicación: CDMX y zona metropolitana recibe en 24-48 horas, el resto del país en 3-5 días hábiles.",
      },
      {
        q: "¿Hacen envíos a todo México?",
        a: "Sí, hacemos envíos a toda la República Mexicana a través de nuestras paqueterías aliadas. También contamos con envío express disponible.",
      },
      {
        q: "¿Cuánto cuesta el envío?",
        a: "El costo de envío varía según tu zona. Puedes verificarlo al momento del checkout. Los pedidos que superen el monto mínimo de compra aplican para envío gratis.",
      },
      {
        q: "¿Cómo puedo rastrear mi pedido?",
        a: "Una vez enviado tu pedido, recibirás un correo con el número de guía para que puedas rastrearlo directamente con la paquetería.",
      },
    ],
  },
  {
    category: "Pagos",
    items: [
      {
        q: "¿Qué métodos de pago aceptan?",
        a: "Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), OXXO Pay y transferencia bancaria, todos procesados de forma segura a través de MercadoPago.",
      },
      {
        q: "¿Es seguro pagar en su tienda?",
        a: "Sí. Utilizamos MercadoPago como pasarela de pago, que cuenta con encriptación SSL y cumple con los más altos estándares de seguridad. Nunca almacenamos datos de tu tarjeta.",
      },
      {
        q: "¿Puedo pagar en OXXO?",
        a: "Sí. Al elegir OXXO Pay, recibirás un código de barras que puedes pagar en cualquier tienda OXXO. Tu pedido se procesa una vez confirmado el pago.",
      },
    ],
  },
  {
    category: "Productos",
    items: [
      {
        q: "¿Son productos originales?",
        a: "100%. Trabajamos directamente con distribuidores autorizados y marcas reconocidas. Todos nuestros productos tienen garantía de autenticidad.",
      },
      {
        q: "¿Los productos tienen fecha de caducidad vigente?",
        a: "Sí. Revisamos cada lote antes de enviarlo para garantizar que todos los productos cuenten con al menos 6 meses de vigencia al momento de la entrega.",
      },
      {
        q: "¿Puedo pedir asesoría sobre qué suplemento comprar?",
        a: "Por supuesto. Contáctanos por WhatsApp, Instagram o a través de nuestro formulario de contacto y con gusto te orientamos sin costo.",
      },
      {
        q: "¿Tienen productos para principiantes?",
        a: "Sí. Contamos con suplementos para todos los niveles, desde personas que inician hasta atletas de alto rendimiento. Filtrar por nivel en nuestro catálogo o pregúntanos directamente.",
      },
    ],
  },
  {
    category: "Devoluciones y garantías",
    items: [
      {
        q: "¿Qué hago si recibo un producto dañado?",
        a: "Escríbenos dentro de los 3 días siguientes a la entrega con foto del producto y número de pedido. Lo resolvemos de inmediato: reposición o reembolso total.",
      },
      {
        q: "¿Puedo devolver un producto que no me gustó?",
        a: "Aceptamos devoluciones dentro de los 7 días naturales, siempre que el producto esté sin abrir y en su empaque original. Consulta nuestros términos y condiciones para más detalles.",
      },
      {
        q: "¿Cuánto tarda un reembolso?",
        a: "Los reembolsos se procesan en 5-10 días hábiles dependiendo de tu banco o método de pago original.",
      },
    ],
  },
];

export default function FaqPage() {
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
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-primary/20 blur-[100px]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-4 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.4em] text-primary">
            <span className="inline-block h-px w-10 bg-primary" />
            Resolvemos tus dudas
          </p>
          <h1 className="max-w-3xl text-7xl font-black uppercase leading-none tracking-tight text-white sm:text-9xl">
            PREGUN-
            <br />
            <span className="text-primary">TAS</span>
          </h1>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="space-y-16">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="mb-8 border-b border-border pb-4 text-xs font-bold uppercase tracking-[0.3em] text-primary">
                {section.category}
              </h2>
              <div className="space-y-px">
                {section.items.map((item) => (
                  <details
                    key={item.q}
                    className="group border border-border"
                  >
                    <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 font-bold uppercase tracking-wide transition-colors hover:text-primary [&::-webkit-details-marker]:hidden">
                      <span>{item.q}</span>
                      <span className="shrink-0 text-xl font-black text-primary transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <div className="border-t border-border px-6 py-5">
                      <p className="leading-relaxed text-muted-foreground">
                        {item.a}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-secondary py-20 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-primary">
            ¿Aún tienes dudas?
          </p>
          <h3 className="mb-4 text-4xl font-black uppercase tracking-tight text-secondary-foreground">
            Estamos para ayudarte
          </h3>
          <p className="mb-10 text-white/60">
            Nuestro equipo responde en menos de 24 horas hábiles.
          </p>
          <Link
            href="/contacto"
            className="inline-block bg-primary px-10 py-5 text-sm font-bold uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-90"
          >
            Contáctanos
          </Link>
        </div>
      </section>
    </div>
  );
}
