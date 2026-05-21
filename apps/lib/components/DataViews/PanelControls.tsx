"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Switch } from "../Switch";
import { cn } from "../../utils/cn";

/**
 * DataViews config-panel form controls.
 *
 * These are intentionally NOT shared library components. The panel chrome is
 * always-dark (Figma `Cun` = #000000) and hardcodes Figma hex values, which
 * conflicts with the design-system token / `data-theme` convention used by the
 * public components. They live colocated with the panel so the always-dark
 * Figma styling stays internal to DataViews. Not re-exported from index.ts.
 */

/**
 * Saved View / Default Sort radio row, built from the raw Radix primitive to
 * match Figma node 1612:30021. The shared <Radio>/<Label> components impose
 * their own circle size, color tokens, line-height reset and wrapper flex
 * layout that fight this panel's always-dark Figma spec, so the row is
 * hand-built here instead.
 *
 * The whole row IS the Radix Item, so the entire area (circle + label +
 * padding) is one click target. The circle/label are non-interactive visuals.
 *
 */
export function RadioRow({ value, label }: { value: string; label: string }) {
  return (
    <RadioGroupPrimitive.Item
      value={value}
      className={cn(
        "group flex w-full items-center gap-1.5 py-1 pl-2 h-[32px]",
        "cursor-pointer rounded-[8px] text-left outline-none transition-colors",
        "hover:bg-white/[0.04] focus-visible:bg-white/[0.04]",
      )}
    >
      <span
        className={cn(
          "flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full",
          "border border-[#626467] bg-[rgba(255,255,255,0.05)] transition-colors",
          "group-data-[state=checked]:border-transparent",
          "group-data-[state=checked]:bg-[#005ECC]",
        )}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <span className="h-[6px] w-[6px] rounded-full bg-white" />
        </RadioGroupPrimitive.Indicator>
      </span>
      <span className="text-[14px] font-normal leading-[1.475] text-white">
        {label}
      </span>
    </RadioGroupPrimitive.Item>
  );
}

// Shared <Switch> with the bright-green checked track (#0AC713) from the Figma
// Switcher-1.0 "On" state, applied regardless of the panel's dark theme scope.
const SWITCH_GREEN =
  "data-[state=checked]:bg-[#0AC713] data-[state=checked]:border-[#0AC713]";

type DataViewsSwitchProps = {
  checked: boolean;
  onCheckedChange: () => void;
};

/** Column show/hide toggle: the library <Switch> pre-styled to the panel's
 *  Figma green-checked spec. */
export function DataViewsSwitch({
  checked,
  onCheckedChange,
}: DataViewsSwitchProps) {
  return (
    <Switch
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={SWITCH_GREEN}
    />
  );
}
