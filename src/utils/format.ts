/** Zero-padded two-digit number, e.g. 4 -> "04". */
export function padTwo(n: number) {
  return String(n).padStart(2, "0");
}

/** True for absolute http(s) links, which leave the SPA via a plain <a>. */
export function isExternalUrl(url: string) {
  return /^https?:\/\//.test(url);
}
