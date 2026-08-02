import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DataViews, useDataViews } from "@/components/DataViews";
import type { DynamicRecord, FieldConfig, FilterState } from "@/components/DataViews";

// jsdom has no matchMedia; `useIsMobile` needs it. Report desktop so the views
// render their full (non-collapsed) layouts.
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

/**
 * Regression tests for the defects found auditing the compound refactor.
 *
 * The invariant under test throughout: **a view only ever renders a subset of
 * the data, so editing one record through a view must never delete the records
 * that view happened to be hiding.**
 */

const ORDERS: DynamicRecord[] = [
  { id: 1, customer: "Acme", status: "Pending", priority: "High", isStarred: false },
  { id: 2, customer: "Globex", status: "Shipped", priority: "Low", isStarred: false },
  { id: 3, customer: "Initech", status: "Delivered", priority: "High", isStarred: false },
  { id: 4, customer: "Umbrella", status: "Pending", priority: "Low", isStarred: false },
];

const FIELDS: FieldConfig[] = [
  { path: "id", label: "Order #", type: "number" },
  { path: "customer", label: "Customer", type: "text" },
  {
    path: "status",
    label: "Status",
    type: "enum-badge",
    variants: { Pending: "yellow", Shipped: "blue", Delivered: "green" },
    filterable: true,
  },
  { path: "priority", label: "Priority", type: "enum-badge", filterable: true },
];

/** Reports the Root's source dataset out to the test. */
let observed: readonly DynamicRecord[] = [];

function Probe() {
  const { items } = useDataViews();
  observed = items;
  return null;
}

beforeEach(() => {
  observed = [];
});

describe("mutating through a filtered view", () => {
  it("keeps every record when a Kanban card is dropped under an active filter", async () => {
    // Filter to Pending only — the board shows 2 of 4 orders.
    const filterState: FilterState = { status: ["Pending"] };

    render(
      <DataViews.Root
        data={ORDERS}
        fields={FIELDS}
        filterState={filterState}
        onFilterChange={() => {}}
      >
        <Probe />
        <DataViews.Kanban groupBy="status" />
      </DataViews.Root>,
    );

    expect(observed).toHaveLength(4);

    // Drag order 1 out of Pending and into Delivered.
    const card = document.querySelector('[data-record-id="1"]');
    expect(card).not.toBeNull();
    const target = document.querySelector('[data-column-id="Delivered"]');
    expect(target).not.toBeNull();

    fireEvent.dragStart(card!);
    fireEvent.drop(target!);

    // The two filtered-out orders must still exist.
    expect(observed).toHaveLength(4);
    expect(observed.map((r) => r.id).sort()).toEqual([1, 2, 3, 4]);
    // …and the edit landed.
    expect(observed.find((r) => r.id === 1)!.status).toBe("Delivered");
    // …without disturbing anyone else.
    expect(observed.find((r) => r.id === 2)!.status).toBe("Shipped");
  });

  it("keeps every record when an inbox row is starred under an active filter", async () => {
    const user = userEvent.setup();
    const filterState: FilterState = { status: ["Pending"] };

    render(
      <DataViews.Root
        data={ORDERS}
        fields={FIELDS}
        filterState={filterState}
        onFilterChange={() => {}}
      >
        <Probe />
        <DataViews.Inbox config={{ starredField: "isStarred" }} />
      </DataViews.Root>,
    );

    expect(observed).toHaveLength(4);

    await user.click(screen.getByRole("button", { name: /toggle star/i }));

    expect(observed).toHaveLength(4);
    expect(observed.map((r) => r.id).sort()).toEqual([1, 2, 3, 4]);
    expect(observed.filter((r) => r.isStarred)).toHaveLength(1);
  });
});

