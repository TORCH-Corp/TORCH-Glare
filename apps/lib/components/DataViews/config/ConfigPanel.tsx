"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X, Settings as SettingsIcon, Filter as FilterIcon, Plus } from "lucide-react";
import type { FilterValue } from "../types";

import { RadioGroup } from "../../Radio";
import { Button } from "../../Button";
import { TabSwitch } from "../../TabSwitch";
import { FilterPanel } from "../filters/FilterPanel";
import { DataViewRadio } from "../DataViewRadio";
import { DataViewsSwitch } from "./controls";
import { useDataViews } from "../context";
import {
  columnRowStyles,
  configPanelStyles,
  dropLineStyles,
  optionDivider,
  optionListStyles,
  panelDivider,
  panelSectionTitle,
} from "../styles";
import { cn } from "../../../utils/cn";

type ConfigTab = "config" | "filters";

type SavedView = { id: string; label: string };

export type ConfigPanelProps = {
  // Saved views (presentational shell — wire to persistence when available)
  savedViews?: SavedView[];
  activeSavedView?: string;
  onSavedViewChange?: (id: string) => void;
  onSaveNewView?: () => void;
  className?: string;
};

/** Duration of the rail's width transition, in ms. Kept in sync with the
 *  `duration-300` class on the wrapper below. */
const CLOSE_ANIM_MS = 300;

const DEFAULT_SAVED_VIEWS: SavedView[] = [{ id: "default", label: "Default View" }];

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className={panelSectionTitle()}>{title}</h3>
      {action}
    </div>
  );
}

/** 2×3 dot drag handle, matching the Figma SB-Column-Item grip (16×16 box,
 *  compact ~1.5px dots, tight spacing — drawn as an SVG for pixel accuracy). */
function GripDots() {
  return (
    <svg
      aria-hidden
      width="16"
      height="16"
      viewBox="0 0 16 16"
      // Panel is always-dark chrome (like the hardcoded white label text):
      // the grip stays white-on-dark regardless of host theme.
      className="text-content-presentation-global-primary/60"
      fill="currentColor"
    >
      {[5.33, 9.33].flatMap((cx) =>
        [3.33, 8, 12.67].map((cy) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1" />),
      )}
    </svg>
  );
}

/** 2px blue insertion line shown between rows during a drag-reorder. */
function DropLine() {
  return (
    <div className="pointer-events-none relative h-0">
      <div className={dropLineStyles()} />
    </div>
  );
}

/**
 * The right-hand config rail: saved views, column visibility/order, default
 * sort, and the filter list.
 *
 * Owns its own mount-through-close animation so the rail is absent from the DOM
 * entirely when no ConfigPanel was rendered, and `Root` only has to track
 * open/closed intent.
 */
export function DataViewsConfigPanel(props: ConfigPanelProps) {
  const { panel } = useDataViews();
  const [mounted, setMounted] = useState(panel.open);
  const [shown, setShown] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(mounted);
  mountedRef.current = mounted;

  useEffect(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    if (panel.open) {
      // Mount at width 0 first, then flip on the next frame so the width
      // transition animates from 0 → 260px instead of snapping.
      setMounted(true);
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(raf);
    }
    // Nothing to animate out if the rail was never open — skip the timer so a
    // page that never touches the config rail schedules no work at all.
    if (!mountedRef.current) return;
    setShown(false);
    closeTimer.current = setTimeout(() => setMounted(false), CLOSE_ANIM_MS);
  }, [panel.open]);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  if (!mounted) return null;

  return (
    <div
      className={cn(
        "col-start-2 row-span-2 shrink-0 overflow-hidden",
        "transition-[width] duration-300 ease-in-out",
        shown ? "w-[260px]" : "w-0",
        props.className,
      )}
    >
      <ConfigPanelBody {...props} state={shown ? "open" : "closed"} />
    </div>
  );
}

