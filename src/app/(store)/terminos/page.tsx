import type { Metadata } from "next";
import { AnimateIn } from "@/components/ui/animate-in";

export const metadata: Metadata = {
  title: "Términos y Condiciones | LC Suplements",
  description: "Términos y condiciones de uso de la tienda en línea LC Suplements.",
};

const LAST_UPDATED = "14 de mayo de 2025";

export default function TerminosPage() {
  return (
    <AnimateIn className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Términos y Condiciones</h1>
      <p className="mb-10 text-sm text-muted-foreground">Última actualización: {LAST_UPDATED}</p>

      <div className="prose prose-sm max-w-none space-y-8 text-foreground">

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary uppercase tracking-wider">1. Aceptación</h2>
          <p className="text-muted-foreground leading-relaxed">
            Al acceder y utilizar el sitio web de <strong>LC Suplements</strong> (en adelante "la tienda"),
            el usuario acepta de forma expresa los presentes Términos y Condiciones. Si no está de acuerdo
            con alguno de ellos, le pedimos que se abstenga de usar la tienda.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary uppercase tracking-wider">2. Productos y disponibilidad</h2>
          <p className="text-muted-foreground leading-relaxed">
            Todos los productos ofrecidos son suplementos alimenticios (proteínas, creatinas, vitaminas,
            pre-entrenos y similares) destinados a complementar una dieta equilibrada. No son medicamentos
            ni sustituyen tratamientos médicos. LC Suplements se reserva el derecho de modificar precios,
            descripciones y disponibilidad de productos sin previo aviso.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Las imágenes de los productos son de carácter ilustrativo. El empaque puede variar según el lote
            o presentación disponible al momento del pedido.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary uppercase tracking-wider">3. Proceso de compra</h2>
          <p className="text-muted-foreground leading-relaxed">
            Para realizar una compra el usuario debe crear una cuenta con datos verídicos. Al confirmar un
            pedido, el usuario declara haber leído la descripción del producto y acepta el precio mostrado
            en el momento de la compra, incluyendo el costo de envío seleccionado.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            El contrato de compraventa se perfecciona en el momento en que LC Suplements confirma el pago
            y envía la notificación correspondiente al correo registrado.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary uppercase tracking-wider">4. Precios y pagos</h2>
          <p className="text-muted-foreground leading-relaxed">
            Todos los precios están expresados en pesos mexicanos (MXN) e incluyen IVA cuando aplica.
            Los pagos se procesan a través de <strong>MercadoPago</strong>, plataforma que acepta tarjetas
            de crédito, débito, pagos en OXXO y transferencias SPEI. LC Suplements no almacena datos de
            tarjetas bancarias.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary uppercase tracking-wider">5. Envíos</h2>
          <p className="text-muted-foreground leading-relaxed">
            Realizamos envíos a todo México. Los tiempos de entrega son estimados y pueden variar por
            factores externos (clima, paro de transportistas, días festivos). LC Suplements no se hace
            responsable por retrasos imputables a la paquetería una vez que el pedido ha sido entregado
            al transportista.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            El costo de envío se calcula en función de la zona de entrega y se muestra antes de confirmar
            el pago. Algunos pedidos pueden calificar para envío gratuito según el monto de compra.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary uppercase tracking-wider">6. Devoluciones y cancelaciones</h2>
          <p className="text-muted-foreground leading-relaxed">
            El usuario puede solicitar la cancelación de su pedido dentro de las <strong>24 horas</strong> siguientes
            a la confirmación del pago, siempre que el pedido no haya sido enviado. Pasado ese plazo, no se
            aceptan cancelaciones.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Se aceptan devoluciones únicamente en los siguientes casos:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-2">
            <li>Producto dañado o en mal estado al recibirlo.</li>
            <li>Producto diferente al solicitado.</li>
            <li>Producto vencido al momento de la entrega.</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            La solicitud debe realizarse dentro de los <strong>3 días naturales</strong> posteriores a la
            recepción del producto, enviando evidencia fotográfica a{" "}
            <span className="font-medium text-primary">[CORREO_CONTACTO]</span>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary uppercase tracking-wider">7. Uso aceptable</h2>
          <p className="text-muted-foreground leading-relaxed">
            El usuario se compromete a utilizar la tienda únicamente para fines lícitos y personales.
            Queda prohibido: intentar acceder sin autorización a sistemas internos, realizar pedidos
            fraudulentos, revender los productos sin autorización expresa, o usar el sitio para actividades
            que vulneren derechos de terceros.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary uppercase tracking-wider">8. Propiedad intelectual</h2>
          <p className="text-muted-foreground leading-relaxed">
            Todo el contenido de la tienda (logotipos, imágenes, textos, diseño) es propiedad de
            LC Suplements o de sus proveedores y está protegido por las leyes de propiedad intelectual
            aplicables en México. Queda prohibida su reproducción sin autorización escrita.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary uppercase tracking-wider">9. Limitación de responsabilidad</h2>
          <p className="text-muted-foreground leading-relaxed">
            LC Suplements no se hace responsable por el uso inadecuado de los productos adquiridos, ni
            por reacciones adversas derivadas de condiciones de salud preexistentes del usuario. Se
            recomienda consultar a un profesional de la salud antes de consumir cualquier suplemento.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary uppercase tracking-wider">10. Modificaciones</h2>
          <p className="text-muted-foreground leading-relaxed">
            LC Suplements se reserva el derecho de modificar estos Términos y Condiciones en cualquier
            momento. Los cambios entrarán en vigor a partir de su publicación en este sitio. El uso
            continuado de la tienda implica la aceptación de los términos vigentes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary uppercase tracking-wider">11. Jurisdicción</h2>
          <p className="text-muted-foreground leading-relaxed">
            Estos Términos se rigen por las leyes de los Estados Unidos Mexicanos. Para cualquier
            controversia, las partes se someten a la jurisdicción de los tribunales competentes de{" "}
            <span className="font-medium text-primary">[CIUDAD_ESTADO]</span>, renunciando a cualquier
            otro fuero que pudiera corresponderles.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary uppercase tracking-wider">12. Contacto</h2>
          <p className="text-muted-foreground leading-relaxed">
            Para cualquier duda relacionada con estos términos puedes escribirnos a{" "}
            <span className="font-medium text-primary">[CORREO_CONTACTO]</span>.
          </p>
        </section>

      </div>
    </AnimateIn>
  );
}
