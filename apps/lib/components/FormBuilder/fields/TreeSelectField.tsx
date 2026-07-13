"use client";

import { SearchableTree } from "../../SearchableTree";
import type { TreeSelectFieldProps } from "../types";
import { FieldShell } from "./FieldShell";

/**
 * `FormBuilder.TreeSelect` — hierarchical single-select (Glare `SearchableTree`).
 * Stores the selected node's id; seeds the picker + view label by finding the
 * node back from that id.
 */
export function TreeSelectField<T>(props: TreeSelectFieldProps<T>) {
  const findById = (id: unknown): T | null => {
    const target = String(id ?? "");
    if (!target) return null;
    // Works for both nested (getNodeChildren) and flat node lists.
    const stack: T[] = [...props.nodes];
    while (stack.length) {
      const node = stack.pop() as T;
      if (props.getNodeId(node) === target) return node;
      const kids = props.getNodeChildren?.(node);
      if (kids && kids.length) stack.push(...kids);
    }
    return null;
  };

  return (
    <FieldShell
      {...props}
      view={(v) => {
        const node = findById(v);
        return { value: node ? String(props.getNodeLabel(node)) : "" };
      }}
    >
      {(field) => (
        <SearchableTree
          nodes={props.nodes}
          getNodeId={props.getNodeId}
          getNodeLabel={props.getNodeLabel}
          getNodeChildren={props.getNodeChildren}
          parentIdKey={props.parentIdKey as (keyof T & string) | undefined}
          selectableFolders={props.selectableFolders}
          value={findById(field.value)}
          onSelect={(node) => field.onChange(props.getNodeId(node))}
        />
      )}
    </FieldShell>
  );
}
