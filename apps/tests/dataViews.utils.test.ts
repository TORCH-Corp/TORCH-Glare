import { describe, it, expect } from "vitest";

import {
  getByPath,
  getRecordId,
  recordKey,
  matchesFilterValues,
  setByPath,
} from "@/utils/dataViews/pathUtils";
import {
  autoDetectTreeShape,
  buildTree,
  flattenAll,
  pruneTree,
  updateRecordById,
} from "@/utils/dataViews/treeUtils";
import { detectFields, mergeFields, visibleFields } from "@/utils/dataViews/fieldUtils";
import type { DynamicRecord, FieldConfig } from "@/components/DataViews";

const ORDERS: DynamicRecord[] = [
  { id: 1, customer: "Acme", status: "Pending", total: 1240, createdAt: "2025-09-10" },
  { id: 2, customer: "Globex", status: "Shipped", total: 480, createdAt: "2025-09-12" },
  { id: 3, customer: "Initech", status: "Delivered", total: 99, createdAt: "2025-09-15" },
];

describe("getRecordId / recordKey", () => {
  it("prefers a literal id", () => {
    expect(getRecordId({ id: 7, name: "x" }, "name", 3)).toBe(7);
  });

  it("falls back to the fallback path when there is no id", () => {
    expect(getRecordId({ name: "x" }, "name", 3)).toBe("x");
  });

  it("falls back to a namespaced index when nothing resolves", () => {
    // Namespaced so it can never be mistaken for a real value.
    expect(recordKey({}, "name", 3)).toBe("__row3");
  });

  it("does not collide when a real id stringifies to the same digits as an index", () => {
    // The regression: a record whose id is the string "2" and the record sitting
    // at index 2 must not produce the same key.
    const withStringId = recordKey({ id: "2" }, undefined, 0);
    const atIndexTwo = recordKey({}, undefined, 2);
    expect(withStringId).not.toBe(atIndexTwo);
  });

  it("is stable for the same record regardless of position", () => {
    const rec = { id: 42 };
    expect(recordKey(rec, undefined, 0)).toBe(recordKey(rec, undefined, 99));
  });
});

describe("getByPath / setByPath", () => {
  it("reads and writes dot paths", () => {
    const rec = { a: { b: { c: 1 } } };
    expect(getByPath(rec, "a.b.c")).toBe(1);
    const next = setByPath(rec, "a.b.c", 2);
    expect(getByPath(next, "a.b.c")).toBe(2);
  });

  it("does not mutate the source record", () => {
    const rec = { a: { b: 1 } };
    setByPath(rec, "a.b", 9);
    expect(rec.a.b).toBe(1);
  });

  it("returns undefined for missing paths instead of throwing", () => {
    expect(getByPath({ a: 1 }, "a.b.c")).toBeUndefined();
    expect(getByPath(null, "a")).toBeUndefined();
  });
});

describe("matchesFilterValues", () => {
  it("treats an empty categorical filter as a pass", () => {
    expect(matchesFilterValues(ORDERS[0], "status", [])).toBe(true);
  });

  it("matches categorical values with OR semantics", () => {
    expect(matchesFilterValues(ORDERS[0], "status", ["Pending", "Shipped"])).toBe(true);
    expect(matchesFilterValues(ORDERS[2], "status", ["Pending", "Shipped"])).toBe(false);
  });

  it("matches when any element of an array value is selected", () => {
    const rec = { tags: ["urgent", "vip"] };
    expect(matchesFilterValues(rec, "tags", ["vip"])).toBe(true);
    expect(matchesFilterValues(rec, "tags", ["cold"])).toBe(false);
  });

  it("coerces booleans to 'true' / 'false'", () => {
    expect(matchesFilterValues({ ok: true }, "ok", ["true"])).toBe(true);
    expect(matchesFilterValues({ ok: false }, "ok", ["true"])).toBe(false);
  });

  it("applies numeric ranges inclusively", () => {
    const f = { kind: "number" as const, min: 100, max: 1240 };
    expect(matchesFilterValues(ORDERS[0], "total", f)).toBe(true); // 1240, upper bound
    expect(matchesFilterValues(ORDERS[1], "total", f)).toBe(true); // 480
    expect(matchesFilterValues(ORDERS[2], "total", f)).toBe(false); // 99, below min
  });

  it("includes the whole of the upper date bound's day", () => {
    const f = { kind: "date" as const, from: "2025-09-10", to: "2025-09-12" };
    expect(matchesFilterValues(ORDERS[0], "createdAt", f)).toBe(true);
    expect(matchesFilterValues(ORDERS[1], "createdAt", f)).toBe(true);
    expect(matchesFilterValues(ORDERS[2], "createdAt", f)).toBe(false);
  });
});

describe("tree shape detection", () => {
  it("detects a nested children key", () => {
    const shape = autoDetectTreeShape([{ id: 1, children: [] }], {});
    expect(shape.childrenField).toBe("children");
    expect(shape.parentField).toBeUndefined();
  });

  it("detects a flat parent pointer", () => {
    const shape = autoDetectTreeShape([{ id: 1, parentId: null }], {});
    expect(shape.parentField).toBe("parentId");
    expect(shape.childrenField).toBeUndefined();
  });

  it("detects neither for flat data — this is what hides the Tree tab", () => {
    const shape = autoDetectTreeShape(ORDERS, {});
    expect(shape.childrenField).toBeUndefined();
    expect(shape.parentField).toBeUndefined();
  });

  it("lets an explicit config override detection", () => {
    const shape = autoDetectTreeShape([{ id: 1, children: [] }], { childrenField: "kids" });
    expect(shape.childrenField).toBe("kids");
  });
});

