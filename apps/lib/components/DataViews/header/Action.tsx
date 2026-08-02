"use client";

import type { ComponentProps, ReactNode } from "react";
import { Button } from "../../Button";
import { cn } from "../../../utils/cn";

export type ActionProps = Omit<ComponentProps<typeof Button>, "children"> & {
  children?: ReactNode;
};

/**
 * A primary header action — the "Add New" button in the default layout.
 *
 * Thin wrapper over the library `Button` so callers get the header's sizing and
 * accent without restating it, while every Button prop stays available.
 */
export function DataViewsAction({ children = "Add New", className, ...props }: ActionProps) {
  return (
    <Button
      variant="PrimeStyle"
      size="M"
      {...props}
      className={cn(
        "rounded-[6px] bg-background-presentation-button-fill-blue-primary px-[14px] text-[16px] font-[510] text-content-presentation-global-primary hover:bg-background-presentation-button-fill-blue-primary/90",
        className,
      )}
    >
      {children}
    </Button>
  );
}
