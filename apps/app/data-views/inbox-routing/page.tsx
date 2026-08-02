"use client";

/**
 * Index state for the /data-views route. The DataViews shell itself lives in
 * `layout.tsx` so it survives navigation to `/data-views/[id]`; this page is
 * only the empty-detail placeholder shown before a row is picked.
 */
export default function DataViewsDemo() {
  return (
    <div className="flex h-full items-center justify-center bg-background-presentation-body-primary">
      <p className="text-content-presentation-global-tertiary">Select an item to view details</p>
    </div>
  );
}
