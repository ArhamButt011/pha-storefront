import * as React from "react";
import ReactSelect from "react-select";
import { cn } from "@/utils/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  options: SelectOption[];
  className?: string;
  /** Max height (px) of the dropdown menu before it scrolls. */
  maxMenuHeight?: number;
  /** Whether typing filters the options. Defaults to true; set false for short, fixed lists like sort order. */
  isSearchable?: boolean;
}

// react-select ships unstyled-friendly `classNames` (v5.7+) so we can theme
// it entirely with Tailwind instead of the `styles` object. This keeps it
// visually identical to the old native/Radix versions.
export const Select = React.memo(function Select({
  value,
  onValueChange,
  placeholder = "Select...",
  disabled,
  options = [],
  className,
  maxMenuHeight = 240, // ~15rem, matches previous dropdown cap
  isSearchable = true,
}: SelectProps) {
  const selected = React.useMemo(
    () => options.find((o) => o.value === value) ?? null,
    [options, value],
  );

  return (
    <ReactSelect<SelectOption, false>
      value={selected}
      onChange={(opt) => onValueChange?.(opt ? opt.value : "")}
      options={options}
      placeholder={placeholder}
      isDisabled={disabled}
      isSearchable={isSearchable}
      unstyled
      menuPlacement="auto" // handles the flip-up/flip-down correctly
      maxMenuHeight={maxMenuHeight} // built-in scroll, no custom scroll logic needed
      classNamePrefix="rs"
      className={className}
      classNames={{
        control: (state) =>
          cn(
            "flex w-full items-center rounded-lg border border-border bg-bg-2 px-3 py-1.5 text-sm text-fg transition",
            state.isFocused && "border-accent/60 ring-2 ring-accent/20",
            state.isDisabled && "cursor-not-allowed opacity-50",
          ),
        placeholder: () => "text-fg-muted",
        singleValue: () => "text-fg",
        input: () => "text-fg",
        indicatorSeparator: () => "hidden",
        dropdownIndicator: () => "text-fg-muted",
        menu: () =>
          "z-50 mt-1 overflow-hidden rounded-lg border border-border bg-bg-2 shadow-lg",
        menuList: () => "p-1",
        option: (state) =>
          cn(
            "cursor-pointer select-none rounded-md px-3 py-2 text-sm",
            state.isSelected && "font-semibold text-fg bg-accent/10",
            !state.isSelected && state.isFocused && "bg-accent/15 text-fg",
            !state.isSelected && !state.isFocused && "text-fg",
          ),
        noOptionsMessage: () => "px-3 py-2 text-sm text-fg-muted",
      }}
    />
  );
});