"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { SiteLogo } from "@/components/brand/site-logo";
import {
  DashboardSquare01Icon,
  Package01Icon,
  ShoppingCart02Icon,
  Tag01Icon,
  TruckIcon,
  UserMultiple02Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: DashboardSquare01Icon },
  { href: "/admin/products", label: "Productos", icon: Package01Icon },
  { href: "/admin/categories", label: "Categorías", icon: Tag01Icon },
  { href: "/admin/orders", label: "Pedidos", icon: ShoppingCart02Icon },
  { href: "/admin/shipping", label: "Envíos", icon: TruckIcon },
  { href: "/admin/users", label: "Clientes", icon: UserMultiple02Icon },
];

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ mobileOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <aside className="flex h-full w-60 flex-col border-r border-border bg-secondary">
      <div className="flex h-16 items-center justify-between border-b border-border px-6">
        <SiteLogo
          variant="horizontal"
          tone="dark"
          href="/"
          className="h-8 max-w-[140px]"
        />
        {onClose && (
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground lg:hidden">
            <HugeiconsIcon icon={Cancel01Icon} size={20} />
          </button>
        )}
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {NAV_ITEMS.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 rounded px-3 py-2 text-sm font-medium transition-colors",
              pathname === href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <HugeiconsIcon icon={icon} size={18} />
            {label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-border p-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          ← Ver tienda
        </Link>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop: siempre visible */}
      <div className="hidden lg:flex lg:w-60 lg:flex-col lg:shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile: overlay deslizable */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-60 lg:hidden">
            {sidebarContent}
          </div>
        </>
      )}
    </>
  );
}
