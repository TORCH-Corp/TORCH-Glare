const nf = new Intl.NumberFormat("en-US", { maximumFractionDigits: 20 });

/** Format a number with thousands separators (e.g. 1299 → "1,299"). Blank for empty. */
export function formatNumber(value: unknown): string {
  if (value == null || value === "") return "";
  const n = typeof value === "number" ? value : Number(String(value).replace(/,/g, ""));
  return Number.isNaN(n) ? "" : nf.format(n);
}

/** Parse a possibly comma-formatted string to a number (or undefined when blank). */
export function parseNumber(raw: string): number | undefined {
  const cleaned = raw.replace(/,/g, "").trim();
  if (cleaned === "" || cleaned === "-" || cleaned === ".") return undefined;
  const n = Number(cleaned);
  return Number.isNaN(n) ? undefined : n;
}
