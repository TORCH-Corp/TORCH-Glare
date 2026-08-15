"use client";

import { cn } from "../../../utils/cn";
import type { PanelSectionProps } from "../types";

/** A titled block, with the rail's hairline above it. Purely visual grouping. */
export function Section({ title, children, className }: PanelSectionProps) {
  return (
    <section className={cn("space-y-3", className)}>
      {title && (
        <h3 className="text-[18px] font-[510] leading-[1.32] tracking-[-0.01em] text-white">
          {title}
        </h3>
      )}
      {children}
    </section>
  );
}
