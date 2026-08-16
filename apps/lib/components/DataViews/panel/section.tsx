"use client";

import { useId, useState } from "react";
import { cn } from "../../../utils/cn";
import { ConclusionHeader } from "../../ConclusionHeader";
import type { PanelSectionProps } from "../types";

/**
 * A titled block in the rail — and, when it has a title, a **collapsible** one.
 *
 * The header is `ConclusionHeader`, the same clickable section header `FormSummary` uses for its
 * groups and the one Figma draws in this rail (`Conclusion-Header-1.0`). `Columns`, `Sort` and
 * `SavedViews` all render through here, so they all fold from one implementation.
 *
 * It colours itself from `content-presentation-global-*` tokens rather than a `text-white`
 * literal, which is what lets the same section sit in this dark rail and in the light content
 * area without a second variant.
 */
export function Section({
  title,
  description,
  collapsible = true,
  defaultOpen = true,
  children,
  className,
}: PanelSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyId = useId();
  const isCollapsible = collapsible && title != null;
  const shown = !isCollapsible || open;

  return (
    <section className={cn("flex flex-col", className)}>
      {title != null &&
        (isCollapsible ? (
          <ConclusionHeader
            label={title}
            open={open}
            onOpenChange={setOpen}
            aria-controls={bodyId}
          />
        ) : (
          <h3 className="text-content-presentation-global-primary text-[18px] font-[510] leading-[1.32] tracking-[-0.01em]">
            {title}
          </h3>
        ))}

      {/* Figma groups the description with the header (a 47px block: 28px header + 18px line),
          not with the rows — so it sits outside the fold and still reads when the group is shut. */}
      {description != null && (
        <p className="typography-body-small-regular text-content-presentation-global-primary">
          {description}
        </p>
      )}

      {/* Fold/unfold: `grid-rows-[0fr → 1fr]` animates to the body's natural height without
          measuring it, so this stays a pure-CSS transition. The inner `overflow-hidden` is what
          the 0fr track actually clips — it has to stay a bare wrapper. There is no flex `gap`
          here either: a gap survives a collapsed body as dead space, so the spacing below the
          title lives on the body instead, inside what collapses. */}
      <div
        id={bodyId}
        // A collapsed body keeps its controls in the DOM, so `inert` is what takes them out of
        // the tab order and the a11y tree — `overflow-hidden` alone would still let focus in.
        inert={!shown}
        aria-hidden={!shown}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-200 ease-in-out",
          "motion-reduce:transition-none",
          shown ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className={cn("space-y-3", title != null && "pt-3")}>{children}</div>
        </div>
      </div>
    </section>
  );
}
