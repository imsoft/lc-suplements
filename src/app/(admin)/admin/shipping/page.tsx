import { db } from "@/lib/db";
import { ShippingZoneForm } from "@/components/admin/shipping-zone-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Envíos | LC Admin" };

export default async function AdminShippingPage() {
  const zones = await db.shippingZone.findMany({ orderBy: { cost: "asc" } });

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h1 className="mb-6 text-2xl font-bold tracking-tight">Zonas de envío</h1>
        {zones.length === 0 ? (
          <p className="text-muted-foreground text-sm">Sin zonas configuradas.</p>
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
                  <div className="text-right">
                    <p className="font-bold text-primary">
                      ${Number(zone.cost).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                    </p>
                    {zone.freeThreshold && (
                      <p className="text-xs text-green-600">
                        Gratis arriba de ${Number(zone.freeThreshold).toLocaleString("es-MX")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-6 text-lg font-semibold">Nueva zona de envío</h2>
        <ShippingZoneForm />
      </div>
    </div>
  );
}
