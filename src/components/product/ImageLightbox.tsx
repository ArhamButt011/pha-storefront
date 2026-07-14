import { useCallback, useEffect, useRef } from "react";
import { useFullscreen } from "@/hooks/useFullscreen";
import { useImageZoom } from "@/hooks/useImageZoom";
import { LightboxHeader } from "./LightboxHeader";
import { LightboxImage } from "./LightboxImage";
import { LightboxNavButton } from "./LightboxNavButton";

interface ImageLightboxProps {
  images: string[];
  activeIndex: number;
  alt: string;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function ImageLightbox({ images, activeIndex, alt, onClose, onNavigate }: ImageLightboxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(containerRef);
  const { isZoomed, toggle: toggleZoom, reset: resetZoom, handleMouseMove, style: zoomStyle } = useImageZoom();

  const goPrev = useCallback(() => {
    onNavigate(activeIndex === 0 ? images.length - 1 : activeIndex - 1);
  }, [activeIndex, images.length, onNavigate]);

  const goNext = useCallback(() => {
    onNavigate(activeIndex === images.length - 1 ? 0 : activeIndex + 1);
  }, [activeIndex, images.length, onNavigate]);

  // A stale zoom/pan carrying over to the next image reads as a bug, so
  // drop it whenever the active image changes.
  useEffect(() => {
    resetZoom();
  }, [activeIndex, resetZoom]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, goPrev, goNext]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] flex flex-col bg-black/95">
      <LightboxHeader
        current={activeIndex + 1}
        total={images.length}
        isZoomed={isZoomed}
        onToggleZoom={toggleZoom}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onClose={onClose}
      />

      <div className="relative flex flex-1 items-center justify-center px-4 pb-4 overflow-hidden">
        {images.length > 1 && <LightboxNavButton direction="prev" onClick={goPrev} />}

        <LightboxImage
          src={images[activeIndex]}
          alt={alt}
          isZoomed={isZoomed}
          style={zoomStyle}
          onToggleZoom={toggleZoom}
          onMouseMove={handleMouseMove}
        />

        {images.length > 1 && <LightboxNavButton direction="next" onClick={goNext} />}
      </div>

      {alt && <p className="pb-4 text-center text-sm text-white/60">{alt}</p>}
    </div>
  );
}