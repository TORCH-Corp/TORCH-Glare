"use client";

import { Fragment, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { Card, CardContent, CardHeader } from "../components/Card";
import type { Themes } from "../utils/types";

export type DataViewCardCell = {
  key: string;
  label: ReactNode;
  value: ReactNode;
};

export type DataViewCardRow = DataViewCardCell[];

export interface DataViewCardProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "title"
> {
  title?: ReactNode;
  rows?: DataViewCardRow[];
  theme?: Themes;
}

export function DataViewCard({
  title,
  rows = [],
  className,
  theme,
  ...props
}: DataViewCardProps) {
  return (
    <Card
      data-theme={theme}
      {...props}
      className={cn("p-[8px] rounded-[10px] gap-0", className)}
    >
      {title != null && (
        <CardHeader className=" border-b border-border-presentation-global-primary">
          <div className="min-w-0 typography-headers-large-semibold text-content-presentation-global-primary">
            {title}
          </div>
        </CardHeader>
      )}
      {rows.length > 0 && (
        <CardContent className="grid grid-cols-2 gap-0 pt-0 w-full">
          {rows.map((cells, rowIdx) => (
            <Fragment key={rowIdx}>
              {cells.map((cell, cellIdx) => (
                <div
                  key={cell.key}
                  className={cn(
                    "relative flex flex-col gap-[2px] min-w-0 p-[6px]",
                    rowIdx > 0 &&
                      "border-t border-border-presentation-global-primary",
                    cells.length === 2 &&
                      cellIdx === 0 &&
                      "after:absolute after:end-0 after:top-[7%] after:h-[80%] after:w-px after:bg-border-presentation-global-primary",
                    cells.length === 1 && "col-span-2",
                  )}
                >
                  <span className="typography-body-small-medium text-content-presentation-global-tertiary">
                    {cell.label}
                  </span>
                  <div className="typography-body-medium-semibold text-content-presentation-global-primary truncate">
                    {cell.value}
                  </div>
                </div>
              ))}
            </Fragment>
          ))}
        </CardContent>
      )}
    </Card>
  );
}
