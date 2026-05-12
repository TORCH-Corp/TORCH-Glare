"use client"

import { Drawer } from "vaul"
import { Menu, X } from "lucide-react"
import type { ReactNode } from "react"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}

export function TreeDrawer({ open, onOpenChange, children }: Props) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} direction="left">
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Drawer.Content
          className="fixed inset-y-0 left-0 z-50 w-72 bg-background-presentation-body-overlay-primary border-r border-border-presentation-global-primary outline-none flex flex-col"
        >
          <div className="flex items-center justify-between p-3 border-b border-border-presentation-global-primary">
            <Drawer.Title className="text-sm font-semibold text-content-presentation-global-primary">
              Tree
            </Drawer.Title>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Close tree"
              className="p-1 rounded text-content-presentation-global-tertiary hover:text-content-presentation-global-primary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export function TreeDrawerTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open tree"
      className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-border-presentation-global-primary text-content-presentation-global-secondary hover:text-content-presentation-global-primary"
    >
      <Menu className="w-4 h-4" />
    </button>
  )
}
