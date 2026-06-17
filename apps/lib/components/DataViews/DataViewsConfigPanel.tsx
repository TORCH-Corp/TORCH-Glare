"use client";

import { useMemo, useState } from "react";
import {
  X,
  Settings as SettingsIcon,
  Filter as FilterIcon,
} from "lucide-react";
import type {
  ViewConfig,
  ViewType,
  FieldConfig,
  DynamicRecord,
  DynamicFilterConfig,
  FilterState,
  FilterValue,
} from "./types";

import { RadioGroup } from "../Radio";
import { FilterPanel } from "./FilterPanel";
import { RadioRow, DataViewsSwitch } from "./PanelControls";
import { cn } from "../../utils/cn";

type ConfigTab = "config" | "filters";

type SavedView = { id: string; label: string };

export type DataViewsConfigPanelProps = {
  config: ViewConfig;
  onConfigChange: (config: Partial<ViewConfig>) => void;
  onClose: () => void;
  currentView: ViewType;
  fields: FieldConfig[];

  // Filters tab
  data: DynamicRecord[];
  filterState: FilterState;
  onFilterChange: (filters: FilterState) => void;
  filterConfig?: DynamicFilterConfig[];

  // Saved views (presentational shell — wire to persistence when available)
  savedViews?: SavedView[];
  activeSavedView?: string;
  onSavedViewChange?: (id: string) => void;
  onSaveNewView?: () => void;

  // Animation: drives slide-in/out. Parent keeps the panel mounted through
  // the close animation, then unmounts.
  state?: "open" | "closed";
};

function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-[18px] font-[510] leading-[1.32] tracking-[-0.01em] text-white">
        {title}
      </h3>
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
      className="text-white/60"
      fill="currentColor"
    >
      {[5.33, 9.33].flatMap((cx) =>
        [3.33, 8, 12.67].map((cy) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1" />
        )),
      )}
    </svg>
  );
}

/** 2px blue insertion line shown between rows during a drag-reorder. */
function DropLine() {
  return (
    <div className="pointer-events-none relative h-0">
      <div className="absolute -top-[1px] left-0 right-0 h-[2px] rounded-full bg-[#005ECC]" />
    </div>
  );
}

