export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/auth/login");
  if (session.user.role !== "ADMIN") redirect("/");

  return <AdminShell>{children}</AdminShell>;
}
