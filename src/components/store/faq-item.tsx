"use client";

import { useState } from "react";

interface FaqItemProps {
  q: string;
  a: string;
}

export function FaqItem({ q, a }: FaqItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="border border-border transition-colors duration-300"
      style={{ borderColor: open ? "color-mix(in oklch, var(--color-primary) 40%, transparent)" : undefined }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-bold uppercase tracking-wide transition-colors duration-200 hover:text-primary"
        style={{ color: open ? "var(--color-primary)" : undefined }}
      >
        <span>{q}</span>
        <span
          className="shrink-0 text-2xl font-black text-primary"
          style={{
            display: "inline-block",
            transition: "transform 450ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          +
        </span>
      </button>

      {/* Animated height container: la fila del grid pasa de 0fr a 1fr */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 450ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div style={{ minHeight: 0, overflow: "hidden" }}>
          <div className="border-t border-border px-6 py-5">
            <p
              className="leading-relaxed text-muted-foreground"
              style={{
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(10px)",
                transition: open
                  ? "opacity 350ms ease 120ms, transform 350ms ease 120ms"
                  : "opacity 150ms ease, transform 150ms ease",
              }}
            >
              {a}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
