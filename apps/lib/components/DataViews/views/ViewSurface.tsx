"use client";

import type { ReactNode } from "react";
import { cn } from "../../../utils/cn";

/**
 * The "Master Container" — the white card the active view renders inside.
 *
 * Occupies the bottom-left cell of the Root's grid. Every view wraps its body
 * in one of these, so the card chrome (radius, clipping, scroll container) is
 * defined once instead of per view.
 */
export function ViewSurface({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <main className={cn("col-start-1 row-start-2 flex min-h-0 overflow-hidden", className)}>
      <div className="flex flex-1 overflow-hidden rounded-[16px]">
        {/* Clip the scrollable surface to the parent radius MINUS the 1px
            border (16 − 1 = 15px). At the full 16px the opaque view background
            sits flush with the parent's outer edge and bleeds past the border
            as a ~1px light line down the left/right straight sides. */}
        <div className="flex-1 overflow-auto rounded-[15px]">{children}</div>
      </div>
    </main>
  );
}
