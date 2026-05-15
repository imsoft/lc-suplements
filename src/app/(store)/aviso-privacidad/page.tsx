import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso de Privacidad | LC Suplements",
  description: "Aviso de privacidad de LC Suplements conforme a la LFPDPPP.",
};

const LAST_UPDATED = "14 de mayo de 2025";

export default function AvisoPrivacidadPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Aviso de Privacidad</h1>
      <p className="mb-10 text-sm text-muted-foreground">Última actualización: {LAST_UPDATED}</p>

      <div className="space-y-8 text-foreground">

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary uppercase tracking-wider">Responsable</h2>
          <p className="text-muted-foreground leading-relaxed">
            <strong>LC Suplements</strong> (en adelante "LC Suplements" o "el Responsable"), con domicilio
            en <span className="font-medium text-primary">[DOMICILIO_COMPLETO]</span>, es responsable del
            tratamiento de sus datos personales conforme a lo establecido en la{" "}
            <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares
            (LFPDPPP)</strong> y demás normatividad aplicable en México.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary uppercase tracking-wider">Datos personales que recabamos</h2>
          <p className="text-muted-foreground leading-relaxed">
            Para las finalidades descritas en este aviso, podemos recabar los siguientes datos personales:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-2">
            <li>Nombre completo</li>
            <li>Correo electrónico</li>
            <li>Número de teléfono</li>
            <li>Dirección de entrega (calle, número, ciudad, estado, código postal)</li>
            <li>Historial de compras y preferencias de productos</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            <strong>No recabamos datos sensibles</strong> (como datos financieros bancarios; los pagos
            son procesados directamente por MercadoPago bajo sus propias políticas de privacidad).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary uppercase tracking-wider">Finalidades del tratamiento</h2>
          <p className="text-muted-foreground leading-relaxed font-medium">Finalidades primarias (necesarias):</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-2">
            <li>Crear y gestionar su cuenta de usuario.</li>
            <li>Procesar, confirmar y dar seguimiento a sus pedidos.</li>
            <li>Gestionar la entrega a domicilio.</li>
            <li>Atender solicitudes, quejas o aclaraciones.</li>
            <li>Cumplir con obligaciones legales y fiscales.</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed font-medium mt-4">Finalidades secundarias (opcionales):</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-2">
            <li>Enviarle información sobre promociones, descuentos y nuevos productos.</li>
            <li>Realizar encuestas de satisfacción.</li>
            <li>Personalizar su experiencia de compra.</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            Si no desea que sus datos sean tratados para las finalidades secundarias, puede manifestarlo
            enviando un correo a{" "}
            <span className="font-medium text-primary">[CORREO_CONTACTO]</span>{" "}
            con el asunto <em>"Opt-out comunicaciones"</em>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary uppercase tracking-wider">Transferencia de datos</h2>
          <p className="text-muted-foreground leading-relaxed">
            LC Suplements puede compartir sus datos personales con terceros únicamente en los siguientes
            supuestos:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-2">
            <li>
              <strong>Empresas de paquetería y logística</strong> — para efectuar la entrega de su pedido.
            </li>
            <li>
              <strong>MercadoPago</strong> — procesador de pagos, bajo sus propias políticas de privacidad.
            </li>
            <li>
              <strong>Autoridades competentes</strong> — cuando sea requerido por ley o resolución judicial.
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            Dichas transferencias no requieren su consentimiento por estar previstas en el artículo 37
            de la LFPDPPP. No vendemos, cedemos ni comercializamos sus datos con terceros con fines de
            mercadotecnia propia.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary uppercase tracking-wider">Derechos ARCO</h2>
          <p className="text-muted-foreground leading-relaxed">
            Usted tiene derecho a <strong>Acceder, Rectificar, Cancelar u Oponerse</strong> (derechos ARCO)
            al tratamiento de sus datos personales, así como a revocar el consentimiento otorgado.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Para ejercer sus derechos ARCO envíe una solicitud a:
          </p>
          <div className="rounded border border-border bg-card p-4 text-sm space-y-1">
            <p><strong className="text-foreground">Correo:</strong>{" "}
              <span className="text-primary">[CORREO_CONTACTO]</span></p>
            <p><strong className="text-foreground">Asunto:</strong> Solicitud de derechos ARCO</p>
            <p className="text-muted-foreground mt-2">
              Su solicitud debe incluir: nombre completo, correo registrado, descripción clara del
              derecho que desea ejercer y, en su caso, documentos que acrediten su identidad.
            </p>
            <p className="text-muted-foreground">
              Daremos respuesta en un plazo máximo de <strong>20 días hábiles</strong> conforme a la LFPDPPP.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary uppercase tracking-wider">Cookies y tecnologías de rastreo</h2>
          <p className="text-muted-foreground leading-relaxed">
            Nuestro sitio utiliza cookies de sesión estrictamente necesarias para mantener su inicio de
            sesión y el contenido de su carrito. No utilizamos cookies de rastreo publicitario de terceros.
            Puede configurar su navegador para rechazar cookies, aunque esto puede afectar la funcionalidad
            de la tienda.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary uppercase tracking-wider">Seguridad</h2>
          <p className="text-muted-foreground leading-relaxed">
            LC Suplements implementa medidas de seguridad técnicas y organizativas para proteger sus datos
            personales contra acceso no autorizado, alteración, divulgación o destrucción. La comunicación
            entre su dispositivo y nuestros servidores se realiza mediante cifrado TLS/HTTPS.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary uppercase tracking-wider">Cambios al aviso de privacidad</h2>
          <p className="text-muted-foreground leading-relaxed">
            LC Suplements puede actualizar este Aviso de Privacidad en cualquier momento. Los cambios
            serán publicados en esta página con la fecha de última actualización. Le recomendamos
            revisarlo periódicamente.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-primary uppercase tracking-wider">INAI</h2>
          <p className="text-muted-foreground leading-relaxed">
            Si considera que su derecho a la protección de datos personales ha sido vulnerado, puede
            acudir al <strong>Instituto Nacional de Transparencia, Acceso a la Información y Protección
            de Datos Personales (INAI)</strong> en{" "}
            <span className="text-primary">www.inai.org.mx</span>.
          </p>
        </section>

      </div>
    </div>
  );
}
