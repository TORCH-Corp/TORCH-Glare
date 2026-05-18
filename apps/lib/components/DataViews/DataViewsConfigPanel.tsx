"use client";

import { useMemo, useState } from "react";
import {
  X,
  Settings as SettingsIcon,
  Filter as FilterIcon,
  Plus,
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
import { Switch } from "../Switch";
import { RadioGroup, Radio } from "../Radio";
import { Label } from "../Label";
import { FilterPanel } from "./FilterPanel";
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

const DEFAULT_SAVED_VIEWS: SavedView[] = [
  { id: "default", label: "Default View" },
  { id: "high-priority", label: "High Priority" },
  { id: "pending-orders", label: "Pending Orders" },
  { id: "recent", label: "Recently Created" },
];

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

// Shared Switch override: bright green track (#0AC713) when checked, matching
// the Figma Switcher-1.0 "On" state, regardless of the dark theme scope.
const SWITCH_GREEN =
  "data-[state=checked]:bg-[#0AC713] data-[state=checked]:border-[#0AC713]";

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
    savedViews = DEFAULT_SAVED_VIEWS,
    activeSavedView,
    onSavedViewChange,
    onSaveNewView,
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
  const [dragOverPath, setDragOverPath] = useState<string | null>(null);
  // Whether the drop will land before (true) or after (false) dragOverPath.
  const [dropBefore, setDropBefore] = useState(true);

  const reorderColumn = (
    sourcePath: string,
    targetPath: string,
    before: boolean,
  ) => {
    if (sourcePath === targetPath) return;
    const ids = orderedColumns.map((c) => c.id);
    const from = ids.indexOf(sourcePath);
    let to = ids.indexOf(targetPath);
    if (from === -1 || to === -1) return;
    const reordered = [...ids];
    reordered.splice(from, 1);
    // Recompute the target index after removal, then offset for before/after.
    to = reordered.indexOf(targetPath);
    const insertAt = before ? to : to + 1;
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
          className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-white/[0.15] text-white transition-colors hover:bg-white/25"
        >
          <X className="h-[18px] w-[18px]" />
        </button>
      </div>

      <div className="h-px w-full bg-[#2C2D2E]" />

      <div className="flex-1 overflow-y-auto">
        {tab === "config" ? (
          <div className="flex flex-col gap-6 px-3 py-4">
            {/* Saved View */}
            <div className="space-y-3">
              <SectionHeader title="Saved View" />
              <RadioGroup
                value={activeSavedView ?? savedViews[0]?.id}
                onValueChange={(v) => onSavedViewChange?.(v)}
                className="flex flex-col gap-1 space-y-0 rounded-[12px] bg-[#1C1D1F] p-1"
              >
                {savedViews.map((sv, i) => (
                  <div key={sv.id}>
                    {/* Divider spans edge-to-edge (Figma: no horizontal
                        inset). */}
                    {i > 0 && <div className="h-px bg-[#2C2D2E]" />}
                    <div className="flex items-center gap-1.5 py-1 pl-2">
                      <Radio value={sv.id} id={`sv-${sv.id}`} />
                      <Label
                        htmlFor={`sv-${sv.id}`}
                        size="M"
                        label={sv.label}
                        className="cursor-pointer [&_p]:text-white"
                      />
                    </div>
                  </div>
                ))}
              </RadioGroup>
              <button
                type="button"
                onClick={onSaveNewView}
                className="flex w-full items-center justify-center gap-1.5 rounded-[4px] bg-white/[0.15] px-1.5 py-0.5 text-[12px] font-[510] text-white transition-colors hover:bg-white/25"
              >
                <Plus className="h-3 w-3" />
                Save a New View
              </button>
            </div>

            <div className="h-px w-full bg-[#2C2D2E]" />

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
                  {orderedColumns.map((col) => {
                    const field = fieldByPath.get(col.id);
                    const isDragging = dragPath === col.id;
                    const isTarget =
                      dragOverPath === col.id && dragPath !== col.id;
                    return (
                      <div key={col.id}>
                        {isTarget && dropBefore && <DropLine />}
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
                            if (dragOverPath !== col.id)
                              setDragOverPath(col.id);
                            if (dropBefore !== before) setDropBefore(before);
                          }}
                          onDragLeave={() => {
                            if (dragOverPath === col.id) setDragOverPath(null);
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (dragPath)
                              reorderColumn(dragPath, col.id, dropBefore);
                            setDragPath(null);
                            setDragOverPath(null);
                          }}
                          onDragEnd={() => {
                            setDragPath(null);
                            setDragOverPath(null);
                          }}
                          className={cn(
                            // SB-Column-Item: standalone #1C1D1F pill, #252729
                            // border. Figma container spec: 8px radius, 8.8px
                            // padding, 8px gap between grip / label / switch.
                            "flex items-center gap-2 rounded-r-[99px] rounded-l-[60px] border border-[#252729] bg-[#1C1D1F] p-[8.8px] transition-colors cursor-grab active:cursor-grabbing",
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
                            <Switch
                              checked={col.visible}
                              onCheckedChange={() =>
                                toggleColumnVisibility(col.id)
                              }
                              className={SWITCH_GREEN}
                            />
                          </span>
                        </div>
                        {isTarget && !dropBefore && <DropLine />}
                      </div>
                    );
                  })}
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
                <RadioGroup
                  value={config.sortBy || undefined}
                  onValueChange={(v) => onConfigChange({ sortBy: v })}
                  className="flex flex-col gap-1 space-y-0 rounded-[12px] bg-[#1C1D1F] p-1"
                >
                  {sortableColumns.map((col, i) => {
                    const field = fieldByPath.get(col.id);
                    return (
                      <div key={col.id}>
                        {/* Edge-to-edge divider (Figma: no horizontal
                            inset). */}
                        {i > 0 && <div className="h-px bg-[#2C2D2E]" />}
                        <div className="flex items-center gap-1.5 py-1 pl-2">
                          <Radio value={col.id} id={`sort-${col.id}`} />
                          <Label
                            htmlFor={`sort-${col.id}`}
                            size="M"
                            label={col.label || field?.label || col.id}
                            className="cursor-pointer [&_p]:text-white"
                          />
                        </div>
                      </div>
                    );
                  })}
                </RadioGroup>
              )}
            </div>
          </div>
        ) : (
          <div className="[&>div]:w-full [&>div]:border-r-0 [&>div]:bg-transparent">
            <FilterPanel
              data={data}
              fields={fields}
              filters={filterState}
              onFilterChange={(path: string, value: FilterValue) =>
                onFilterChange({ ...filterState, [path]: value })
              }
              onClearAll={() => onFilterChange({})}
              filterConfig={filterConfig}
            />
          </div>
        )}
      </div>
    </div>
  );
}
