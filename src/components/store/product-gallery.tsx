"use client";

import { useState } from "react";
import { CldImage } from "next-cloudinary";

interface ProductGalleryProps {
  images: { publicId: string; url: string; alt: string | null }[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded border border-border bg-muted text-muted-foreground">
        Sin imagen
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded border border-border bg-muted">
        <CldImage
          src={images[selected].publicId}
          alt={images[selected].alt ?? productName}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.publicId}
              onClick={() => setSelected(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded border-2 transition-colors ${
                i === selected ? "border-primary" : "border-border"
              }`}
            >
              <CldImage
                src={img.publicId}
                alt={img.alt ?? productName}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
