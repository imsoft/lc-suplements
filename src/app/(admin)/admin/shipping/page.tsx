import Link from "next/link";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
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
  );
}
