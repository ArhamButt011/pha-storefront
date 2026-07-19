export interface SpecCellProps {
  label: string;
  value: string;
}

// Shared label/value cell used by TechnicalSpecifications and
// PartIdentifiers so both spec-style cards render identically.
export function SpecCell({ label, value }: SpecCellProps) {
  return (
    <div className="py-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-fg-muted">{label}</p>
      <p className="mt-1 font-semibold text-fg">{value}</p>
    </div>
  );
}
