"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/utils/cn";

export function VehicleGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  return (
    <div>
      <button
        type="button"
        className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-border bg-muted-bg focus-ring"
        onClick={() => setZoomed((value) => !value)}
        aria-label={zoomed ? "Zoom out image" : "Zoom in image"}
      >
        <Image
          src={images[active] || images[0]}
          alt={`${name} photo ${active + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className={cn(
            "object-cover transition duration-500",
            zoomed ? "scale-125 cursor-zoom-out" : "cursor-zoom-in",
          )}
        />
      </button>
      <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
        {images.map((image, index) => (
          <button
            key={image + index}
            type="button"
            onClick={() => {
              setActive(index);
              setZoomed(false);
            }}
            className={cn(
              "relative aspect-[4/3] overflow-hidden rounded-xl border focus-ring",
              active === index ? "border-secondary" : "border-border",
            )}
            aria-label={`Show image ${index + 1}`}
          >
            <Image src={image} alt="" fill sizes="120px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
