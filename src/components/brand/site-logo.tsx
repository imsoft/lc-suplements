"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LOGOS } from "@/lib/logos";

export type SiteLogoProps = {
  variant?: "horizontal" | "mark";
  /** Fondo claro u oscuro, o ambos según `.dark` en el árbol. */
  tone?: "light" | "dark" | "adaptive";
  className?: string;
  /** Por defecto enlaza al inicio; `null` sin enlace. */
  href?: string | null;
  priority?: boolean;
};

function logoSrc(
  variant: "horizontal" | "mark",
  tone: "light" | "dark",
): string {
  if (variant === "horizontal") {
    return tone === "light" ? LOGOS.horizontalOnLight : LOGOS.horizontalOnDark;
  }
  return tone === "light" ? LOGOS.markOnLight : LOGOS.markOnDark;
}

export function SiteLogo({
  variant = "horizontal",
  tone = "adaptive",
  className,
  href = "/",
  priority = false,
}: SiteLogoProps) {
  const isHorizontal = variant === "horizontal";
  const w = isHorizontal ? 560 : 160;
  const h = isHorizontal ? 160 : 160;
  const imgClass = cn(
    isHorizontal ? "h-9 w-auto max-w-[min(220px,52vw)]" : "h-10 w-10",
    className,
  );

  const inner =
    tone === "adaptive" ? (
      <>
        <Image
          src={logoSrc(variant, "light")}
          alt="LC Suplements"
          width={w}
          height={h}
          className={cn(imgClass, "dark:hidden")}
          priority={priority}
        />
        <Image
          src={logoSrc(variant, "dark")}
          alt="LC Suplements"
          width={w}
          height={h}
          className={cn(imgClass, "hidden dark:block")}
          priority={false}
        />
      </>
    ) : (
      <Image
        src={logoSrc(variant, tone)}
        alt="LC Suplements"
        width={w}
        height={h}
        className={imgClass}
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