const NESTED: DynamicRecord[] = [
  {
    id: 1,
    name: "Hardware",
    status: "Active",
    children: [
      { id: 2, name: "Laptops", status: "Active", children: [] },
      { id: 3, name: "Monitors", status: "Archived", children: [] },
    ],
  },
  { id: 4, name: "Software", status: "Archived", children: [] },
];

describe("flattenAll / buildTree", () => {
  it("flattens every record, parents included", () => {
    const flat = flattenAll(NESTED, "children");
    expect(flat.map((r) => r.id).sort()).toEqual([1, 2, 3, 4]);
  });

  it("rebuilds the same hierarchy it detected", () => {
    const shape = autoDetectTreeShape(NESTED, {});
    const forest = buildTree(NESTED, shape);
    expect(forest).toHaveLength(2);
    expect(forest[0].children.map((c) => c.record.name)).toEqual(["Laptops", "Monitors"]);
    expect(forest[1].children).toHaveLength(0);
  });
});

describe("pruneTree", () => {
  const shape = autoDetectTreeShape(NESTED, {});
  const forest = buildTree(NESTED, shape);

  it("keeps a non-matching parent alive when a descendant matches", () => {
    // "Hardware" is Active, but the point is the reverse case: prune to
    // Archived and Hardware must survive because Monitors matches.
    const pruned = pruneTree(forest, (r) => r.status === "Archived");
    const hardware = pruned.find((n) => n.record.name === "Hardware");
    expect(hardware).toBeDefined();
    expect(hardware!.children.map((c) => c.record.name)).toEqual(["Monitors"]);
  });

  it("drops branches where neither the node nor any descendant matches", () => {
    const pruned = pruneTree(forest, (r) => r.name === "Laptops");
    expect(pruned.map((n) => n.record.name)).toEqual(["Hardware"]);
    expect(pruned[0].children.map((c) => c.record.name)).toEqual(["Laptops"]);
  });

  it("returns an empty forest when nothing matches", () => {
    expect(pruneTree(forest, () => false)).toEqual([]);
  });
});

describe("updateRecordById", () => {
  it("updates a top-level record and leaves siblings untouched", () => {
    const next = updateRecordById(ORDERS, 2, "id", undefined, (r) =>
      setByPath(r, "status", "Delivered"),
    );
    expect(next).toHaveLength(3);
    expect(next.map((r) => r.status)).toEqual(["Pending", "Delivered", "Delivered"]);
  });

  it("updates a nested record without flattening the tree", () => {
    const next = updateRecordById(NESTED, 3, "id", "children", (r) =>
      setByPath(r, "status", "Active"),
    );
    // Shape survives: two roots, first still has two children.
    expect(next).toHaveLength(2);
    const children = next[0].children as DynamicRecord[];
    expect(children).toHaveLength(2);
    expect(children[1].status).toBe("Active");
    // Untouched siblings keep their values.
    expect(children[0].status).toBe("Active");
    expect(next[1].status).toBe("Archived");
  });

  it("does not mutate the input", () => {
    updateRecordById(NESTED, 3, "id", "children", (r) => setByPath(r, "status", "Active"));
    const original = (NESTED[0].children as DynamicRecord[])[1];
    expect(original.status).toBe("Archived");
  });

  it("is a no-op when the id is not found", () => {
    const next = updateRecordById(ORDERS, 999, "id", undefined, (r) =>
      setByPath(r, "status", "Nope"),
    );
    expect(next.map((r) => r.status)).toEqual(["Pending", "Shipped", "Delivered"]);
  });
});

describe("field detection", () => {
  it("infers types from key names and values", () => {
    const fields = detectFields(ORDERS);
    const byPath = Object.fromEntries(fields.map((f) => [f.path, f]));
    expect(byPath.status.type).toBe("enum-badge");
    expect(byPath.createdAt.type).toBe("date-format");
    expect(byPath.customer.type).toBe("text");
  });

  it("merges declared fields over detected ones", () => {
    const detected = detectFields(ORDERS);
    const custom: FieldConfig[] = [{ path: "status", label: "State", filterable: true }];
    const merged = mergeFields(detected, custom);
    const status = merged.find((f) => f.path === "status")!;
    expect(status.label).toBe("State");
    expect(status.filterable).toBe(true);
    // The detected type survives because the override didn't set one.
    expect(status.type).toBe("enum-badge");
  });

  it("appends fields that detection never saw", () => {
    const merged = mergeFields(detectFields(ORDERS), [{ path: "computed", label: "Computed" }]);
    expect(merged.some((f) => f.path === "computed")).toBe(true);
  });

  it("excludes hidden and explicitly invisible fields", () => {
    const fields: FieldConfig[] = [
      { path: "a" },
      { path: "b", type: "hidden" },
      { path: "c", visible: false },
    ];
    expect(visibleFields(fields).map((f) => f.path)).toEqual(["a"]);
  });
});
