import * as React from "react";
import ReactSelect from "react-select";
import { cn } from "@/utils/cn";
import { SELECT_MENU_PORTAL_PROPS } from "@/components/ui/select-shared";
import type { SelectOption } from "@/components/ui/select";

export interface MultiSelectProps {
  value?: string[];
  onValueChange?: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  options: SelectOption[];
  className?: string;
  /** Max height (px) of the dropdown menu before it scrolls. */
  maxMenuHeight?: number;
  /** Whether typing filters the options. Defaults to true. */
  isSearchable?: boolean;
}

// Multi-value counterpart to <Select> — same theming and the same
// portal/z-index/pointer-events fixes (shared via select-shared.ts), plus
// removable chips for each selected value instead of a single value.
export const MultiSelect = React.memo(function MultiSelect({
  value = [],
  onValueChange,
  placeholder = "Select...",
  disabled,
  options = [],
  className,
  maxMenuHeight = 240,
  isSearchable = true,
}: MultiSelectProps) {
  const selected = React.useMemo(
    () => options.filter((o) => value.includes(o.value)),
    [options, value],
  );

  return (
    <ReactSelect<SelectOption, true>
      isMulti
      value={selected}
      onChange={(opts) => onValueChange?.(opts ? opts.map((o) => o.value) : [])}
      options={options}
      placeholder={placeholder}
      isDisabled={disabled}
      isSearchable={isSearchable}
      closeMenuOnSelect={false}
      blurInputOnSelect={false}
      unstyled
      menuPlacement="auto"
      {...SELECT_MENU_PORTAL_PROPS}
      maxMenuHeight={maxMenuHeight}
      classNamePrefix="rs"
      className={className}
      classNames={{
        control: (state) =>
          cn(
            "flex w-full flex-wrap items-center gap-1.5 rounded-lg border border-border bg-bg-2 px-3 py-1.5 text-sm text-fg transition",
            state.isFocused && "border-accent/60 ring-2 ring-accent/20",
            state.isDisabled && "cursor-not-allowed opacity-50",
          ),
        placeholder: () => "text-fg-muted",
        input: () => "text-fg",
        indicatorSeparator: () => "hidden",
        dropdownIndicator: () => "text-fg-muted",
        menu: () => "overflow-hidden rounded-lg border border-border bg-bg-2 shadow-lg",
        menuList: () => "p-1",
        option: (state) =>
          cn(
            "cursor-pointer select-none rounded-md px-3 py-2 text-sm",
            state.isSelected && "font-semibold text-fg bg-accent/10",
            !state.isSelected && state.isFocused && "bg-accent/15 text-fg",
            !state.isSelected && !state.isFocused && "text-fg",
          ),
        noOptionsMessage: () => "px-3 py-2 text-sm text-fg-muted",
        multiValue: () => "flex items-center gap-1 rounded-md bg-bg-3 py-0.5 pl-2 pr-1 text-xs text-fg",
        multiValueLabel: () => "text-xs text-fg",
        multiValueRemove: () =>
          "cursor-pointer rounded-sm text-fg-muted transition-colors hover:bg-danger/20 hover:text-danger",
      }}
    />
  );
});
