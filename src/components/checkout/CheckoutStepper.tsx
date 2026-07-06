import { cn } from "@/utils/cn";
import { CHECKOUT_STEPS } from "@/constants/checkout";

export function CheckoutStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center">
      {CHECKOUT_STEPS.map((step, i) => {
        const num = i + 1;
        const isActive = num === currentStep;
        const isDone = num < currentStep;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors",
                  isActive || isDone ? "bg-accent text-accent-fg" : "border border-border bg-bg-2 text-fg-muted",
                )}
              >
                {num}
              </span>
              <span className={cn("text-xs font-semibold", isActive ? "text-fg" : "text-fg-muted")}>{step}</span>
            </div>
            {i < CHECKOUT_STEPS.length - 1 && (
              <span className="mx-4 mb-5 h-px w-12 border-t border-dashed border-border sm:w-20" />
            )}
          </div>
        );
      })}
    </div>
  );
}
