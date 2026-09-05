import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  direction: "prev" | "next";
  onClick: () => void;
}

export function LightboxNavButton({ direction, onClick }: Props) {
  const isPrev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute top-1/2 z-10 -translate-y-1/2 rounded-full p-2 text-white/60 hover:text-white ${
        isPrev ? "left-2 sm:left-6" : "right-2 sm:right-6"
      }`}
      aria-label={isPrev ? "Previous image" : "Next image"}
    >
      {isPrev ? <ChevronLeft className="h-8 w-8" /> : <ChevronRight className="h-8 w-8" />}
    </button>
  );
}