function ConfigPanelBody({
  savedViews = DEFAULT_SAVED_VIEWS,
  activeSavedView,
  onSavedViewChange,
  onSaveNewView,
  state,
}: ConfigPanelProps & { state: "open" | "closed" }) {
  const {
    config,
    setConfig: onConfigChange,
    fields,
    flatItems: data,
    filterState,
    setFilterState: onFilterChange,
    panel,
  } = useDataViews();
  const onClose = panel.close;

  const [tab, setTab] = useState<ConfigTab>("config");

  // Saved View is controlled by the caller when `activeSavedView` /
  // `onSavedViewChange` are supplied; otherwise fall back to local state so the
  // radios stay interactive — without this the selection would snap back on
  // every click.
  const [internalSavedView, setInternalSavedView] = useState(() => savedViews[0]?.id);
  const selectedSavedView = activeSavedView ?? internalSavedView;
  const handleSavedViewChange = (id: string) => {
    if (onSavedViewChange) onSavedViewChange(id);
    else setInternalSavedView(id);
  };

  const visibleFields = useMemo(() => fields.filter((f) => f.type !== "hidden"), [fields]);
  const visiblePaths = useMemo(() => new Set(visibleFields.map((f) => f.path)), [visibleFields]);
  const fieldByPath = useMemo(
    () => new Map(visibleFields.map((f) => [f.path, f])),
    [visibleFields],
  );
  const orderedColumns = useMemo(
    () =>
      [...config.tableColumns]
        .filter((c) => visiblePaths.has(c.id))
        .sort((a, b) => a.order - b.order),
    [config.tableColumns, visiblePaths],
  );

  const toggleColumnVisibility = (path: string) => {
    const next = config.tableColumns.map((c) =>
      c.id === path ? { ...c, visible: !c.visible } : c,
    );
    onConfigChange({ tableColumns: next });
  };

  const [dragPath, setDragPath] = useState<string | null>(null);
  // Insertion slot in the ordered list: 0 means before the first row, N means
  // after the last row (count). Single source of truth — there is exactly one
  // indicator at a time, so no double-line ambiguity between adjacent rows.
  const [dropSlot, setDropSlot] = useState<number | null>(null);

  const reorderColumnToSlot = (sourcePath: string, slot: number) => {
    const ids = orderedColumns.map((c) => c.id);
    const from = ids.indexOf(sourcePath);
    if (from === -1) return;
    // Dropping into the same logical position (before or after itself) is a no-op.
    if (slot === from || slot === from + 1) return;
    const reordered = [...ids];
    reordered.splice(from, 1);
    // After removal, indices shift left by 1 for any slot beyond `from`.
    const insertAt = slot > from ? slot - 1 : slot;
    reordered.splice(insertAt, 0, sourcePath);
    const orderByPath = new Map(reordered.map((id, i) => [id, i]));
    const next = config.tableColumns.map((c) => {
      const newOrder = orderByPath.get(c.id);
      return newOrder == null ? c : { ...c, order: newOrder };
    });
    onConfigChange({ tableColumns: next });
  };

  const sortableColumns = orderedColumns;

  return (
    <div
      data-state={state}
      // Panel is always dark (Figma `Cun` = #000000). data-theme="dark" makes
      // child themed components (Button, Switch, Radio, FilterPanel) resolve
      // dark tokens even when the host app runs in default/light theme.
      data-theme="dark"
      className={configPanelStyles({ state })}
    >
      {/* Header: tab switcher + close */}
      <div className="flex items-center gap-2 px-3 py-3">
        <TabSwitch
          theme="dark"
          className="flex-1"
          value={tab}
          onValueChange={setTab}
          options={[
            { value: "config", label: "Config.", icon: <SettingsIcon /> },
            { value: "filters", label: "Filters", icon: <FilterIcon /> },
          ]}
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close panel"
          className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-white/[0.15] text-content-presentation-global-primary transition-colors hover:bg-background-presentation-state-negative-primary hover:text-content-presentation-global-primary"
        >
          <X className="h-[18px] w-[18px]" />
        </button>
      </div>

      <div className={panelDivider()} />

      <div className="flex-1 overflow-y-auto">
        {tab === "config" ? (
          <div className="flex flex-col gap-6 px-3 py-4">
            {/* Saved View */}
            <div className="space-y-3">
              <SectionHeader title="Saved View" />
              <RadioGroup
                value={selectedSavedView}
                onValueChange={handleSavedViewChange}
                className={cn(optionListStyles(), "gap-1")}
              >
                {savedViews.map((sv, i) => (
                  <div key={sv.id}>
                    {/* Divider spans edge-to-edge (Figma: no horizontal
                        inset). */}
                    {i > 0 && <div className={optionDivider()} />}
                    <DataViewRadio value={sv.id} label={sv.label} />
                  </div>
                ))}
              </RadioGroup>
              <Button
                type="button"
                variant="BorderStyle"
                size="M"
                onClick={onSaveNewView}
                className="w-full"
              >
                <Plus className="h-4 w-4" />
                Save a New View
              </Button>
            </div>

            <div className={panelDivider()} />

            {/* Table Columns */}
            <div className="space-y-3">
              <SectionHeader title="Table Columns" />
              {orderedColumns.length === 0 ? (
                <p className="text-xs text-content-presentation-global-tertiary">
                  No fields detected.
                </p>
              ) : (
                <div data-theme="dark" className="flex flex-col gap-2">
                  {orderedColumns.map((col, index) => {
                    const field = fieldByPath.get(col.id);
                    const isDragging = dragPath === col.id;
                    // Slot for the cursor on this row: top half = insert at
                    // `index` (before this row); bottom half = `index + 1`
                    // (after this row, which is the SAME slot as "before next
                    // row" — the single source of truth avoids the old
                    // double-line problem in the gap between rows).
                    return (
                      <div key={col.id}>
                        {dropSlot === index && dragPath && <DropLine />}
                        <div
                          draggable
                          onDragStart={(e) => {
                            setDragPath(col.id);
                            e.dataTransfer.effectAllowed = "move";
                            e.dataTransfer.setData("text/plain", col.id);
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = "move";
                            const rect = e.currentTarget.getBoundingClientRect();
                            const before = e.clientY < rect.top + rect.height / 2;
                            const slot = before ? index : index + 1;
                            if (dropSlot !== slot) setDropSlot(slot);
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (dragPath && dropSlot != null)
                              reorderColumnToSlot(dragPath, dropSlot);
                            setDragPath(null);
                            setDropSlot(null);
                          }}
                          onDragEnd={() => {
                            setDragPath(null);
                            setDropSlot(null);
                          }}
                          className={columnRowStyles({ dragging: isDragging })}
                        >
                          <span className="flex shrink-0 items-center justify-center">
                            <GripDots />
                          </span>
                          <span className="flex-1 text-[14px] text-content-presentation-global-primary">
                            {col.label || field?.label || col.id}
                          </span>
                          <span className="flex shrink-0 items-center">
                            <DataViewsSwitch
                              checked={col.visible}
                              onCheckedChange={() => toggleColumnVisibility(col.id)}
                            />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {/* Drop-at-end indicator: only ever rendered when the slot
                      points past the last row, so still exactly one line. */}
                  {dropSlot === orderedColumns.length && dragPath && <DropLine />}
                </div>
              )}
            </div>

            <div className={panelDivider()} />

            {/* Default Sort */}
            <div className="space-y-3">
              <SectionHeader title="Default Sort" />
              {sortableColumns.length === 0 ? (
                <p className="text-xs text-content-presentation-global-tertiary">
                  No sortable columns.
                </p>
              ) : (
                // Single-choice radio list (Figma 1612:30016): selecting a
                // column sets config.sortBy; direction keeps config.sortOrder.
                // Rows + dividers are flat siblings so the `peer` pattern
                // can hide the dividers immediately before AND after a
                // hovered row.
                <RadioGroup
                  value={config.sortBy || undefined}
                  onValueChange={(v) => onConfigChange({ sortBy: v })}
                  className={optionListStyles()}
                >
                  {sortableColumns.map((col, i) => {
                    const field = fieldByPath.get(col.id);
                    return (
                      <div key={col.id}>
                        {/* Edge-to-edge divider (Figma: no horizontal
                            inset). */}
                        {i > 0 && <div className={optionDivider()} />}
                        <DataViewRadio value={col.id} label={col.label || field?.label || col.id} />
                      </div>
                    );
                  })}
                </RadioGroup>
              )}
            </div>
          </div>
        ) : (
          <FilterPanel
            data={data}
            fields={fields}
            filters={filterState}
            onFilterChange={(path: string, value: FilterValue) =>
              onFilterChange({ ...filterState, [path]: value })
            }
            onClearAll={() => onFilterChange({})}
          />
        )}
      </div>
    </div>
  );
}
