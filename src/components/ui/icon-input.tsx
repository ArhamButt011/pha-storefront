import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Input, type InputProps } from "@/components/ui/input";
import { cn } from "@/utils/cn";

export interface IconInputProps extends InputProps {
  icon: LucideIcon;
}

export const IconInput = React.forwardRef<HTMLInputElement, IconInputProps>(
  function IconInput({ icon: Icon, className, ...props }, ref) {
    return (
      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
        <Input ref={ref} className={cn("pl-11", className)} {...props} />
      </div>
    );
  },
);
