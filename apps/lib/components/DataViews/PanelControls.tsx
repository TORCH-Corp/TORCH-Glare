"use client";

import { Switch } from "../Switch";
import { DataViewRadio } from "./DataViewRadio";

/**
 * DataViews config-panel form controls.
 *
 * The config panel is wrapped in `data-theme="dark"`, so theme-aware
 * components (DataViewRadio, Switch) render in dark mode automatically. The
 * green-checked Switch hex is the only thing this panel still hardcodes
 * because it sits outside the theme system.
 */

/**
 * Saved View / Default Sort radio row.
 *
 * Thin wrapper around the reusable {@link DataViewRadio} so the config panel
 * keeps a stable name. The whole row IS the Radix Item, so the entire area
 * (circle + label + padding) is one click target.
 */
export function RadioRow({ value, label }: { value: string; label: string }) {
  return <DataViewRadio value={value} label={label} />;
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
