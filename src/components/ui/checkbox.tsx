import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/utils/cn";

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ className, ...props }, ref) {
    return (
      <span className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center">
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            "peer h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-xs border border-border bg-bg-2 transition",
            "checked:border-accent checked:bg-accent",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        />
        <Check className="pointer-events-none absolute h-3 w-3 text-accent-fg opacity-0 peer-checked:opacity-100" />
      </span>
    );
  },
);
