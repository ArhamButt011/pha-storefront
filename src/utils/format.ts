/** Zero-padded two-digit number, e.g. 4 -> "04". */
export function padTwo(n: number) {
  return String(n).padStart(2, "0");
}

/** True for absolute http(s) links, which leave the SPA via a plain <a>. */
export function isExternalUrl(url: string) {
  return /^https?:\/\//.test(url);
}

/** "28 Nov 2026" in Australian order. */
export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
}
