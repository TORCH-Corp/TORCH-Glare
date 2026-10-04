import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Cell } from "@/components/DataViews";
import type { FieldConfig } from "@/utils/dataViews/types";

/**
 * `enum-badge` paints the value as a badge. Until `labels` existed the badge text *was* the stored
 * value, so a Dutch or Arabic UI still showed "Shipped" — there was no seam between what the data
 * says and what the user reads. `labels` is that seam, and these tests pin both sides of it: the
 * fallback has to stay byte-for-byte what it always was, or every existing config changes.
 */
describe("Cell · enum-badge labels", () => {
  const field = (extra: Partial<FieldConfig> = {}): FieldConfig => ({
    path: "status",
    type: "enum-badge",
    variants: { Pending: "yellow", Shipped: "blue" },
    ...extra,
  });

  it("shows the raw value when no labels are given", () => {
    render(<Cell field={field()} row={{ status: "Shipped" }} />);
    expect(screen.getByText("Shipped")).toBeInTheDocument();
  });

  it("shows the mapped label instead of the raw value", () => {
    render(
      <Cell
        field={field({ labels: { Pending: "In wachtrij", Shipped: "Verzonden" } })}
        row={{ status: "Shipped" }}
      />,
    );
    expect(screen.getByText("Verzonden")).toBeInTheDocument();
    expect(screen.queryByText("Shipped")).not.toBeInTheDocument();
  });

  it("falls back to the raw value for a key the map does not cover", () => {
    render(
      <Cell field={field({ labels: { Pending: "In wachtrij" } })} row={{ status: "Shipped" }} />,
    );
    expect(screen.getByText("Shipped")).toBeInTheDocument();
  });

  // `labels` and `variants` are keyed the same way but must stay independent: relabelling a value
  // must not silently restyle it.
  it("does not change the badge colour", () => {
    const row = { status: "Shipped" };
    const { container: plain } = render(<Cell field={field()} row={row} />);
    const before = plain.querySelector("span[class]")?.className;

    const { container: labelled } = render(
      <Cell field={field({ labels: { Shipped: "Verzonden" } })} row={row} />,
    );
    const after = labelled.querySelector("span[class]")?.className;

    expect(after).toBe(before);
  });

  it("ignores labels for other field types", () => {
    render(
      <Cell
        field={{ path: "status", type: "text", labels: { Shipped: "Verzonden" } }}
        row={{ status: "Shipped" }}
      />,
    );
    expect(screen.getByText("Shipped")).toBeInTheDocument();
  });
});
