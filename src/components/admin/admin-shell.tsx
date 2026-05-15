"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon } from "@hugeicons/core-free-icons";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Barra superior móvil */}
        <header className="flex h-16 items-center gap-4 border-b border-border bg-background px-4 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <HugeiconsIcon icon={Menu01Icon} size={22} />
          </button>
          <span className="font-bold tracking-widest text-primary uppercase text-sm">
            LC Admin
          </span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