export function DataViewsConfigPanel(props: DataViewsConfigPanelProps) {
  const {
    config,
    onConfigChange,
    onClose,
    fields,
    data,
    filterState,
    onFilterChange,
    filterConfig,
    state = "open",
  } = props;

  const [tab, setTab] = useState<ConfigTab>("config");

  const visibleFields = useMemo(
    () => fields.filter((f) => f.type !== "hidden"),
    [fields],
  );
  const visiblePaths = useMemo(
    () => new Set(visibleFields.map((f) => f.path)),
    [visibleFields],
  );
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

  const tabBtn = (id: ConfigTab, icon: React.ReactNode, label: string) => {
    const active = tab === id;
    return (
      <button
        type="button"
        aria-pressed={active}
        onClick={() => setTab(id)}
        className={cn(
          "flex h-6 flex-1 items-center justify-center gap-1 rounded-[8px] px-3 text-[14px] font-[510] leading-none transition-all duration-200 ease-in-out",
          active
            ? "bg-white text-black shadow-[0_0_10px_2px_rgba(0,0,0,0.25)]"
            : "bg-transparent text-white hover:bg-white/5",
        )}
      >
        <span className="flex h-[14px] w-[14px] items-center justify-center [&_svg]:h-[14px] [&_svg]:w-[14px]">
          {icon}
        </span>
        {label}
      </button>
    );
  };

  return (
    <div
      data-state={state}
      // Panel is always dark (Figma `Cun` = #000000). data-theme="dark" makes
      // child themed components (Button, Switch, Radio, FilterPanel) resolve
      // dark tokens even when the host app runs in default/light theme.
      data-theme="dark"
      className={cn(
        "flex h-full w-[260px] flex-col overflow-hidden rounded-[16px] bg-black",
        "transition-opacity duration-200 ease-in-out",
        state === "open" ? "opacity-100" : "opacity-0",
      )}
    >
      {/* Header: tab switcher + close */}
      <div className="flex items-center gap-2 px-3 py-3">
        <div className="flex flex-1 items-center gap-[2px] rounded-[10px] bg-[#252729] p-[2px] shadow-[inset_0_0_5px_0_rgba(0,0,0,0.16)]">
          {tabBtn("config", <SettingsIcon />, "Config.")}
          {tabBtn("filters", <FilterIcon />, "Filters")}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close panel"
          className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-white/[0.15] text-white transition-colors hover:bg-background-presentation-state-negative-primary hover:text-white"
        >
          <X className="h-[18px] w-[18px]" />
        </button>
      </div>

      <div className="h-px w-full bg-[#2C2D2E]" />

      <div className="flex-1 overflow-y-auto">
        {tab === "config" ? (
          <div className="flex flex-col gap-6 px-3 py-4">
            {/* Table Columns */}
            <div className="space-y-3">
              <SectionHeader title="Table Columns" />
              <p className="text-[12px] leading-[1.475] text-content-presentation-global-tertiary">
                Show or hide columns in table view
              </p>
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
                            const rect =
                              e.currentTarget.getBoundingClientRect();
                            const before =
                              e.clientY < rect.top + rect.height / 2;
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
                          className={cn(
                            // SB-Column-Item: standalone #1C1D1F pill, #252729
                            // border. Figma container spec: 8px radius, 8.8px
                            // padding, 8px gap between grip / label / switch.
                            "flex items-center gap-2 rounded-e-[99px] rounded-s-[60px] border border-[#252729] bg-[#1C1D1F] p-[8.8px] transition-colors cursor-grab active:cursor-grabbing",
                            isDragging ? "opacity-50" : "hover:bg-[#252729]",
                          )}
                        >
                          <span className="flex shrink-0 items-center justify-center">
                            <GripDots />
                          </span>
                          <span className="flex-1 text-[14px] text-white">
                            {col.label || field?.label || col.id}
                          </span>
                          <span className="flex shrink-0 items-center">
                            <DataViewsSwitch
                              checked={col.visible}
                              onCheckedChange={() =>
                                toggleColumnVisibility(col.id)
                              }
                            />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {/* Drop-at-end indicator: only ever rendered when the slot
                      points past the last row, so still exactly one line. */}
                  {dropSlot === orderedColumns.length && dragPath && (
                    <DropLine />
                  )}
                </div>
              )}
            </div>

            <div className="h-px w-full bg-[#2C2D2E]" />

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
                  className={cn(
                    "flex flex-col space-y-0 rounded-[12px] bg-[#1C1D1F] p-1",
                    // Wrapper containing the hovered row: hide its OWN
                    // divider (sits above the row).
                    "[&>div:has(>[role=radio]:hover)>.dv-divider]:opacity-0",
                    // Wrapper that directly follows the one with the hovered
                    // row: hide its divider (sits below the hovered row).
                    "[&>div:has(>[role=radio]:hover)+div>.dv-divider]:opacity-0",
                  )}
                >
                  {sortableColumns.map((col, i) => {
                    const field = fieldByPath.get(col.id);
                    return (
                      <div key={col.id}>
                        {/* Edge-to-edge divider (Figma: no horizontal
                            inset). */}
                        {i > 0 && (
                          <div className="dv-divider h-px bg-[#2C2D2E]" />
                        )}
                        <RadioRow
                          value={col.id}
                          label={col.label || field?.label || col.id}
                        />
                      </div>
                    );
                  })}
                </RadioGroup>
              )}
            </div>
          </div>
        ) : (
          <FilterPanel
            variant="panel"
            data={data}
            fields={fields}
            filters={filterState}
            onFilterChange={(path: string, value: FilterValue) =>
              onFilterChange({ ...filterState, [path]: value })
            }
            onClearAll={() => onFilterChange({})}
            filterConfig={filterConfig}
          />
        )}
      </div>
    </div>
  );
}
