// Single source of truth for currency formatting — every price/total in the
// app is AUD, always shown with the "A$" prefix (never bare "$").
export function formatCurrency(value: number): string {
  return `A$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
