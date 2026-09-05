import { useImageZoom } from "@/hooks/useImageZoom";

interface Props {
  src: string;
  alt: string;
}

/** Main product image: zooms in on hover and pans toward the cursor as it moves. */
export function HoverZoomImage({ src, alt }: Props) {
  const { isZoomed, enter, leave, handleMouseMove, style } = useImageZoom();

  return (
    <div
      className="h-full w-full cursor-zoom-in overflow-hidden"
      onMouseEnter={enter}
      onMouseLeave={leave}
      onMouseMove={handleMouseMove}
    >
      <img
        src={src}
        alt={alt}
        style={style}
        className={`h-full w-full object-contain transition-transform duration-150 ${
          isZoomed ? "cursor-zoom-out" : ""
        }`}
      />
    </div>
  );
}
