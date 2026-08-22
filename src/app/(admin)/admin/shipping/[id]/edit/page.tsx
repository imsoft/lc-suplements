import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ShippingZoneForm } from "@/components/admin/shipping-zone-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Editar zona de envío | LC Admin" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditShippingZonePage({ params }: Props) {
  const { id } = await params;
  const zone = await db.shippingZone.findUnique({ where: { id } });
  if (!zone) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Editar: {zone.name}</h1>
      <div className="max-w-lg">
        <ShippingZoneForm
          zone={{
            id: zone.id,
            name: zone.name,
            states: zone.states,
            cost: Number(zone.cost),
            freeThreshold: zone.freeThreshold !== null ? Number(zone.freeThreshold) : null,
          }}
        />
      </div>
    </div>
  );
}
