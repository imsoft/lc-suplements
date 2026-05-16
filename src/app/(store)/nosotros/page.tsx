import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros | LC Suplements",
  description:
    "Conoce la historia, misión y valores detrás de LC Suplements, tu tienda de confianza para suplementos deportivos en México.",
};

export default function NosotrosPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-secondary py-32 text-secondary-foreground">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-primary/20 blur-[100px]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-4 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.4em] text-primary">
            <span className="inline-block h-px w-10 bg-primary" />
            Quiénes somos
          </p>
          <h1 className="max-w-3xl text-7xl font-black uppercase leading-none tracking-tight sm:text-9xl">
            NUESTRA
            <br />
            <span className="text-primary">HISTORIA</span>
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              El origen
            </p>
            <h2 className="mb-8 text-4xl font-black uppercase tracking-tight">
              Nacimos de la pasión
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              LC Suplements nació de una necesidad real: encontrar suplementos
              de alta calidad, a buen precio y con asesoría confiable en México.
              Fundada por atletas para atletas, nuestra tienda es el resultado de
              años de experiencia en el mundo del fitness y la nutrición
              deportiva.
            </p>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Nos cansamos de ver productos adulterados y tiendas sin
              conocimiento. Decidimos hacer las cosas diferente: traer solo lo
              mejor, con garantía de autenticidad y el respaldo de un equipo que
              vive lo que vende.
            </p>
          </div>
          <div className="flex h-80 items-center justify-center bg-secondary">
            <p className="text-8xl">💪</p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-secondary/5 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Lo que nos mueve
            </p>
            <h2 className="text-5xl font-black uppercase tracking-tight">
              Misión y visión
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="border border-border p-10">
              <p className="mb-6 text-5xl font-black text-primary/20">01</p>
              <h3 className="mb-4 text-xl font-black uppercase tracking-wider">
                Misión
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                Llevar suplementos deportivos de la más alta calidad a cada
                atleta en México, con precios justos, asesoría honesta y envíos
                rápidos. Queremos ser el aliado número uno en tu camino hacia
                tus metas.
              </p>
            </div>
            <div className="border border-transparent bg-secondary p-10 text-secondary-foreground">
              <p className="mb-6 text-5xl font-black text-primary/40">02</p>
              <h3 className="mb-4 text-xl font-black uppercase tracking-wider">
                Visión
              </h3>
              <p className="leading-relaxed text-white/60">
                Convertirnos en la tienda de suplementos más confiable de
                México, reconocida por la calidad de sus productos, la
                excelencia en el servicio y el impacto positivo en la comunidad
                fitness nacional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Cómo trabajamos
            </p>
            <h2 className="text-5xl font-black uppercase tracking-tight">
              Nuestros valores
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                num: "01",
                title: "Autenticidad",
                desc: "Solo vendemos productos 100% originales de marcas certificadas. Nunca comprometemos la calidad.",
              },
              {
                num: "02",
                title: "Honestidad",
                desc: "Te decimos exactamente lo que necesitas, no lo que más nos conviene vender.",
              },
              {
                num: "03",
                title: "Compromiso",
                desc: "Estamos contigo desde que haces tu pedido hasta que alcanzas tus metas.",
              },
              {
                num: "04",
                title: "Comunidad",
                desc: "Somos parte de la familia fitness mexicana. Tu éxito es nuestro éxito.",
              },
            ].map((val) => (
              <div key={val.num} className="border-t-2 border-primary pt-8">
                <p className="mb-4 text-4xl font-black text-primary/20">
                  {val.num}
                </p>
                <h3 className="mb-3 font-black uppercase tracking-wider">
                  {val.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { value: "2020", label: "Año de fundación" },
              { value: "+10K", label: "Clientes satisfechos" },
              { value: "+500", label: "Productos disponibles" },
              { value: "5★", label: "Valoración promedio" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-black text-primary">{stat.value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary py-24 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-5xl font-black uppercase tracking-tight text-secondary-foreground">
            ¿Listo para{" "}
            <span className="text-primary">empezar?</span>
          </h2>
          <p className="mt-6 text-white/60">
            Explora nuestro catálogo o contáctanos para recibir asesoría
            personalizada sin costo.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="px-10 py-6 font-bold uppercase tracking-wider"
              asChild
            >
              <Link href="/products">Ver productos</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 px-10 py-6 font-bold uppercase tracking-wider text-white hover:bg-white/10"
              asChild
            >
              <Link href="/contacto">Contactarnos</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
