import { cn } from "../utils/cn";
import { ReactNode } from "react";
import { Label } from "../components/Label";
import { Themes } from "../utils/types";

interface Props {
  label?: ReactNode;
  secondaryLabel?: ReactNode;
  requiredLabel?: ReactNode;
  size?: "S" | "M" | "L";
  childrenUnderLabel?: ReactNode;
  theme?: Themes;
  className?: string;
  children?: ReactNode;
  direction?: "horizontal" | "vertical" | "flexible";
}

export function FieldSection({
  children,
  label,
  secondaryLabel,
  direction = "flexible",
  requiredLabel,
  size,
  theme,
  className,
  childrenUnderLabel,
  ...props
}: Props) {
  // Which copy of `childrenUnderLabel` is visible, driven purely by the `@md` container
  // breakpoint (this section's own width reaching 650px) — deliberately not by `direction`.
  // Pinning it per-direction breaks the common case: `FormRenderer` forces `direction="vertical"`
  // inside a drawer and FormBuilder puts the field's validation error in this slot, so a vertical
  // form would strand every error under the label at any width.
  const underLabelSlot = direction === "vertical" ? "hidden" : "hidden @md:block";
  const underChildrenSlot = direction === "vertical" ? "block" : "block @md:hidden";

  return (
    <section
      {...props}
      data-theme={theme}
      className={cn("w-full max-w-[1200px] min-w-[0px] @container", className)}
    >
      <div
        className={cn(
          "grid py-[16px] px-[12px] w-full min-w-[0px]",
          direction === "vertical" && "grid-rows-[auto_1fr] gap-[12px]",
          direction === "horizontal" && "grid-cols-[350px_1fr] gap-[24px]",
          direction === "flexible" &&
          "grid-rows-[auto_1fr] gap-[12px] @md:grid-cols-[350px_1fr] @md:grid-rows-[1fr] @md:gap-[24px]",
        )}
      >
        {/* Fixed width section for labels */}
        <div className="flex flex-col gap-[12px]">
          {label && (
            <Label
              size={size}
              label={label}
              requiredLabel={requiredLabel}
              labelDirections={"horizontal"}
            />
          )}

          {secondaryLabel && <Label size={size} secondaryLabel={secondaryLabel} />}

          {/* Stacked (below `@md`): the label column IS the full width, so under the label is the
              natural spot. Hidden once `@md` splits the row into two columns — the copy in the
              children column takes over there. Exactly one of the two is ever displayed. */}
          {childrenUnderLabel && (
            <div data-slot="under-label" className={cn(underLabelSlot)}>
              {childrenUnderLabel}
            </div>
          )}
        </div>

        {/* Flexible section that takes up the remaining space */}
        <div className="grid grid-cols-1 place-items-end gap-[12px]">
          {children}

          {/* Two-column (`@md` and up): the hint belongs under the control it describes, not
              stranded at the bottom of the 350px label column. */}
          {childrenUnderLabel && (
            <div data-slot="under-children" className={cn("w-full", underChildrenSlot)}>
              {childrenUnderLabel}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
