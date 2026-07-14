import { useCallback, useEffect, useState, type RefObject } from "react";

export function useFullscreen(
  ref: RefObject<HTMLElement | null>
) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function handleChange() {
      setIsFullscreen(document.fullscreenElement === ref.current);
    }

    document.addEventListener("fullscreenchange", handleChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleChange);

      if (document.fullscreenElement === ref.current) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [ref]);

  const toggle = useCallback(async () => {
    if (!ref.current) return;

    if (document.fullscreenElement === ref.current) {
      await document.exitFullscreen();
    } else {
      await ref.current.requestFullscreen();
    }
  }, [ref]);

  return { isFullscreen, toggle };
}