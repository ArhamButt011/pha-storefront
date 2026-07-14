import { useCallback, useState, type CSSProperties, type MouseEvent } from "react";

/**
 * Click-to-magnify zoom for a single image. While zoomed, mouse movement
 * pans the magnified area toward the cursor by shifting the CSS
 * transform-origin, rather than staying centered on a fixed point.
 */
export function useImageZoom(scale = 2.5) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const toggle = useCallback(() => setIsZoomed((z) => !z), []);
  const reset = useCallback(() => setIsZoomed(false), []);

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (!isZoomed) return;
      const rect = e.currentTarget.getBoundingClientRect();
      setOrigin({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    },
    [isZoomed],
  );

  const style: CSSProperties | undefined = isZoomed
    ? { transform: `scale(${scale})`, transformOrigin: `${origin.x}% ${origin.y}%` }
    : undefined;

  return { isZoomed, toggle, reset, handleMouseMove, style };
}