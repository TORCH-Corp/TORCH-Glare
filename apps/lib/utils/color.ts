/**
 * Pure color-math helpers for the `ColorPicker` component (and anything else that
 * needs to move between hex, RGB, HSV and HSL). No dependencies, no DOM — safe to
 * unit-test and to import on the server.
 *
 * Conventions:
 *  - `RGBA` channels are 0–255 (`r`,`g`,`b`) and 0–1 (`a`).
 *  - `HSV`/`HSL` use `h` 0–360, everything else 0–100.
 *  - Hex output is uppercase, `#rrggbb` when fully opaque and `#rrggbbaa` otherwise.
 */

export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface HSV {
  h: number;
  s: number;
  v: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

/** Clamp `n` into the inclusive `[min, max]` range. */
export function clamp(n: number, min: number, max: number): number {
  return n < min ? min : n > max ? max : n;
}

/** Round to `digits` decimal places (default 0). */
export function round(n: number, digits = 0): number {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}

const toHex2 = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");

/**
 * Parse a hex color into `RGBA`. Accepts `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`
 * with or without the leading `#`. Returns `null` for anything unparseable.
 */
export function parseHex(input: string): RGBA | null {
  if (typeof input !== "string") return null;
  let hex = input.trim().replace(/^#/, "");

  // Expand shorthand (#rgb / #rgba → #rrggbb(aa)).
  if (hex.length === 3 || hex.length === 4) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }

  if (hex.length !== 6 && hex.length !== 8) return null;
  if (!/^[0-9a-fA-F]+$/.test(hex)) return null;

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
  return { r, g, b, a: round(a, 2) };
}

/** Format `RGBA` as an uppercase hex string — `#rrggbb` if opaque, else `#rrggbbaa`. */
export function formatHex({ r, g, b, a }: RGBA): string {
  const base = `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`.toUpperCase();
  if (a >= 1) return base;
  return `${base}${toHex2(clamp(a, 0, 1) * 255).toUpperCase()}`;
}

/** RGB (0–255) → HSV (h 0–360, s/v 0–100). Alpha is carried through unchanged elsewhere. */
export function rgbToHsv({ r, g, b }: { r: number; g: number; b: number }): HSV {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;

  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  // Keep 2 decimals: HSV is the picker's internal state, so rounding to whole degrees/percents
  // here would visibly shift a color that was only ever passed in (e.g. #10B981 → #11BA82).
  return { h: round(h, 2), s: round(s * 100, 2), v: round(max * 100, 2) };
}

/** HSV (h 0–360, s/v 0–100) → RGB (0–255). */
export function hsvToRgb({ h, s, v }: HSV): { r: number; g: number; b: number } {
  const hn = ((h % 360) + 360) % 360;
  const sn = clamp(s, 0, 100) / 100;
  const vn = clamp(v, 0, 100) / 100;

  const c = vn * sn;
  const x = c * (1 - Math.abs(((hn / 60) % 2) - 1));
  const m = vn - c;

  let rp = 0;
  let gp = 0;
  let bp = 0;
  if (hn < 60) [rp, gp, bp] = [c, x, 0];
  else if (hn < 120) [rp, gp, bp] = [x, c, 0];
  else if (hn < 180) [rp, gp, bp] = [0, c, x];
  else if (hn < 240) [rp, gp, bp] = [0, x, c];
  else if (hn < 300) [rp, gp, bp] = [x, 0, c];
  else [rp, gp, bp] = [c, 0, x];

  return {
    r: round((rp + m) * 255),
    g: round((gp + m) * 255),
    b: round((bp + m) * 255),
  };
}

/** RGB (0–255) → HSL (h 0–360, s/l 0–100). */
export function rgbToHsl({ r, g, b }: { r: number; g: number; b: number }): HSL {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h: round(h), s: round(s * 100), l: round(l * 100) };
}

/** HSL (h 0–360, s/l 0–100) → RGB (0–255). */
export function hslToRgb({ h, s, l }: HSL): { r: number; g: number; b: number } {
  const hn = ((h % 360) + 360) % 360;
  const sn = clamp(s, 0, 100) / 100;
  const ln = clamp(l, 0, 100) / 100;

  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((hn / 60) % 2) - 1));
  const m = ln - c / 2;

  let rp = 0;
  let gp = 0;
  let bp = 0;
  if (hn < 60) [rp, gp, bp] = [c, x, 0];
  else if (hn < 120) [rp, gp, bp] = [x, c, 0];
  else if (hn < 180) [rp, gp, bp] = [0, c, x];
  else if (hn < 240) [rp, gp, bp] = [0, x, c];
  else if (hn < 300) [rp, gp, bp] = [x, 0, c];
  else [rp, gp, bp] = [c, 0, x];

  return {
    r: round((rp + m) * 255),
    g: round((gp + m) * 255),
    b: round((bp + m) * 255),
  };
}
