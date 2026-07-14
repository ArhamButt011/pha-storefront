import { Maximize, Minimize, X, ZoomIn, ZoomOut } from "lucide-react";

interface Props {
  current: number;
  total: number;
  isZoomed: boolean;
  onToggleZoom: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onClose: () => void;
}

export function LightboxHeader({
  current,
  total,
  isZoomed,
  onToggleZoom,
  isFullscreen,
  onToggleFullscreen,
  onClose,
}: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm text-white/70">
      <span>
        {current} / {total}
      </span>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleZoom}
          className="hover:text-white"
          aria-label={isZoomed ? "Zoom out" : "Zoom in"}
          aria-pressed={isZoomed}
        >
          {isZoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
        </button>
        <button
          type="button"
          onClick={onToggleFullscreen}
          className="hover:text-white hidden sm:block"
          aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          aria-pressed={isFullscreen}
        >
          {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
        </button>
        <button type="button" onClick={onClose} className="hover:text-white" aria-label="Close">
          <X className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}