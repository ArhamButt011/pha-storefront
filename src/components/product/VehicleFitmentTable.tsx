import type { VehicleFitmentRow } from "@/data/products";

export function VehicleFitmentTable({ fitments }: { fitments: VehicleFitmentRow[] }) {
  if (fitments.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="text-lg font-bold text-fg">Vehicle Fitment</h3>
      <div className="mt-1 h-0.5 w-10 bg-accent" />

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-2">
              {["Make", "Model", "Series", "Year Range"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-accent"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fitments.map((row, i) => (
              <tr key={i} className="border-b border-border last:border-0 even:bg-bg-2/40">
                <td className="px-5 py-3.5 font-medium text-fg">{row.make}</td>
                <td className="px-5 py-3.5 text-fg-muted">{row.model}</td>
                <td className="px-5 py-3.5 font-mono text-xs text-fg-muted">{row.series}</td>
                <td className="px-5 py-3.5 text-fg-muted">{row.yearRange}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
