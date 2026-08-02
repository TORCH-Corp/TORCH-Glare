"use client";

import { useCallback, useMemo, useRef, useState } from "react";

export type UseSelectionOptions = {
  /** Ids currently checked. Omit to let the hook own selection internally. */
  selectedIds?: ReadonlyArray<unknown>;
  onSelectionChange?: (ids: unknown[]) => void;
  /** Every selectable id currently on screen — what "select all" means. */
  allIds: readonly string[];
};

export type SelectionApi = {
  /** Membership test, already string-keyed. */
  isSelected: (id: string) => boolean;
  selectedKeys: ReadonlySet<string>;
  selected: readonly unknown[];
  allSelected: boolean;
  /** Some but not all — for a tri-state header checkbox. */
  someSelected: boolean;
  toggle: (id: string) => void;
  toggleAll: () => void;
  clear: () => void;
  /** Props for a row's checkbox, including its accessible name. */
  getCheckboxProps: (id: string) => {
    checked: boolean;
    onCheckedChange: () => void;
    "aria-label": string;
  };
  /** Props for the select-all checkbox. */
  getSelectAllProps: () => {
    checked: boolean;
    onCheckedChange: () => void;
    "aria-label": string;
  };
};

/**
 * Row selection, controlled or not.
 *
 * Two details here are easy to get wrong and are the reason this is a hook
 * rather than something each view reimplements:
 *
 * 1. **Functional updates.** Two toggles dispatched in the same tick must both
 *    land. The controlled branch has no functional form of its own, so the
 *    current value is mirrored into a ref for it to read.
 * 2. **String keys.** Ids are compared as strings everywhere in DataViews
 *    (`recordKey`), so the set is keyed that way once rather than at each
 *    comparison.
 */
export function useSelection({
  selectedIds,
  onSelectionChange,
  allIds,
}: UseSelectionOptions): SelectionApi {
  const [internal, setInternal] = useState<unknown[]>([]);
  const selected = selectedIds ?? internal;

  const selectedRef = useRef<ReadonlyArray<unknown>>(selected);
  selectedRef.current = selected;

  const apply = useCallback(
    (update: (prev: readonly unknown[]) => unknown[]) => {
      if (onSelectionChange) onSelectionChange(update(selectedRef.current));
      else setInternal((prev) => update(prev));
    },
    [onSelectionChange],
  );

  const selectedKeys = useMemo(() => new Set(selected.map((id) => String(id))), [selected]);

  const allSelected = allIds.length > 0 && allIds.every((id) => selectedKeys.has(id));
  const someSelected = !allSelected && allIds.some((id) => selectedKeys.has(id));

  const toggle = useCallback(
    (id: string) =>
      apply((prev) =>
        prev.some((v) => String(v) === id) ? prev.filter((v) => String(v) !== id) : [...prev, id],
      ),
    [apply],
  );

  const toggleAll = useCallback(
    () => apply(() => (allSelected ? [] : [...allIds])),
    [apply, allSelected, allIds],
  );

  const clear = useCallback(() => apply(() => []), [apply]);

  const getCheckboxProps = useCallback(
    (id: string) => ({
      checked: selectedKeys.has(id),
      onCheckedChange: () => toggle(id),
      "aria-label": `Select row ${id}`,
    }),
    [selectedKeys, toggle],
  );

  const getSelectAllProps = useCallback(
    () => ({
      checked: allSelected,
      onCheckedChange: toggleAll,
      "aria-label": "Select all rows",
    }),
    [allSelected, toggleAll],
  );

  return {
    isSelected: (id) => selectedKeys.has(id),
    selectedKeys,
    selected,
    allSelected,
    someSelected,
    toggle,
    toggleAll,
    clear,
    getCheckboxProps,
    getSelectAllProps,
  };
}
