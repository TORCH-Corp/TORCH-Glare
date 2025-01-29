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
        "flex flex-col gap-[12px] flex-1 border-t border-[--border-presentation-global-primary] py-[16px] px-[12px] w-full max-w-[1200px] sm:gap-[24px] sm:flex-row",
        className
      )}
    >
      <section className="w-[350px] flex flex-col justify-start items-start gap-[8px]">
        <Label
          size={size}
          label={label}
          requiredLabel={requiredLabel}
          directions={"horizontal"}
        />
        <Label size={size} secondaryLabel={secondaryLabel} />
        {childrenUnderLabel}
      </section>

      <section className="flex-1 flex content-end flex-row flex-wrap gap-[12px]">
        {children}
      </section>
    </section>
  );
}
