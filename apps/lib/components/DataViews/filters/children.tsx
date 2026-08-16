"use client";

import React from "react";
import { fieldKindOf } from "../../FormBuilder";
import type { FilterFieldDescriptor } from "../../../utils/dataViews/types";
import { toName } from "./values";
import { Labelled } from "./labelled";

/** How a FormBuilder field's value becomes a filter. Fields not listed here are not filters. */
const AS_FILTER = {
  text: { kind: "text" } as const,
  choice: { kind: "choice", single: true } as const,
  multiChoice: { kind: "choice", single: false } as const,
  date: { kind: "date" } as const,
  slider: { kind: "number" } as const,
};

/**
 * Walk the children and describe every FormBuilder field among them.
 *
 * This is what `fields` used to be, except it is read from the controls you wrote rather than
 * declared twice. The walk follows `props.children`, so a field stays visible through a plain
 * wrapper; it cannot see through a component that builds the element itself, which is the same
 * limitation the layout markers have.
 *
 * `Checkbox`, `Number`, `File` and friends have no filter meaning — a boolean is not a query and a
 * file is not a value you can filter by — so they render but contribute nothing. `Filters.Custom`
 * is the way to drive a filter no FormBuilder field covers.
 */
export function collectFilterFields(children: React.ReactNode): FilterFieldDescriptor[] {
  const out: FilterFieldDescriptor[] = [];
  const seen = new Set<string>();

  const walk = (node: React.ReactNode) => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (!React.isValidElement(node)) return;

    const props = node.props as {
      name?: string;
      label?: React.ReactNode;
      min?: number;
      max?: number;
      children?: React.ReactNode;
    };
    const kind = fieldKindOf(node);
    const as = kind ? AS_FILTER[kind as keyof typeof AS_FILTER] : undefined;

    if (as && props.name && !seen.has(props.name)) {
      seen.add(props.name);
      out.push({
        path: props.name,
        label: typeof props.label === "string" ? props.label : undefined,
        ...as,
        ...(as.kind === "number" ? { min: props.min ?? 0, max: props.max ?? 100 } : null),
      });
    }

    walk(props.children);
  };

  walk(children);
  return out;
}

/**
 * Render the children, with two changes to every field.
 *
 * The `name` is escaped, because RHF reads `customer.name` as object nesting — the author writes
 * the real path and `FilterState` stays keyed by it. Anything calling `setValue` on a filter has
 * to use `toName(path)` for the same reason.
 *
 * The `label` moves out of the field and into `Labelled` above it: `"bare"` mode exists precisely
 * to drop `FieldSection`'s label row, so a label left on the field would simply vanish.
 */
export function renderFields(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    const props = child.props as { name?: string; label?: React.ReactNode; children?: React.ReactNode };

    if (fieldKindOf(child) && props.name) {
      return (
        <Labelled label={props.label}>
          {React.cloneElement(child, { name: toName(props.name), label: undefined } as never)}
        </Labelled>
      );
    }

    // Not a field — recurse so a control inside a wrapper still gets its name escaped.
    if (props.children) {
      return React.cloneElement(child, {} as never, renderFields(props.children));
    }
    return child;
  });
}
