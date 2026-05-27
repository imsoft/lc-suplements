"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createCheckout } from "@/lib/actions/checkout";

interface CartItem {
  id: string;
  quantity: number;
  product: { name: string };
  variant: { value: string; price: number | string };
}

interface Address {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  references: string | null;
}

interface ShippingZone {
  id: string;
  name: string;
  cost: number | string;
  freeThreshold: number | string | null;
}

interface CheckoutFormProps {
  cart: { items: CartItem[] };
  subtotal: number;
  defaultAddress: Address | null;
  shippingZones: ShippingZone[];
  userEmail: string;
  userName: string;
  isGuest: boolean;
}

export function CheckoutForm({
  cart,
  subtotal,
  defaultAddress,
  shippingZones,
  userEmail,
  userName,
  isGuest,
}: CheckoutFormProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedZoneId, setSelectedZoneId] = useState(shippingZones[0]?.id ?? "");
  const [saveAddress, setSaveAddress] = useState(true);

  const [form, setForm] = useState({
    email: userEmail,
    fullName: defaultAddress?.fullName ?? userName,
    phone: defaultAddress?.phone ?? "",
    street: defaultAddress?.street ?? "",
    city: defaultAddress?.city ?? "",
    state: defaultAddress?.state ?? "",
    zipCode: defaultAddress?.zipCode ?? "",
    references: defaultAddress?.references ?? "",
  });

  const selectedZone = shippingZones.find((z) => z.id === selectedZoneId);
  const freeShipping =
    selectedZone?.freeThreshold && subtotal >= Number(selectedZone.freeThreshold);
  const shippingCost = freeShipping ? 0 : Number(selectedZone?.cost ?? 0);
  const total = subtotal + shippingCost;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await createCheckout({ ...form, shippingZoneId: selectedZoneId, saveAddress });
    });
  }

  const inputClass =
    "w-full rounded border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary";

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">

        {/* Email para invitados */}
        {isGuest && (
          <section className="rounded border border-border p-6">
            <h2 className="mb-4 text-base font-semibold">Datos de contacto</h2>
            <div className="space-y-1">
              <label className="text-sm font-medium">Correo electrónico</label>
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={inputClass}
                placeholder="tu@correo.com"
              />
              <p className="text-xs text-muted-foreground">
                Te enviaremos la confirmación de tu pedido a este correo.
              </p>
            </div>
          </section>
        )}

        {/* Datos de envío */}
        <section className="rounded border border-border p-6">
          <h2 className="mb-4 text-base font-semibold">Dirección de envío</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-sm font-medium">Nombre completo</label>
              <input required name="fullName" value={form.fullName} onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Teléfono</label>
              <input required name="phone" value={form.phone} onChange={handleChange} className={inputClass} placeholder="10 dígitos" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Código postal</label>
              <input required name="zipCode" value={form.zipCode} onChange={handleChange} className={inputClass} />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <label className="text-sm font-medium">Calle y número</label>
              <input required name="street" value={form.street} onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Ciudad</label>
              <input required name="city" value={form.city} onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Estado</label>
              <input required name="state" value={form.state} onChange={handleChange} className={inputClass} />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <label className="text-sm font-medium">Referencias</label>
              <input name="references" value={form.references} onChange={handleChange} className={inputClass} placeholder="Entre calles, color de casa..." />
            </div>
            {!isGuest && (
              <label className="sm:col-span-2 flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveAddress}
                  onChange={(e) => setSaveAddress(e.target.checked)}
                  className="rounded"
                />
                Guardar dirección para futuras compras
              </label>
            )}
          </div>
        </section>

        {/* Zona de envío */}
        {shippingZones.length > 0 && (
          <section className="rounded border border-border p-6">
            <h2 className="mb-4 text-base font-semibold">Método de envío</h2>
            <div className="space-y-2">
              {shippingZones.map((zone) => {
                const free = zone.freeThreshold && subtotal >= Number(zone.freeThreshold);
                return (
                  <label key={zone.id} className="flex items-center gap-3 rounded border border-border p-3 cursor-pointer has-checked:border-primary">
                    <input
                      type="radio"
                      name="zone"
                      value={zone.id}
                      checked={selectedZoneId === zone.id}
                      onChange={() => setSelectedZoneId(zone.id)}
                    />
                    <div className="flex flex-1 items-center justify-between">
                      <span className="text-sm font-medium">{zone.name}</span>
                      <span className="text-sm font-bold">
                        {free ? (
                          <span className="text-green-600">GRATIS</span>
                        ) : (
                          `$${Number(zone.cost).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`
                        )}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Resumen */}
      <div className="h-fit rounded border border-border p-6">
        <h2 className="mb-4 text-base font-semibold">Resumen del pedido</h2>
        <div className="space-y-2 text-sm">
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span className="text-muted-foreground line-clamp-1">
                {item.product.name} × {item.quantity}
              </span>
              <span>
                ${(Number(item.variant.price) * item.quantity).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}

          <div className="border-t border-border pt-2 space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Envío</span>
              <span>{shippingCost === 0 ? "GRATIS" : `$${shippingCost.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t border-border pt-2">
              <span>Total</span>
              <span>${total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        <Button type="submit" className="mt-6 w-full" disabled={isPending}>
          {isPending ? "Redirigiendo..." : "Pagar con MercadoPago"}
        </Button>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          Serás redirigido a MercadoPago para completar el pago de forma segura.
        </p>
      </div>
    </form>
  );
}
