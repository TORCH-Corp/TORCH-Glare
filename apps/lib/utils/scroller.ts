/**
 * LOCAL PATCH (Contact Center): the design's 14px horizontal scroller — a thin track that thickens
 * and turns blue on hover.
 *
 * Lives here, not on `Table`, because two unrelated components wear it: `TableScroller` (the
 * wrapper `FormBuilder.Table` puts around its grid) and `SectionBlock`'s body (which scrolls any
 * wide content dropped into a section card). A section card should not have to import the table
 * component — and its consumers should not pull in the table's dependencies — just to share a
 * scrollbar.
 *
 * `overflow-y-hidden` is part of the set on purpose: CSS computes `overflow-y: visible` to `auto`
 * whenever `overflow-x` is not `visible`, so omitting it gives every consumer a spurious vertical
 * scrollbar.
 */
export const horizontalScrollerStyles = [
  "overflow-x-auto overflow-y-hidden",
  "[&::-webkit-scrollbar]:h-[14px]",
  "[&::-webkit-scrollbar-track]:bg-transparent",
  "[&::-webkit-scrollbar-thumb]:rounded-[7px]",
  "[&::-webkit-scrollbar-thumb]:border-[5px] [&::-webkit-scrollbar-thumb]:border-solid",
  "[&::-webkit-scrollbar-thumb]:border-transparent",
  "[&::-webkit-scrollbar-thumb]:bg-clip-content",
  "[&::-webkit-scrollbar-thumb]:bg-background-presentation-body-scroller-default",
  "[&::-webkit-scrollbar-thumb:hover]:border-[3px]",
  "[&::-webkit-scrollbar-thumb:hover]:bg-background-presentation-body-scroller-hover",
].join(" ");
