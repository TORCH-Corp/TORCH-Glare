"use client";

import { Switch } from "../../Switch";
import { RAW_CLASS } from "../styles";

/**
 * DataViews config-panel form controls.
 *
 * The config panel is wrapped in `data-theme="dark"`, so theme-aware
 * components (DataViewRadio, Switch) render in dark mode automatically. The
 * green-checked Switch hex is the only thing this panel still hardcodes
 * because it sits outside the theme system.
 */

// Shared <Switch> with the Figma Switcher-1.0 "On" green, applied regardless of
// the panel's dark theme scope. The hex itself lives in `styles.ts`.
const SWITCH_GREEN = RAW_CLASS.switchOn;

type DataViewsSwitchProps = {
  checked: boolean;
  onCheckedChange: () => void;
};

/** Column show/hide toggle: the library <Switch> pre-styled to the panel's
 *  Figma green-checked spec. */
export function DataViewsSwitch({ checked, onCheckedChange }: DataViewsSwitchProps) {
  return <Switch checked={checked} onCheckedChange={onCheckedChange} className={SWITCH_GREEN} />;
}
