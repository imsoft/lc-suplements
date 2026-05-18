import { ShippingZoneForm } from "@/components/admin/shipping-zone-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Nueva zona de envío | LC Admin" };

export default function NewShippingZonePage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Nueva zona de envío</h1>
      <div className="max-w-lg">
        <ShippingZoneForm />
      </div>
    </div>
  );
}
