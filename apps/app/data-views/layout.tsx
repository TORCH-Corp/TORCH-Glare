import type { ReactNode } from "react";

import { DemoSidebar } from "./_shared";

export default function DataViewsGalleryLayout({ children }: { children: ReactNode }) {
  return (
    // Fixed-height row: the sidebar scrolls independently and each example page
    // gets the remaining width and height to mount a DataViews shell into.
    <div className="flex h-screen overflow-hidden bg-background-presentation-body-primary">
      <DemoSidebar />
      <main className="min-w-0 flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
