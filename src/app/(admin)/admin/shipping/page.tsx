import Link from "next/link";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { AdminShippingActions } from "@/components/admin/admin-shipping-actions";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Envíos | LC Admin" };

export default async function AdminShippingPage() {
  const zones = await db.shippingZone.findMany({ orderBy: { cost: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Zonas de envío</h1>
        <Button asChild>
          <Link href="/admin/shipping/new">+ Nueva zona</Link>
        </Button>
      </div>

      {zones.length === 0 ? (
        <div className="rounded border border-dashed border-border p-6 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Sin zonas configuradas.</p>
          <p className="mt-1">
            Mientras no exista ninguna zona, todos los pedidos se cobran con envío
            gratis. Crea al menos una zona para cobrar el envío.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {zones.map((zone) => (
            <div key={zone.id} className="rounded border border-border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{zone.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {zone.states.join(", ") || "Todos los estados"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="font-bold text-primary">
                    ${Number(zone.cost).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                  </p>
                  {zone.freeThreshold && (
                    <p className="text-xs text-green-600">
                      Gratis arriba de ${Number(zone.freeThreshold).toLocaleString("es-MX")}
                    </p>
                  )}
                  <AdminShippingActions zoneId={zone.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
