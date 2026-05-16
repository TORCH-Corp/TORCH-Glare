"use client"

import { Settings } from "lucide-react"
import type { ReactNode } from "react"
import type { ViewType } from "./types"
import { Button } from "../Button"
import { cn } from "../../utils/cn"

export type DataViewsHeaderView = {
  id: ViewType
  label: string
  icon: ReactNode
}

type DataViewsHeaderProps = {
  title: string
  views: DataViewsHeaderView[]
  currentView: ViewType
  onViewChange: (view: ViewType) => void
  showSettings: boolean
  settingsOpen: boolean
  onToggleSettings: () => void
  onAddNew?: () => void
  addNewLabel?: string
  className?: string
}

export function DataViewsHeader({
  title,
  views,
  currentView,
  onViewChange,
  showSettings,
  settingsOpen,
  onToggleSettings,
  onAddNew,
  addNewLabel = "Add New",
  className,
}: DataViewsHeaderProps) {
  return (
    <div
      // Header is always dark. data-theme="dark" makes the child Button
      // components resolve dark-theme tokens (correct against the black bar)
      // even when the host app runs in default/light theme.
      data-theme="dark"
      className={cn(
        "flex h-[52px] w-full items-center gap-2 rounded-[12px] bg-black px-2",
        className,
      )}
    >
      {/* Title pill */}
      <div className="flex h-9 shrink-0 items-center gap-2 rounded-[12px] border border-[#434446] bg-[#252729] px-[10px]">
        <span className="text-[28px] font-[510] uppercase leading-[1.19] text-white">
          {title}
        </span>
      </div>

      {/* Divider */}
      <div className="h-7 w-px shrink-0 bg-[#434446]" />

      {/* Segmented view switcher */}
      <div className="flex flex-1 items-center">
        <div className="flex items-center gap-[2px] rounded-[10px] bg-[#252729] p-[2px] shadow-[inset_0_0_4px_0_rgba(0,0,0,0.08)]">
          {views.map((view, idx) => {
            const active = view.id === currentView
            const prevActive = idx > 0 && views[idx - 1].id === currentView
            // Separator sits between two inactive tabs only; the active white
            // pill never has a flanking divider (matches Figma).
            const showDivider = idx > 0 && !active && !prevActive
            return (
              <div key={view.id} className="flex items-center">
                {showDivider && (
                  <div className="mx-[3px] h-3 w-px bg-[#434446]" />
                )}
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => onViewChange(view.id)}
                  className={cn(
                    "flex h-6 items-center gap-[6px] rounded-[8px] px-3 text-[14px] font-[510] leading-none transition-all duration-200 ease-in-out",
                    active
                      ? "bg-white text-black shadow-[0_0_10px_2px_rgba(0,0,0,0.25)]"
                      : "bg-transparent text-white hover:bg-white/5",
                  )}
                >
                  <span className="flex h-[14px] w-[14px] items-center justify-center [&_svg]:h-[14px] [&_svg]:w-[14px]">
                    {view.icon}
                  </span>
                  {view.label}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Action bar */}
      <div className="flex shrink-0 items-center gap-2">
        {onAddNew && (
          <Button
            variant="PrimeStyle"
            size="M"
            onClick={onAddNew}
            className="rounded-[6px] bg-[#005ECC] px-[14px] text-[16px] font-[510] text-white hover:bg-[#005ECC]/90"
          >
            {addNewLabel}
          </Button>
        )}
        {/* Hidden while the panel is open — the panel has its own close
            control, so the header trigger would be redundant. */}
        {showSettings && !settingsOpen && (
          <Button
            variant="BluContStyle"
            size="M"
            onClick={onToggleSettings}
            aria-pressed={settingsOpen}
            className="gap-[6px] rounded-[6px] px-[14px] text-[16px] font-[510]"
          >
            <Settings className="h-[18px] w-[18px]" />
            Filter &amp; Config.
          </Button>
        )}
      </div>
    </div>
  )
}
