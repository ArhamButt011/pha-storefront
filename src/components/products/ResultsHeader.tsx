import { Select } from "@/components/ui/select";

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest Arrival" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

interface ResultsHeaderProps {
  count: number;
  sort: string;
  onSortChange: (value: string) => void;
}

export function ResultsHeader({ count, sort, onSortChange }: ResultsHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-fg-muted">
        Showing <span className="font-semibold text-fg">{count}</span> Performance Parts
      </p>
      <div className="flex items-center gap-2">
        <span className="text-sm text-fg-muted">Sort By:</span>
        <Select value={sort} onChange={(e) => onSortChange(e.target.value)} className="w-48 py-2">
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
      </div>
    </div>
  );
}
