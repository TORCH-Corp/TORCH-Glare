"use client";

import React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "../../../utils/cn";
import { Switch } from "../../Switch";

/**
 * The form controls the settings rail is built from.
 *
 * The rail is wrapped in `data-theme="dark"`, so themed components resolve dark tokens on their
 * own. The literals below are the exceptions — values chosen against pure black in Figma that
 * sit outside the theme system entirely.
 */

/** The bright-green checked track from the Figma Switcher-1.0 "On" state. */
const SWITCH_GREEN = "data-[state=checked]:bg-[#0AC713] data-[state=checked]:border-[#0AC713]";

export function DataViewsSwitch(props: React.ComponentProps<typeof Switch>) {
  return <Switch {...props} className={cn(SWITCH_GREEN, props.className)} />;
}

/**
 * A radio row. The whole 32px row is the Radix item, so the label is part of the click target
 * rather than something you have to hit the 14px ring for.
 */
export function DataViewRadio({
  value,
  label,
  children,
  className,
}: {
  value: string;
  label?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <RadioGroupPrimitive.Item
      value={value}
      className={cn(
        "group flex h-[32px] w-full items-center gap-1.5 py-1 ps-2",
        "cursor-pointer rounded-[8px] text-left outline-none transition-colors",
        "hover:bg-background-presentation-action-contstyle-hover focus-visible:bg-background-presentation-action-contstyle-hover",
        className,
      )}
    >
      <span
        className={cn(
          "flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full",
          // Literals so the indicator stays dark inside the rail regardless of the host theme,
          // matching the always-dark panel chrome. Unselected ring is the CheckBox-Primary border
          // (#626467) over the BorderStyle fill; selected is the focus blue.
          "border border-[#626467] bg-white/5 transition-colors",
          "group-data-[state=checked]:border-transparent",
          "group-data-[state=checked]:bg-[#0075FF]",
        )}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <span className="h-[6px] w-[6px] rounded-full bg-white" />
        </RadioGroupPrimitive.Indicator>
      </span>
      <span className="typography-body-medium-regular text-content-presentation-global-primary flex-1">
        {children ?? label}
      </span>
    </RadioGroupPrimitive.Item>
  );
}

/**
 * A `#1C1D1F` pill holding a list of radio rows, with hairlines between them.
 *
 * The two `:has()` rules hide the hairline above and below the row being hovered, so the hover
 * highlight reads as one continuous block instead of being sliced by a line.
 */
export function RadioGroup({
  value,
  onValueChange,
  items,
  className,
}: {
  value: string;
  onValueChange: (value: string) => void;
  items: readonly { value: string; label: string }[];
  className?: string;
}) {
  return (
    <RadioGroupPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      className={cn(
        "flex flex-col space-y-0 rounded-[12px] bg-[#1C1D1F] p-1",
        "[&>div:has(>[role=radio]:hover)>.dv-divider]:opacity-0",
        "[&>div:has(>[role=radio]:hover)+div>.dv-divider]:opacity-0",
        className,
      )}
    >
      {items.map((item, i) => (
        <div key={item.value}>
          {i > 0 && <div className="dv-divider h-px bg-[#2C2D2E]" />}
          <DataViewRadio value={item.value} label={item.label} />
        </div>
      ))}
    </RadioGroupPrimitive.Root>
  );
}
