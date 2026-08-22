import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { db } from "@/lib/db";
import { mpPayment } from "@/lib/mercadopago";

function verifySignature(request: NextRequest, rawBody: string): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) {
    // En producción se rechaza: sin secreto cualquiera podría marcar
    // pedidos como pagados. En local se permite para poder probar.
    if (process.env.NODE_ENV === "production") {
      console.error("MERCADOPAGO_WEBHOOK_SECRET no está configurado; webhook rechazado.");
      return false;
    }
    return true;
  }

  const xSignature = request.headers.get("x-signature");
  const xRequestId = request.headers.get("x-request-id");
  if (!xSignature || !xRequestId) return false;

  const parts = Object.fromEntries(xSignature.split(",").map((p) => p.split("=") as [string, string]));
  const ts = parts["ts"];
  const v1 = parts["v1"];
  if (!ts || !v1) return false;

  const url = new URL(request.url);
  const dataId = url.searchParams.get("data.id") ?? JSON.parse(rawBody)?.data?.id ?? "";
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

  const expected = createHmac("sha256", secret).update(manifest).digest("hex");
  return expected === v1;
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  if (!verifySignature(request, rawBody)) {
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
  }

  const body = JSON.parse(rawBody) as Record<string, unknown> | null;

  if (!body || body.type !== "payment") {
    return NextResponse.json({ received: true });
  }

  const paymentId = (body.data as Record<string, unknown>)?.id;
  if (!paymentId) return NextResponse.json({ received: true });

  const payment = await mpPayment.get({ id: paymentId as string });
  const orderId = payment.external_reference;

  if (!orderId) return NextResponse.json({ received: true });

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { items: { select: { variantId: true, quantity: true } } },
  });
  if (!order) return NextResponse.json({ received: true });

  const approved = payment.status === "approved";
  const yaPagado = order.paymentStatus === "PAID";

  await db.order.update({
    where: { id: orderId },
    data: {
      mpPaymentId: String(paymentId),
      paymentStatus: approved ? "PAID" : payment.status === "rejected" ? "FAILED" : "PENDING",
      status: approved ? "CONFIRMED" : order.status,
    },
  });

  // Descontar inventario una sola vez, cuando el pago se aprueba.
  // MercadoPago reenvía la misma notificación varias veces.
  if (approved && !yaPagado) {
    await Promise.all(
      order.items.map((item) =>
        db.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        })
      )
    );
  }

  return NextResponse.json({ received: true });
}
