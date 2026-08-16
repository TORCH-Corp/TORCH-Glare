"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../Button";
import { useDataViewsFilters, useDataViewsView } from "../context";
import { RadioGroup } from "./controls";
import { Section } from "./section";
import type { PanelSavedViewsProps } from "../types";

/**
 * `DataViews.Panel.SavedViews` — pick a saved arrangement, or save the current one.
 *
 * Persistence is yours. `onSave` is handed the full snapshot — filters, sort and columns — which
 * is the part the old panel got wrong: its save callback took no arguments, so there was nothing
 * a host could actually store.
 */
export function SavedViews({
  title = "Saved View",
  views = [],
  onValueChange,
  onSave,
  saveLabel = "Save a New View",
  className,
}: PanelSavedViewsProps) {
  const { sort, setSort, columns, setColumns } = useDataViewsView();
  const { filters, setFilters } = useDataViewsFilters();
  // Which view is selected is UI state like any other — the caller stores the snapshots, not the
  // cursor into them.
  const [active, setActive] = useState("");

  /** Selecting a view is the other half of saving one: put back exactly what was stored. */
  const restore = (id: string) => {
    setActive(id);
    const snapshot = views.find((v) => v.id === id)?.snapshot;
    if (snapshot) {
      setColumns(snapshot.columns);
      setSort(snapshot.sort);
      setFilters(snapshot.filters);
    }
    onValueChange?.(id);
  };

  return (
    <Section title={title} className={className}>
      {views.length > 0 && (
        <RadioGroup
          value={active}
          onValueChange={restore}
          items={views.map((v) => ({ value: v.id, label: v.label }))}
        />
      )}
      {onSave && (
        <Button
          type="button"
          variant="BorderStyle"
          size="M"
          className="w-full"
          onClick={() => onSave({ filters, sort, columns })}
        >
          <Plus className="h-4 w-4" />
          {saveLabel}
        </Button>
      )}
    </Section>
  );
}
