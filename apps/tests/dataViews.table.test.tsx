import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DataViews, useTableView } from "@/components/DataViews";
import type { DynamicRecord, FieldConfig } from "@/components/DataViews";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const ORDERS: DynamicRecord[] = [
  { id: 1, customer: "Acme", total: 1240 },
  { id: 2, customer: "Globex", total: 480 },
  { id: 3, customer: "Initech", total: 99 },
];

const FIELDS: FieldConfig[] = [
  { path: "id", label: "Order #", type: "number" },
  { path: "customer", label: "Customer", type: "text" },
  { path: "total", label: "Total", type: "currency", currency: "USD" },
];

function Root({ children }: { children: React.ReactNode }) {
  return (
    <DataViews.Root data={ORDERS} fields={FIELDS}>
      {children}
    </DataViews.Root>
  );
}

/** Row text in document order, ignoring the header. */
function bodyRowText() {
  const table = screen.getByRole("table");
  const rows = within(table).getAllByRole("row");
  return rows.slice(1).map((r) => r.textContent ?? "");
}

// ─── layer 1: the hook ───────────────────────────────────────────────────────

describe("useTableView", () => {
  it("exposes rows, columns and a sort toggle", () => {
    let api: ReturnType<typeof useTableView> | null = null;

    function Probe() {
      api = useTableView();
      return null;
    }

    render(
      <Root>
        <DataViews.Table>
          <Probe />
        </DataViews.Table>
      </Root>,
    );

    expect(api!.rows.map((r) => r.record.customer)).toEqual(["Acme", "Globex", "Initech"]);
    expect(api!.columns.map((c) => c.path)).toEqual(["id", "customer", "total"]);
    expect(api!.sort.by).toBeNull();
  });

  it("gives a row its identity and selected state", () => {
    let api: ReturnType<typeof useTableView> | null = null;
    function Probe() {
      api = useTableView();
      return null;
    }

    render(
      <Root>
        <DataViews.Table>
          <Probe />
        </DataViews.Table>
      </Root>,
    );

    const props = api!.getRowProps(api!.rows[0]);
    expect(props["data-record-id"]).toBe("1");
    expect(props["aria-selected"]).toBe(false);
  });
});

// ─── layer 2: the primitives ─────────────────────────────────────────────────

describe("Table primitives", () => {
  it("renders a hand-composed table", () => {
    render(
      <Root>
        <DataViews.Table>
          <DataViews.Table.Shell>
            <DataViews.Table.Head>
              <DataViews.Table.SortHeader field="customer" />
              <DataViews.Table.SortHeader field="total" />
            </DataViews.Table.Head>
            <DataViews.Table.Body>
              {(row) => (
                <DataViews.Table.Row record={row}>
                  <DataViews.Table.Cell field="customer" />
                  <DataViews.Table.Cell field="total" />
                </DataViews.Table.Row>
              )}
            </DataViews.Table.Body>
          </DataViews.Table.Shell>
        </DataViews.Table>
      </Root>,
    );

    // Only the two columns we asked for — no id column, no checkboxes.
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(bodyRowText()[0]).toContain("Acme");
    expect(bodyRowText()[0]).not.toContain("Order #");
  });

  it("lets a cell bypass the field renderer", () => {
    render(
      <Root>
        <DataViews.Table>
          <DataViews.Table.Shell>
            <DataViews.Table.Body>
              {(row) => (
                <DataViews.Table.Row record={row}>
                  <DataViews.Table.Cell field="total">
                    {(value) => <span>{`~${value}`}</span>}
                  </DataViews.Table.Cell>
                </DataViews.Table.Row>
              )}
            </DataViews.Table.Body>
          </DataViews.Table.Shell>
        </DataViews.Table>
      </Root>,
    );

    expect(screen.getByText("~1240")).toBeInTheDocument();
    // The currency renderer would have produced "$1,240.00".
    expect(screen.queryByText(/\$1,240/)).not.toBeInTheDocument();
  });

  it("carries aria-sort and sorts on click", async () => {
    const user = userEvent.setup();

    render(
      <Root>
        <DataViews.Table />
      </Root>,
    );

    const header = () => screen.getByRole("columnheader", { name: /total/i });
    expect(header()).toHaveAttribute("aria-sort", "none");

    // The sort affordance is the library's dedicated button inside the header,
    // which now has an accessible name describing what it does.
    await user.click(screen.getByRole("button", { name: /sort by total ascending/i }));
    expect(header()).toHaveAttribute("aria-sort", "ascending");
    expect(bodyRowText()[0]).toContain("Initech"); // 99 first

    await user.click(screen.getByRole("button", { name: /sort by total descending/i }));
    expect(header()).toHaveAttribute("aria-sort", "descending");
    expect(bodyRowText()[0]).toContain("Acme"); // 1240 first
  });

  it("marks a selected row with aria-selected", async () => {
    const user = userEvent.setup();

    render(
      <Root>
        <DataViews.Table />
      </Root>,
    );

    const table = screen.getByRole("table");
    const firstRow = within(table).getAllByRole("row")[1];
    expect(firstRow).toHaveAttribute("aria-selected", "false");

    await user.click(within(firstRow).getByRole("checkbox"));

    expect(within(screen.getByRole("table")).getAllByRole("row")[1]).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("select-all toggles every row, and clears when already full", async () => {
    const user = userEvent.setup();

    render(
      <Root>
        <DataViews.Table />
      </Root>,
    );

    const selectAll = screen.getByRole("checkbox", { name: /select all rows/i });
    await user.click(selectAll);

    let rows = within(screen.getByRole("table")).getAllByRole("row").slice(1);
    expect(rows.every((r) => r.getAttribute("aria-selected") === "true")).toBe(true);

    await user.click(screen.getByRole("checkbox", { name: /select all rows/i }));
    rows = within(screen.getByRole("table")).getAllByRole("row").slice(1);
    expect(rows.every((r) => r.getAttribute("aria-selected") === "false")).toBe(true);
  });

  it("throws a helpful error when a part is used outside the Table", () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <Root>
          <DataViews.Table.SelectAll />
        </Root>,
      ),
    ).toThrow(/must be rendered inside <DataViews.Table>/);
    err.mockRestore();
  });
});

// ─── layer 3: parity ─────────────────────────────────────────────────────────

describe("preset / composition parity", () => {
  it("the preset and the equivalent hand-composed table render the same rows", () => {
    const preset = render(
      <Root>
        <DataViews.Table />
      </Root>,
    );
    const presetRows = bodyRowText();
    preset.unmount();

    render(
      <Root>
        <DataViews.Table>
          <DataViews.Table.Shell>
            <DataViews.Table.Head>
              <DataViews.Table.SelectAll />
              <DataViews.Table.SortHeader field="id" />
              <DataViews.Table.SortHeader field="customer" />
              <DataViews.Table.SortHeader field="total" />
            </DataViews.Table.Head>
            <DataViews.Table.Body>
              {(row) => (
                <DataViews.Table.Row record={row}>
                  <DataViews.Table.SelectCell />
                  <DataViews.Table.Cell field="id" />
                  <DataViews.Table.Cell field="customer" />
                  <DataViews.Table.Cell field="total" />
                </DataViews.Table.Row>
              )}
            </DataViews.Table.Body>
          </DataViews.Table.Shell>
        </DataViews.Table>
      </Root>,
    );

    expect(bodyRowText()).toEqual(presetRows);
  });
});