describe("inbox quick-filter rail", () => {
  it("keeps the Starred and Priority rails when a filter empties the list", () => {
    // No order has this status, so the rendered list is empty. Flag detection
    // must still see the real dataset.
    const filterState: FilterState = { status: ["Cancelled"] };

    render(
      <DataViews.Root
        data={ORDERS}
        fields={FIELDS}
        filterState={filterState}
        onFilterChange={() => {}}
      >
        <DataViews.Inbox />
      </DataViews.Root>,
    );

    expect(screen.getByText("All Items")).toBeInTheDocument();
    expect(screen.getByText("Starred")).toBeInTheDocument();
    expect(screen.getByText("Priority")).toBeInTheDocument();
  });
});

const NESTED: DynamicRecord[] = [
  {
    id: 1,
    name: "Hardware",
    children: [
      { id: 2, name: "Laptops" },
      { id: 3, name: "Monitors" },
    ],
  },
  { id: 4, name: "Software", children: [] },
];

const NESTED_FIELDS: FieldConfig[] = [
  { path: "id", type: "number" },
  { path: "name", label: "Name", type: "text" },
];

describe("tree expansion", () => {
  it("survives a Root re-render such as opening the config rail", async () => {
    const user = userEvent.setup();

    render(
      <DataViews.Root data={NESTED} fields={NESTED_FIELDS}>
        <DataViews.Header title="Catalogue">
          <DataViews.ConfigTrigger />
        </DataViews.Header>
        <DataViews.Tree childrenField="children" nodeLabel="name" defaultExpanded="none" />
        <DataViews.ConfigPanel />
      </DataViews.Root>,
    );

    // Scope to the sidebar tree: "Laptops" also appears in the right-hand
    // pane, which lists the selected node's whole subtree regardless.
    const treeItems = () => screen.getAllByRole("treeitem").map((n) => n.textContent);

    // Collapsed to start: the child rows are not in the tree.
    expect(treeItems().join(" ")).not.toContain("Laptops");

    await user.click(screen.getAllByRole("button", { name: /expand/i })[0]);
    expect(treeItems().join(" ")).toContain("Laptops");

    // Opening the rail re-renders Root, which used to reset the expansion set.
    await user.click(screen.getByRole("button", { name: /filter & config/i }));

    expect(treeItems().join(" ")).toContain("Laptops");
  });
});

describe("view registration", () => {
  it("renders tabs in the order the views were written", () => {
    render(
      <DataViews.Root data={ORDERS} fields={FIELDS}>
        <DataViews.Header title="Orders">
          <DataViews.ViewSwitch />
        </DataViews.Header>
        <DataViews.Kanban groupBy="status" />
        <DataViews.Table />
      </DataViews.Root>,
    );

    const tabs = screen.getAllByRole("tab");
    expect(tabs.map((t) => t.textContent)).toEqual(["Board", "List"]);
  });

  it("honours a custom label without moving the tab", () => {
    render(
      <DataViews.Root data={ORDERS} fields={FIELDS}>
        <DataViews.Header title="Orders">
          <DataViews.ViewSwitch />
        </DataViews.Header>
        <DataViews.Table label="Rows" />
        <DataViews.Kanban groupBy="status" />
      </DataViews.Root>,
    );

    expect(screen.getAllByRole("tab").map((t) => t.textContent)).toEqual(["Rows", "Board"]);
  });

  it("hides the Tree tab for flat data", () => {
    render(
      <DataViews.Root data={ORDERS} fields={FIELDS}>
        <DataViews.Header title="Orders">
          <DataViews.ViewSwitch />
        </DataViews.Header>
        <DataViews.Table />
        <DataViews.Tree />
      </DataViews.Root>,
    );

    expect(screen.queryByRole("tab", { name: /tree/i })).not.toBeInTheDocument();
  });
});

describe("filtering narrows the active view", () => {
  it("shows only matching rows in the table", () => {
    render(
      <DataViews.Root
        data={ORDERS}
        fields={FIELDS}
        filterState={{ status: ["Pending"] }}
        onFilterChange={() => {}}
      >
        <DataViews.Table />
      </DataViews.Root>,
    );

    const table = screen.getByRole("table");
    expect(within(table).getByText("Acme")).toBeInTheDocument();
    expect(within(table).getByText("Umbrella")).toBeInTheDocument();
    expect(within(table).queryByText("Globex")).not.toBeInTheDocument();
  });
});
