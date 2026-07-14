import { useState } from "react";
import { ZoomIn } from "lucide-react";
import { cn } from "@/utils/cn";
import { ImageLightbox } from "./ImageLightbox";

export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <div className="flex gap-4">
      {images.length > 1 && (
        <div className="flex w-20 shrink-0 flex-col gap-3">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "aspect-square overflow-hidden rounded-xl border-2 bg-bg-2 transition-colors",
                i === active ? "border-accent" : "border-transparent hover:border-border",
              )}
            >
              <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      <div className="relative flex-1 aspect-square overflow-hidden rounded-2xl bg-bg-2">
        <img src={images[active]} alt={alt} className="h-full w-full object-cover" />
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-bg/80 text-fg backdrop-blur transition-colors hover:bg-bg"
          aria-label="Open full image view"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          images={images}
          activeIndex={active}
          alt={alt}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setActive}
        />
      )}
    </div>
  );
}