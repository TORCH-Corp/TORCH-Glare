"use client";

import { type ReactNode } from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "../../utils/cn";

export interface DataViewRadioProps {
  value: string;
  label?: string;
  children?: ReactNode;
  className?: string;
}

export function DataViewRadio({
  value,
  label,
  children,
  className,
}: DataViewRadioProps) {
  return (
    <RadioGroupPrimitive.Item
      value={value}
      className={cn(
        "group flex w-full items-center gap-1.5 py-1 ps-2 h-[32px]",
        "cursor-pointer rounded-[8px] text-left outline-none transition-colors",
        "hover:bg-background-presentation-action-contstyle-hover focus-visible:bg-background-presentation-action-contstyle-hover",
        className,
      )}
    >
      <span
        className={cn(
          "flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full",
          // Hardcoded literals so the indicator always renders dark inside the
          // DataView regardless of the host app's data-theme (matches the
          // always-dark panel chrome convention). Unselected ring = the spec
          // CheckBox-Primary border (#626467) + BorderStyle fill
          // (rgba(255,255,255,0.05)); same tokens the shared Checkbox uses.
          "border border-[#626467] bg-white/5 transition-colors",
          "group-data-[state=checked]:border-transparent",
          // #0075FF = the previous selected-fill value (border-presentation-state-focus),
          // now literal so the blue is theme-independent and visually unchanged.
          "group-data-[state=checked]:bg-[#0075FF]",
        )}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <span className="h-[6px] w-[6px] rounded-full bg-white" />
        </RadioGroupPrimitive.Indicator>
      </span>
      <span className="flex-1 typography-body-medium-regular text-content-presentation-global-primary">
        {children ?? label}
      </span>
    </RadioGroupPrimitive.Item>
  );
}
