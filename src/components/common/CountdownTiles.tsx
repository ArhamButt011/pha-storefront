import { useCountdown } from "@/hooks/useCountdown";
import { cn } from "@/utils/cn";
import { padTwo } from "@/utils/format";

interface CountdownTilesProps {
  endsAt: string | null;
  size?: "sm" | "md";
  className?: string;
}

/** DD : HH : MM : SS tiles, renders nothing before mount or with no end. */
export function CountdownTiles({ endsAt, size = "md", className }: CountdownTilesProps) {
  const left = useCountdown(endsAt);
  if (!left || left.expired) return null;
  const units = [
    { label: "Days", value: left.days },
    { label: "Hrs", value: left.hours },
    { label: "Min", value: left.minutes },
    { label: "Sec", value: left.seconds },
  ];
  return (
    <div className={cn("flex items-center", size === "sm" ? "gap-1" : "gap-1.5", className)} role="timer" aria-live="off">
      {units.map((u, i) => (
        <div key={u.label} className="flex items-center gap-1">
          {i > 0 && <span className={cn("font-black opacity-60", size === "sm" ? "text-xs" : "text-lg")}>:</span>}
          <div
            className={cn(
              "flex flex-col items-center rounded-md bg-scrim/35 font-display tabular-nums backdrop-blur-sm",
              size === "sm" ? "min-w-8 px-1.5 py-0.5" : "min-w-12 px-2 py-1.5",
            )}
          >
            <span className={cn("font-black leading-none text-on-media", size === "sm" ? "text-xs" : "text-xl")}>{padTwo(u.value)}</span>
            {size === "md" && <span className="mt-1 text-xs font-semibold uppercase tracking-widest text-on-media/70">{u.label}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
