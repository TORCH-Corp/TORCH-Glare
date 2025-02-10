import { cn } from "./utils";
import { HTMLAttributes, ReactNode } from "react";
import { Label } from "./Label";

interface Props extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode;
  secondaryLabel?: ReactNode;
  requiredLabel?: ReactNode;
  size?: "S" | "M" | "L";
  childrenUnderLabel?: ReactNode;
}

export function FieldSection({
  children,
  label,
  secondaryLabel,
  requiredLabel,
  size,
  className,
  childrenUnderLabel,
  ...props
}: Props) {
  return (
    <section
      {...props}
      className={cn(
        "grid grid-cols-[350px_1fr] gap-[12px] border-t border-[--border-presentation-global-primary] py-[16px] px-[12px] w-full max-w-[1200px] min-w-[0px] sm:gap-[24px]",
        className
      )}
    >
      {/* Fixed width section for labels */}
      <div className="flex flex-col gap-[8px]">
        <Label
          size={size}
          label={label}
          requiredLabel={requiredLabel}
          directions={"horizontal"}
        />
        <Label size={size} secondaryLabel={secondaryLabel} />
        {childrenUnderLabel}
      </div>

      {/* Flexible section that takes up the remaining space */}
      <div className="flex flex-col items-end gap-[12px]">{children}</div>
    </section>
  );
}
