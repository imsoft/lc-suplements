import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { AccountForm } from "@/components/store/account-form";
import { AddressBook } from "@/components/store/address-book";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mi cuenta | LC Suplements" };

export default async function AccountPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/autenticacion/iniciar-sesion?callbackUrl=/cuenta");

  const addresses = await db.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold tracking-tight">Mi cuenta</h1>

      <div className="space-y-8">
        {/* Profile */}
        <section className="rounded border border-border p-6">
          <h2 className="mb-4 text-base font-semibold">Información personal</h2>
          <AccountForm
            userId={session.user.id}
            name={session.user.name}
            email={session.user.email}
            phone={(session.user as { phone?: string }).phone ?? ""}
          />
        </section>

        {/* Addresses */}
        <section className="rounded border border-border p-6">
          <h2 className="mb-4 text-base font-semibold">Mis direcciones</h2>
          <AddressBook addresses={addresses} userId={session.user.id} />
        </section>
      </div>
    </div>
  );
}
