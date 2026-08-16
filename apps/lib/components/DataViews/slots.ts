import React from "react";

/**
 * How the root recognises its children.
 *
 * Children are the API: rendering `<DataViews.Table/>` is what makes a table view exist, and
 * rendering `<DataViews.Panel/>` is what puts a sidebar beside it. To lay those out the root has
 * to tell them apart, so each part is stamped with a marker here and found with the matching
 * guard — never `child.type === Panel`, which breaks across duplicated module instances and
 * silently stops matching after a hot reload.
 *
 * Markers and guards live in this one file rather than beside their components so that the root
 * can import all of them without importing the components themselves — otherwise `header.tsx`
 * would have to import from `data-views.tsx`, which already imports `header.tsx`.
 */

function mark<P extends object>(component: React.ComponentType<P>, key: string) {
  (component as unknown as Record<string, boolean>)[key] = true;
  return component;
}

function isMarked(node: React.ReactNode, key: string) {
  return React.isValidElement(node) && (node.type as unknown as Record<string, unknown>)?.[key] === true;
}

// ─── Views ────────────────────────────────────────────────────────────────────

/** What a view is called in the switcher when the caller does not say. */
export interface ViewMeta {
  defaultId: string;
  defaultLabel: string;
}

export function markView<P extends object>(component: React.ComponentType<P>, meta: ViewMeta) {
  (component as unknown as { __dataView: ViewMeta }).__dataView = meta;
  return component;
}

export function viewMetaOf(node: React.ReactNode): ViewMeta | undefined {
  if (!React.isValidElement(node)) return undefined;
  return (node.type as { __dataView?: ViewMeta })?.__dataView;
}

export type ViewElement = React.ReactElement<{
  id?: string;
  label?: string;
  icon?: React.ReactNode;
}>;

export function isViewElement(node: React.ReactNode): node is ViewElement {
  return viewMetaOf(node) !== undefined;
}

// ─── Everything else the root positions ───────────────────────────────────────

export const markHeader = <P extends object>(c: React.ComponentType<P>) => mark(c, "__dvHeader");
export const isHeaderElement = (n: React.ReactNode) => isMarked(n, "__dvHeader");

export const markPanel = <P extends object>(c: React.ComponentType<P>) => mark(c, "__dvPanel");
export const isPanelElement = (n: React.ReactNode) => isMarked(n, "__dvPanel");



