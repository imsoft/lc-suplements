import { db } from "@/lib/db";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Clientes | LC Admin" };

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Clientes ({users.length})</h1>

      <div className="rounded border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nombre</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Correo</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Rol</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Pedidos</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Registro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`rounded px-2 py-0.5 text-xs font-medium ${
                    user.role === "ADMIN"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{user._count.orders}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString("es-MX")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
