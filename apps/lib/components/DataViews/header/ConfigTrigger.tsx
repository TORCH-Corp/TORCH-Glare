"use client";

import { Settings } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "../../Button";
import { useDataViews } from "../context";

export type ConfigTriggerProps = {
  children?: ReactNode;
  className?: string;
};

/**
 * Opens the config rail. Hides itself while the rail is open — the rail has its
 * own close control, so a second trigger would be redundant.
 */
export function DataViewsConfigTrigger({
  children = "Filter & Config.",
  className,
}: ConfigTriggerProps) {
  const { panel } = useDataViews();

  if (panel.open) return null;

  return (
    <Button
      variant="BluContStyle"
      size="M"
      onClick={panel.toggle}
      aria-expanded={panel.open}
      className={className ?? "gap-[6px] rounded-[6px] px-[14px] text-[16px] font-[510]"}
    >
      <Settings className="h-[18px] w-[18px]" />
      {children}
    </Button>
  );
}
