"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  DynamicRecord,
  ViewConfig,
  DynamicColumnConfig,
  DynamicFilterConfig,
  FieldConfig,
  FilterState,
  FilterValue,
  TreeConfig,
} from "./types";
import {
  applyMove,
  autoDetectTreeShape,
  buildTree,
  findNodeById,
  flatten,
  initialExpansion,
  pruneTree,
  type TreeNode,
} from "../../utils/dataViews/treeUtils";
import {
  getByPath,
  matchesFilterValues,
} from "../../utils/dataViews/pathUtils";
import { visibleFields } from "../../utils/dataViews/fieldUtils";
import { renderField } from "./fieldRenderers";
import { useIsMobile } from "../../hooks/useIsMobile";
import { TableView } from "./TableView";
import { FilterPanel } from "./FilterPanel";
import { TreeSidebar } from "./tree/TreeSidebar";
import { TreeDrawer, TreeDrawerTrigger } from "./tree/TreeDrawer";
import { Card, CardContent, CardHeader } from "../Card";
import { Table2, LayoutGrid } from "lucide-react";
import { cn } from "../../utils/cn";

export type TreeViewProps = {
  data: DynamicRecord[];
  columns?: DynamicColumnConfig[];
  fields: FieldConfig[];
  config: ViewConfig;
  treeConfig?: TreeConfig;
  onDataUpdate?: (data: DynamicRecord[]) => void;
  filters?: DynamicFilterConfig[];
  filterState?: FilterState;
  onFilterChange?: (filters: FilterState) => void;
  showFilters?: boolean;
};

