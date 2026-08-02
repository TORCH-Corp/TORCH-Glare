"use client";

import {
  Table as GlareTable,
  TableHeader,
  TableBody,
  TableHead,
  TableRow as GlareTableRow,
  TableCell,
} from "../../../Table";
import { Card, CardContent, CardHeader } from "../../../Card";
import { Checkbox } from "../../../Checkbox";
import { getByPath } from "../../../../utils/dataViews/pathUtils";
import { renderField } from "../../fieldRenderers";
import { useIsMobile } from "../../../../hooks/useIsMobile";
import type { DynamicRecord, FieldConfig } from "../../types";

type TableGridProps = {
  records: readonly DynamicRecord[];
  /** Pre-computed `recordKey` per row, index-aligned with `records`. */
  rowIds: string[];
  fields: readonly FieldConfig[];
  sortPath: string | null;
  sortDirection: "asc" | "desc";
  onSort: (path: string) => void;
  selectedKeys: Set<string>;
  allSelected: boolean;
  onToggleAll: () => void;
  onToggleRow: (id: string) => void;
};

/**
 * The table itself, with no knowledge of the DataViews context — so the tree
 * view can reuse it for its right pane over an arbitrary record subset.
 */
export function TableGrid({
  records,
  rowIds,
  fields,
  sortPath,
  sortDirection,
  onSort,
  selectedKeys,
  allSelected,
  onToggleAll,
  onToggleRow,
}: TableGridProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="grid gap-3">
          {records.map((item, idx) => (
            <Card key={rowIds[idx]} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <Checkbox
                    className="mt-1"
                    checked={selectedKeys.has(rowIds[idx])}
                    onCheckedChange={() => onToggleRow(rowIds[idx])}
                  />
                  <div className="flex-1">
                    {fields[0] && (
                      <p className="font-medium">{String(getByPath(item, fields[0].path) ?? "")}</p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {fields.slice(1).map((field) => (
                  <div key={field.path} className="flex items-center justify-between text-sm">
                    <span className="text-content-presentation-global-tertiary">
                      {field.label}:
                    </span>
                    <span>{renderField(getByPath(item, field.path), field, item)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background-presentation-form-base">
      <div className="flex-1 overflow-auto rounded-lg">
        <GlareTable className="w-full">
          <TableHeader>
            <GlareTableRow>
              <TableHead isDummy className="w-12">
                <Checkbox
                  aria-label="Select all rows"
                  checked={allSelected}
                  onCheckedChange={onToggleAll}
                />
              </TableHead>
              {fields.map((field) => (
                <TableHead
                  key={field.path}
                  size="M"
                  sortType={sortPath === field.path ? sortDirection : undefined}
                  onSort={() => onSort(field.path)}
                >
                  {field.label}
                </TableHead>
              ))}
            </GlareTableRow>
          </TableHeader>
          <TableBody>
            {records.map((item, idx) => {
              const id = rowIds[idx];
              return (
                <GlareTableRow key={id}>
                  <TableCell isDummy className="w-12">
                    {/* `Checkbox` rather than `TableCheckbox`: the latter's
                        props are typed as button attributes and don't surface
                        Radix's `checked` / `onCheckedChange`. */}
                    <div className="flex items-center justify-center">
                      <Checkbox
                        size="S"
                        aria-label={`Select row ${id}`}
                        checked={selectedKeys.has(id)}
                        onCheckedChange={() => onToggleRow(id)}
                      />
                    </div>
                  </TableCell>
                  {fields.map((field) => (
                    <TableCell key={field.path}>
                      {/* `isolate` confines the Badge's mix-blend-luminosity to
                          a local stacking context and `transform-gpu` promotes
                          it to its own layer, so the table's post-mount column
                          reflow repaints cleanly instead of leaving a ghosted
                          badge frame. */}
                      <span className="isolate inline-flex transform-gpu">
                        {renderField(getByPath(item, field.path), field, item)}
                      </span>
                    </TableCell>
                  ))}
                </GlareTableRow>
              );
            })}
          </TableBody>
        </GlareTable>
      </div>
    </div>
  );
}
