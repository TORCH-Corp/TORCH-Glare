import { describe, expect, it } from "vitest";
import {
  clamp,
  formatHex,
  hslToRgb,
  hsvToRgb,
  parseHex,
  rgbToHsl,
  rgbToHsv,
  round,
} from "@/utils/color";

describe("color: clamp / round", () => {
  it("clamps into range", () => {
    expect(clamp(-5, 0, 100)).toBe(0);
    expect(clamp(150, 0, 100)).toBe(100);
    expect(clamp(50, 0, 100)).toBe(50);
  });
  it("rounds to digits", () => {
    expect(round(1.2345, 2)).toBe(1.23);
    expect(round(1.9)).toBe(2);
  });
});

describe("color: parseHex", () => {
  it("parses 6-digit hex (with and without #)", () => {
    expect(parseHex("#3B82F6")).toEqual({ r: 59, g: 130, b: 246, a: 1 });
    expect(parseHex("3b82f6")).toEqual({ r: 59, g: 130, b: 246, a: 1 });
  });
  it("expands 3-digit shorthand", () => {
    expect(parseHex("#0f0")).toEqual({ r: 0, g: 255, b: 0, a: 1 });
  });
  it("parses 8-digit hex with alpha", () => {
    const c = parseHex("#3B82F680");
    expect(c).toMatchObject({ r: 59, g: 130, b: 246 });
    expect(c?.a).toBeCloseTo(0.5, 1);
  });
  it("returns null for garbage", () => {
    expect(parseHex("nope")).toBeNull();
    expect(parseHex("#12")).toBeNull();
    expect(parseHex("#zzzzzz")).toBeNull();
  });
});

describe("color: formatHex", () => {
  it("emits #rrggbb when opaque", () => {
    expect(formatHex({ r: 59, g: 130, b: 246, a: 1 })).toBe("#3B82F6");
  });
  it("promotes to #rrggbbaa when translucent", () => {
    expect(formatHex({ r: 59, g: 130, b: 246, a: 0.5 })).toBe("#3B82F680");
  });
  it("round-trips parse → format for opaque and alpha", () => {
    for (const hex of ["#000000", "#FFFFFF", "#3B82F6", "#3B82F680"]) {
      expect(formatHex(parseHex(hex)!)).toBe(hex);
    }
  });
});

// HSV/HSL are rounded to integers, so a round-trip can drift by a couple of 0-255 units.
const near = (got: number, want: number, tol = 3) =>
  expect(Math.abs(got - want)).toBeLessThanOrEqual(tol);

describe("color: hsv conversions", () => {
  it("round-trips rgb → hsv → rgb for primaries", () => {
    for (const rgb of [
      { r: 255, g: 0, b: 0 },
      { r: 0, g: 255, b: 0 },
      { r: 0, g: 0, b: 255 },
      { r: 59, g: 130, b: 246 },
      { r: 128, g: 128, b: 128 },
    ]) {
      const back = hsvToRgb(rgbToHsv(rgb));
      near(back.r, rgb.r);
      near(back.g, rgb.g);
      near(back.b, rgb.b);
    }
  });
  it("maps pure red to hue 0, full sat/val", () => {
    expect(rgbToHsv({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, v: 100 });
  });
});

describe("color: hsl conversions", () => {
  it("round-trips rgb → hsl → rgb", () => {
    for (const rgb of [
      { r: 255, g: 0, b: 0 },
      { r: 59, g: 130, b: 246 },
      { r: 16, g: 185, b: 129 },
    ]) {
      const back = hslToRgb(rgbToHsl(rgb));
      near(back.r, rgb.r);
      near(back.g, rgb.g);
      near(back.b, rgb.b);
    }
  });
});