export function TreeView({
  data,
  columns,
  fields,
  config,
  treeConfig,
  onDataUpdate,
  filters: filterConfig,
  filterState: externalFilterState,
  onFilterChange,
  showFilters = true,
}: TreeViewProps) {
  const isMobile = useIsMobile();
  const [internalFilters, setInternalFilters] = useState<FilterState>({});
  const activeFilters = externalFilterState ?? internalFilters;

  const resolvedTree = useMemo(
    () => autoDetectTreeShape(data, treeConfig ?? {}),
    [data, treeConfig],
  );

  const display = useMemo(
    () => visibleFields(fields).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [fields],
  );

  const labelField: FieldConfig = useMemo(() => {
    const path = resolvedTree.nodeLabel;
    if (path) {
      const f = fields.find((x) => x.path === path);
      if (f) return f;
      return { path, label: path, type: "text" };
    }
    return display[0] ?? { path: resolvedTree.idField, type: "text" };
  }, [resolvedTree, fields, display]);

  const fullForest = useMemo(
    () => buildTree(data, resolvedTree),
    [data, resolvedTree],
  );

  const filterEntries = useMemo(
    () => Object.entries(activeFilters),
    [activeFilters],
  );

  const visibleForest: TreeNode[] = useMemo(() => {
    if (filterEntries.length === 0) return fullForest;
    return pruneTree(fullForest, (record) =>
      filterEntries.every(([path, value]) =>
        matchesFilterValues(record, path, value),
      ),
    );
  }, [fullForest, filterEntries]);

  const [expanded, setExpanded] = useState<Set<string>>(() =>
    initialExpansion(fullForest, resolvedTree.defaultExpanded),
  );

  useEffect(() => {
    setExpanded(initialExpansion(fullForest, resolvedTree.defaultExpanded));
  }, [fullForest, resolvedTree.defaultExpanded]);

  const [selectedId, setSelectedId] = useState<string | null>(
    () => fullForest[0]?.id ?? null,
  );

  useEffect(() => {
    if (selectedId && !findNodeById(visibleForest, selectedId)) {
      setSelectedId(visibleForest[0]?.id ?? null);
    }
  }, [visibleForest, selectedId]);

  const selectedNode = selectedId
    ? findNodeById(visibleForest, selectedId)
    : null;
  const recordsForRightPane = useMemo(
    () => (selectedNode ? flatten(selectedNode) : []),
    [selectedNode],
  );

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const handleFilterChange = (path: string, value: FilterValue) => {
    const next: FilterState = { ...activeFilters, [path]: value };
    if (onFilterChange) onFilterChange(next);
    else setInternalFilters(next);
  };
  const clearAllFilters = () => {
    if (onFilterChange) onFilterChange({});
    else setInternalFilters({});
  };

  const [drawerOpen, setDrawerOpen] = useState(false);

  type RightPaneMode = "table" | "card";
  const [rightPaneMode, setRightPaneMode] = useState<RightPaneMode>(
    // "details" is a deprecated alias of "card".
    treeConfig?.defaultRightPane === "details"
      ? "card"
      : (treeConfig?.defaultRightPane ?? "table"),
  );

  const dndEnabled = treeConfig?.dndEnabled !== false && !!onDataUpdate;

  const handleMove = ({
    dragIds,
    parentId,
    index,
  }: {
    dragIds: string[];
    parentId: string | null;
    index: number;
  }) => {
    if (!onDataUpdate) return;
    const next = applyMove(data, resolvedTree, { dragIds, parentId, index });
    onDataUpdate(next);
  };

  const treeContent = (
    <TreeSidebar
      roots={visibleForest}
      expanded={expanded}
      selectedId={selectedId}
      labelField={labelField}
      dndEnabled={dndEnabled}
      onToggle={toggle}
      onSelect={(id) => {
        setSelectedId(id);
        if (isMobile) setDrawerOpen(false);
      }}
      onMove={handleMove}
    />
  );

  const filtersEnabled = showFilters && config.showFilters !== false;

  return (
    <div className="flex h-full gap-2">
      {!isMobile && (
        <div className="w-64 rounded-[16px] border border-border-presentation-global-primary bg-background-presentation-form-base overflow-hidden flex flex-col">
          <div className="px-3 py-2 border-b border-border-presentation-global-primary">
            <span className="text-xs font-semibold text-content-presentation-global-secondary uppercase tracking-wide">
              Tree
            </span>
          </div>
          <div className="flex-1 overflow-hidden">{treeContent}</div>
        </div>
      )}

      {!isMobile && filtersEnabled && (
        <FilterPanel
          data={data}
          fields={fields}
          filters={activeFilters}
          onFilterChange={handleFilterChange}
          onClearAll={clearAllFilters}
          filterConfig={filterConfig}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden rounded-[16px] border border-border-presentation-global-primary bg-background-presentation-form-base">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border-presentation-global-primary bg-background-presentation-form-base">
          {isMobile && (
            <TreeDrawerTrigger onClick={() => setDrawerOpen(true)} />
          )}

          {/* Segmented switcher — same style as the main view switcher
              (DataViewsHeader): #252729 track, white active pill, divider
              between two inactive tabs only. */}
          <div className="flex items-center gap-[2px] rounded-[10px] bg-background-presentation-body-primary p-[2px] shadow-[inset_0_0_4px_0_rgba(0,0,0,0.08)]">
            {(
              [
                { id: "table", label: "Table", icon: <Table2 /> },
                { id: "card", label: "Card", icon: <LayoutGrid /> },
              ] as const
            ).map((tab, idx) => {
              const active = rightPaneMode === tab.id;
              const prevActive = idx > 0 && rightPaneMode === "table";
              const showDivider = idx > 0 && !active && !prevActive;
              return (
                <div key={tab.id} className="flex items-center">
                  {showDivider && (
                    <div className="mx-[3px] h-3 w-px bg-[#434446]" />
                  )}
                  <button
                    type="button"
                    aria-label={`${tab.label} mode`}
                    aria-pressed={active}
                    onClick={() => setRightPaneMode(tab.id)}
                    className={cn(
                      "flex h-6 items-center gap-[6px] rounded-[8px] px-3 text-[14px] font-[510] leading-none transition-all duration-200 ease-in-out",
                      active
                        ? "bg-white text-black shadow-[0_0_10px_2px_rgba(0,0,0,0.25)]"
                        : "bg-transparent text-content-presentation-global-primary hover:bg-white/5",
                    )}
                  >
                    <span className="flex h-[14px] w-[14px] items-center justify-center [&_svg]:h-[14px] [&_svg]:w-[14px]">
                      {tab.icon}
                    </span>
                    {tab.label}
                  </button>
                </div>
              );
            })}
          </div>

          <span className="ml-auto text-sm text-content-presentation-global-secondary truncate">
            {selectedNode
              ? `${recordsForRightPane.length} record${recordsForRightPane.length === 1 ? "" : "s"}`
              : "Select an item"}
          </span>
        </div>

        <div className="flex-1 overflow-hidden">
          {selectedNode ? (
            rightPaneMode === "table" ? (
              <TableView
                data={recordsForRightPane}
                columns={columns}
                fields={fields}
                config={{ ...config, showFilters: false }}
                onDataUpdate={onDataUpdate}
                filters={filterConfig}
                filterState={activeFilters}
                onFilterChange={(next) => {
                  if (onFilterChange) onFilterChange(next);
                  else setInternalFilters(next);
                }}
                showFilters={false}
              />
            ) : (
              <CardGrid
                records={recordsForRightPane}
                fields={fields}
                labelField={labelField}
              />
            )
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-content-presentation-global-tertiary">
              No node selected.
            </div>
          )}
        </div>
      </div>

      {isMobile && (
        <TreeDrawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          {treeContent}
        </TreeDrawer>
      )}
    </div>
  );
}

/**
 * Card mode for the Tree right pane: renders the same record set as Table
 * mode, one library <Card> per record. The label field is the card header;
 * the remaining visible fields are key/value rows in the card body.
 */
function CardGrid({
  records,
  fields,
  labelField,
}: {
  records: DynamicRecord[];
  fields: FieldConfig[];
  labelField: FieldConfig;
}) {
  const bodyFields = visibleFields(fields)
    .filter((f) => f.path !== labelField.path)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (records.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-content-presentation-global-tertiary">
        No records.
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 bg-background-presentation-body-primary">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {records.map((record, idx) => {
          const labelValue = getByPath(record, labelField.path);
          return (
            <Card key={record.id ?? idx} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="text-xs uppercase tracking-wide text-content-presentation-global-tertiary">
                  {labelField.label ?? labelField.path}
                </div>
                <div className="text-base font-semibold text-content-presentation-global-primary">
                  {renderField(labelValue, labelField, record)}
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {bodyFields.map((f) => {
                  const value = getByPath(record, f.path);
                  if (value == null) return null;
                  return (
                    <div
                      key={f.path}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="text-content-presentation-global-tertiary">
                        {f.label ?? f.path}
                      </span>
                      <span className="text-content-presentation-global-primary text-right">
                        {renderField(value, f, record)}
                      </span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
