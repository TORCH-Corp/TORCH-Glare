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
  return (
    <section
      {...props}
      data-theme={theme}
      className={cn(
        "grid  border-t border-border-presentation-global-primary py-[16px] px-[12px] w-full max-w-[1200px] min-w-[0px] ",
        direction === "vertical" && "grid-rows-[auto_1fr] gap-[12px]",
        direction === "horizontal" && "grid-cols-[350px_1fr] gap-[24px]",
        direction === "flexible" &&
        "grid-rows-[auto_1fr] gap-[12px] lg:grid-cols-[350px_1fr] lg:grid-rows-[1fr] lg:gap-[24px]",
        className
      )}
    >
      {/* Fixed width section for labels */}
      <div className="flex flex-col gap-[12px]">
        {label && (
          <Label
            size={size}
            label={label}
            requiredLabel={requiredLabel}
            directions={"horizontal"}
          />
        )}

        {secondaryLabel && (
          <Label size={size} secondaryLabel={secondaryLabel} />
        )}
        {childrenUnderLabel}
      </div>

      {/* Flexible section that takes up the remaining space */}
      <div className="flex flex-col items-end gap-[12px]">{children}</div>
    </section>
  );
}