"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LOGOS } from "@/lib/logos";

export type SiteLogoProps = {
  /** Mantenidos por compatibilidad con los usos existentes; el logo es único. */
  variant?: "horizontal" | "mark";
  tone?: "light" | "dark" | "adaptive";
  className?: string;
  /** Por defecto enlaza al inicio; `null` sin enlace. */
  href?: string | null;
  priority?: boolean;
};

export function SiteLogo({
  className,
  href = "/",
  priority = false,
}: SiteLogoProps) {
  const inner = (
    <Image
      src={LOGOS.logo}
      alt="LC Suplements"
      width={512}
      height={512}
      className={cn("h-10 w-auto", className)}
      priority={priority}
    />
  );

  const wrapClass = "inline-flex shrink-0 items-center";

  if (href === null) {
    return <span className={wrapClass}>{inner}</span>;
  }

  return (
    <Link href={href} className={wrapClass}>
      {inner}
    </Link>
  );
}
