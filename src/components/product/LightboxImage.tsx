import type { CSSProperties, MouseEvent } from "react";

interface Props {
  src: string;
  alt: string;
  isZoomed: boolean;
  style?: CSSProperties;
  onToggleZoom: () => void;
  onMouseMove: (e: MouseEvent<HTMLDivElement>) => void;
}

export function LightboxImage({ src, alt, isZoomed, style, onToggleZoom, onMouseMove }: Props) {
  return (
    <div
      className="relative inline-flex max-h-full max-w-full overflow-hidden rounded-lg"
      onClick={onToggleZoom}
      onMouseMove={onMouseMove}
    >
      <img
        src={src}
        alt={alt}
        style={style}
        className={`max-h-full max-w-full object-contain transition-transform duration-150 ${
          isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
        }`}
      />
    </div>
  );
}