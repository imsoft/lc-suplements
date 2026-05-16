"use client";

import { useId, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { EyeIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

export type PasswordInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
>;

export function PasswordInput({ className, id, disabled, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <div className="relative">
      <input
        id={inputId}
        type={visible ? "text" : "password"}
        disabled={disabled}
        className={cn(
          "w-full rounded border border-input bg-background py-2 pl-3 pr-10 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => setVisible((v) => !v)}
        className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        aria-pressed={visible}
      >
        <HugeiconsIcon icon={visible ? ViewOffIcon : EyeIcon} size={18} />
      </button>
    </div>
  );
}
