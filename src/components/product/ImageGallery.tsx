import { useState } from "react";
import { cn } from "@/utils/cn";

export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-2xl bg-bg-2">
        <img src={images[active]} alt={alt} className="h-full w-full object-cover" />
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "aspect-square overflow-hidden rounded-xl border-2 transition-colors",
                i === active ? "border-accent" : "border-transparent hover:border-border",
              )}
            >
              <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
