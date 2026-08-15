import React from "react";
import type { FieldKind } from "./types";

/**
 * The stamp that tells a consumer what a `FormBuilder.*` field produces.
 *
 * A form is normally read by the resolver and the submit handler, both of which know the shape
 * they expect. Some consumers do not: `DataViews.Filters` is handed arbitrary fields as children
 * and has to turn each one's value into a filter — a list, a numeric range, a date range — without
 * being told which is which.
 *
 * The alternative is comparing `element.type` against an imported component, which breaks across
 * duplicated module instances and silently stops matching after a hot reload. A property on the
 * component survives both.
 */

const KEY = "__fieldKind";

export function markFieldKind<T>(component: T, kind: FieldKind): T {
  (component as Record<string, unknown>)[KEY] = kind;
  return component;
}

/** The kind stamped on an element's component, or `undefined` if it is not a marked field. */
export function fieldKindOf(node: React.ReactNode): FieldKind | undefined {
  if (!React.isValidElement(node)) return undefined;
  return (node.type as unknown as Record<string, unknown> | undefined)?.[KEY] as FieldKind | undefined;
}
