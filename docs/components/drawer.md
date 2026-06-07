---
title: Drawer
description: Gesture-based sliding panel built on Vaul. Anchors to the bottom, left, or right of the screen, supports nested/stacked drawers, and composes with SectionBlock + InputField to build create and edit forms.
group: Overlays & Dialogs
keywords: [drawer, sheet, side-panel, bottom-sheet, slide, vaul, form, create, edit, sectionblock, nested, drag-to-dismiss]
---

# Drawer

> A gesture-based sliding panel built on [Vaul](https://vaul.emilkowal.ski/). It can slide up from the **bottom**, in from the **right**, or in from the **left**. It supports drag-to-dismiss, nested/stacked drawers with an iOS-style scale-back effect, an optional "notch" tab on the top edge, and a dark framed "tray" look. It is the recommended surface for create / edit forms, filter panels, side navigation, action sheets, and full-screen editors.

> [!IMPORTANT]
> The Drawer is **composed**, not configured. There is no single `direction` style switch on `DrawerContent`. You pick the anchor on the root `<Drawer direction="...">` and then pass layout classes (`wrapperClassName`, `className`, `trayClassName`) plus a few flags (`framed`, `showHandle`, `notch`, `notchSide`) to get the bottom / right / left look. The recipes below give you exact, copy-paste class strings for each direction.

## Installation

```bash
npx torch-glare@latest add Drawer
```

The Drawer's only third-party dependency is [`vaul`](https://www.npmjs.com/package/vaul), which the CLI installs automatically.

> [!NOTE]
> **Building create / edit forms?** The Drawer ships on its own. The form examples on this page also use `SectionBlock`, `InputField`, and `Button`. Install them alongside it:
>
> ```bash
> npx torch-glare@latest add Drawer SectionBlock InputField Button
> ```
>
> These are *not* auto-installed by `add Drawer`, because `Drawer.tsx` does not import them — they are only needed for the form composition pattern, not for the Drawer itself.

## Import

```tsx
import {
  Drawer,
  DrawerNested,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerHeaderTitle,
  DrawerHeaderActions,
  DrawerBadge,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  // Notch (the tab that sticks out of the top edge)
  DrawerNotch,
  DrawerNotchClose,
  DrawerNotchPill,
  DrawerNotchDivider,
  DrawerNotchApp,
  // Lower-level primitives (rarely needed directly)
  DrawerPortal,
  DrawerOverlay,
} from "@/components/Drawer";
```

## Anatomy

```tsx
<Drawer>                      {/* root — owns open state + direction */}
  <DrawerTrigger />           {/* what opens the drawer (use asChild) */}
  <DrawerContent>            {/* the panel; controls tray/frame/handle/notch */}
    <DrawerHeader>
      <DrawerHeaderTitle>    {/* dark pill holding the title + a badge */}
        <DrawerBadge />
        <DrawerTitle />
      </DrawerHeaderTitle>
      <DrawerHeaderActions /> {/* dark pill holding header buttons */}
    </DrawerHeader>

    {/* ...your body content... */}

    <DrawerFooter>
      <DrawerClose />          {/* anything that should close the drawer */}
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

## Quick Examples

### Basic (bottom sheet)

The default. Slides up from the bottom with a drag handle. Use `framed={false}` for the clean sheet look (no dark tray border).

```tsx
<Drawer>
  <DrawerTrigger asChild>
    <Button variant="PrimeStyle">Open drawer</Button>
  </DrawerTrigger>
  <DrawerContent framed={false}>
    <DrawerHeader>
      <DrawerTitle>Basic drawer</DrawerTitle>
      <DrawerDescription>
        Drag the handle down or press Escape to close.
      </DrawerDescription>
    </DrawerHeader>

    <div className="px-4 pb-4">
      <p className="typography-body-small-regular text-content-presentation-action-light-secondary">
        Put any content here — forms, lists, settings.
      </p>
    </div>

    <DrawerFooter>
      <DrawerClose asChild>
        <Button variant="PrimeStyle">Done</Button>
      </DrawerClose>
      <DrawerClose asChild>
        <Button variant="BorderStyle">Cancel</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

### Create / Edit form (Drawer + SectionBlock)

This is the headline pattern: a **right-anchored** drawer that holds a form, grouped into `SectionBlock`s, with the inputs laid out as label-on-left / field-on-right rows. The same layout works for both **"New item"** (empty fields) and **"Edit item"** (pass `defaultValue` to each field and swap the badge/title).

```tsx
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerHeaderTitle,
  DrawerHeaderActions,
  DrawerBadge,
  DrawerTitle,
  DrawerClose,
  DrawerNotch,
  DrawerNotchClose,
  DrawerNotchPill,
} from "@/components/Drawer";
import { Button } from "@/components/Button";
import { SectionBlock } from "@/components/SectionBlock";
import { InputField } from "@/components/InputField";

function ContactDrawer({ mode = "create", contact }) {
  const isEdit = mode === "edit";

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="PrimeStyle">
          {isEdit ? "Edit contact" : "New contact"}
        </Button>
      </DrawerTrigger>

      <DrawerContent
        showHandle={false}
        /* The top-edge notch: close button + "Open in new tab" pill. */
        notch={
          <DrawerNotch>
            <DrawerClose asChild>
              <DrawerNotchClose />
            </DrawerClose>
            <DrawerNotchPill color="Yellow">
              Open in new tab
              <i className="ri-arrow-right-up-line text-[12px]" />
            </DrawerNotchPill>
          </DrawerNotch>
        }
        wrapperClassName="top-2 right-2 bottom-2 left-auto mt-0 h-auto w-[1046px] max-w-[calc(100vw-16px)]"
        /* With a notch, round all corners EXCEPT the top one the notch sits on. */
        className="rounded-tr-[16px] rounded-b-[16px]"
      >
        {/* Header: badge flips New / Edit, actions live in their own dark pill */}
        <DrawerHeader>
          <DrawerHeaderTitle>
            <DrawerBadge color={isEdit ? "Yellow" : "Blue"}>
              {isEdit ? "Edit" : "New"}
            </DrawerBadge>
            <DrawerTitle>Individual Contact</DrawerTitle>
          </DrawerHeaderTitle>
          <div className="flex items-center">
            <Button variant="PrimeStyle" size="L">Save Draft</Button>
          </div>
        </DrawerHeader>

        {/* Scrollable body holds the grouped form sections */}
        <div className="flex-1 overflow-y-auto px-12 py-6 space-y-3">
          <SectionBlock
            color="Blue"
            containerClassName="w-full"
            title={
              <span className="flex items-center gap-[6px]">
                <i className="ri-draft-fill" />
                Identity
              </span>
            }
          >
            <FieldRow
              label="Name"
              required
              right={
                <div className="flex flex-1 min-w-0 items-center gap-3">
                  <InputField
                    placeholder="First Name*"
                    defaultValue={contact?.firstName}
                    className="flex-1 min-w-0"
                  />
                  <InputField
                    placeholder="Last Name*"
                    defaultValue={contact?.lastName}
                    className="flex-1 min-w-0"
                  />
                </div>
              }
            />
            <RowDivider />
            <FieldRow
              label="Email"
              required
              right={
                <InputField
                  type="email"
                  placeholder="name@example.com"
                  defaultValue={contact?.email}
                  className="flex-1"
                />
              }
            />
            <RowDivider />
            <FieldRow
              label="Phone"
              right={
                <InputField
                  placeholder="+1 555 0000"
                  defaultValue={contact?.phone}
                  className="flex-1"
                />
              }
            />
          </SectionBlock>

          <SectionBlock
            color="Purple"
            containerClassName="w-full"
            title={
              <span className="flex items-center gap-[6px]">
                <i className="ri-map-pin-line" />
                Address
              </span>
            }
          >
            <FieldRow
              label="Street"
              right={<InputField placeholder="123 Main St" className="flex-1" />}
            />
            <RowDivider />
            <FieldRow
              label="City"
              right={<InputField placeholder="San Francisco" className="flex-1" />}
            />
          </SectionBlock>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

/* Reusable label-on-left / field-on-right row. */
function FieldRow({ label, required, right }) {
  return (
    <div className="flex items-center gap-6 py-[18px]">
      <div className="flex w-[180px] shrink-0 items-center gap-[6px]">
        <span className="typography-body-medium-regular text-content-presentation-action-light-primary">
          {label}
        </span>
        {required && (
          <span className="typography-body-small-medium text-content-presentation-state-negative">
            (Required)
          </span>
        )}
      </div>
      <div className="flex flex-1 min-w-0 items-center">{right}</div>
    </div>
  );
}

/* Thin separator between rows inside a SectionBlock. */
function RowDivider() {
  return <div className="h-px w-full bg-border-presentation-global-primary" />;
}
```

> **Create vs. Edit in one component.** Keep a single drawer and branch on a `mode` prop:
> - **Badge / title** — `<DrawerBadge color={isEdit ? "Yellow" : "Blue"}>{isEdit ? "Edit" : "New"}</DrawerBadge>`.
> - **Fields** — spread the existing record into each input's `defaultValue` (or `value` if controlled). Empty in create mode, pre-filled in edit mode.
> - **Footer / actions** — keep "Save Draft" / "Save" identical; only the submit handler changes (POST vs. PATCH).

### Nested drawers (multi-step)

`DrawerNested` must live **inside** an already-open `DrawerContent`. The parent scales down and slides back; the child slides in on top. Great for `cart → shipping → payment` style flows or drill-down settings.

```tsx
<Drawer>
  <DrawerTrigger asChild>
    <Button variant="PrimeStyle">Checkout</Button>
  </DrawerTrigger>
  <DrawerContent framed={false}>
    <DrawerHeader>
      <DrawerTitle>Your cart</DrawerTitle>
      <DrawerDescription>1 item — $129.00</DrawerDescription>
    </DrawerHeader>

    <DrawerFooter>
      <DrawerNested>
        <DrawerTrigger asChild>
          <Button variant="PrimeStyle">Continue to shipping</Button>
        </DrawerTrigger>
        <DrawerContent framed={false}>
          <DrawerHeader>
            <DrawerTitle>Shipping</DrawerTitle>
          </DrawerHeader>
          {/* ...another DrawerNested inside here for payment... */}
        </DrawerContent>
      </DrawerNested>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

### Notch (top-edge tab)

The notch is an optional tab that sticks out of the top edge of the drawer — used for a close button plus an "Open in new tab" / "Open in the app" affordance. Pass it to `DrawerContent` via the `notch` prop. When a notch is present, hide the drag handle (`showHandle={false}`) and use the asymmetric corner rounding (`className="rounded-tr-[16px] rounded-b-[16px]"` for a right drawer) so the panel tucks under the notch.

**Simple notch** — close button + "Open in new tab" pill. This is the most common form, used on the create/edit drawer above:

```tsx
<DrawerContent
  showHandle={false}
  className="rounded-tr-[16px] rounded-b-[16px]"
  notch={
    <DrawerNotch>
      <DrawerClose asChild>
        <DrawerNotchClose />
      </DrawerClose>
      <DrawerNotchPill color="Yellow">
        Open in new tab
        <i className="ri-arrow-right-up-line text-[12px]" />
      </DrawerNotchPill>
    </DrawerNotch>
  }
>
  {/* ... */}
</DrawerContent>
```

**App notch** — adds an app icon + name and a colored "Open in the app" pill, separated by a divider:

```tsx
<DrawerContent
  showHandle={false}
  className="rounded-tr-[16px] rounded-b-[16px]"
  notch={
    <DrawerNotch>
      <DrawerClose asChild>
        <DrawerNotchClose />
      </DrawerClose>
      <DrawerNotchDivider />
      <DrawerNotchApp
        icon={<i className="ri-customer-service-2-fill text-white text-[14px]" />}
        name="Sales & Services App"
      />
      <DrawerNotchPill color="Blue">
        Open in the app
        <i className="ri-arrow-right-up-line text-[12px]" />
      </DrawerNotchPill>
    </DrawerNotch>
  }
>
  {/* ... */}
</DrawerContent>
```

#### What "Open in new tab" does

> [!IMPORTANT]
> **`DrawerNotchPill` has no built-in navigation — it is a styled `<button>`.** The "Open in new tab" interaction is a pattern *you* wire up. The intended behavior is:
>
> **Clicking "Open in new tab" opens the *same content* the drawer is showing, but as a standalone full page (its own route) in a new browser tab — not as a drawer.**
>
> The drawer is the *quick/inline* way to view or edit a record; the full page is the *expanded* view of the exact same thing (same form, same data), just rendered at full width instead of in the side panel. So a "New contact" drawer opens a full-page "New contact" form; an "Edit contact #42" drawer opens the full-page edit route for contact 42.

**How to wire it.** Point the pill at the route that renders the same section as a page, and open it in a new tab. `DrawerNotchPill` forwards all button props, so use `onClick`:

```tsx
// `href` is the full-page route that renders the SAME section/form as the drawer.
// For an edit drawer, include the record id so the page opens pre-filled:
//   const href = isEdit ? `/contacts/${contact.id}/edit` : "/contacts/new";

<DrawerNotchPill
  color="Yellow"
  onClick={() => window.open(href, "_blank", "noopener")}
>
  Open in new tab
  <i className="ri-arrow-right-up-line text-[12px]" />
</DrawerNotchPill>
```

Or, if you prefer a real anchor (better for middle-click / "copy link"), wrap a styled link instead of the pill — the pill is just a button, so for true link semantics render your own `<a target="_blank">` with the same classes, or in Next.js:

```tsx
import Link from "next/link";

<Link href={href} target="_blank" rel="noopener" className="contents">
  <DrawerNotchPill color="Yellow" tabIndex={-1}>
    Open in new tab
    <i className="ri-arrow-right-up-line text-[12px]" />
  </DrawerNotchPill>
</Link>
```

**The contract:** the drawer and the full page must render the **same section component** with the **same data**. Build the form body (the `SectionBlock` groups + fields) as a shared component, drop it into the `DrawerContent` for the inline view and into a normal page route for the full-page view. That guarantees "open in new tab" shows an identical form — just full-page instead of in the drawer.

> The **"Open in the app"** pill (App notch) follows the same idea but targets a different surface — e.g. a deep link into a separate application — rather than a full-page route in the same app.

## Direction — how bottom, right, and left differ

There is **no automatic per-direction styling**. The anchor is set on the root with `direction`, and the *look* (where it sits, which corners round, whether there's a drag handle or a frame) comes from props you pass to `DrawerContent`. Here is exactly what changes per direction and the copy-paste recipe for each.

| Aspect | Bottom (default) | Right | Left |
|---|---|---|---|
| Root prop | _(none)_ | `direction="right"` | `direction="left"` |
| Sits at | full width, pinned to bottom | floating panel on the right | floating panel on the left |
| Drag handle | **shown** (`showHandle` default `true`) | hidden (`showHandle={false}`) | hidden (`showHandle={false}`) |
| Frame / tray | usually off (`framed={false}`) for clean sheet | on (default) for the dark tray | on (default) |
| Rounded corners | top corners only | all/left corners | top-left + bottom corners |
| Notch side | top-left (`notchSide="left"`) | top-left | mirror to `notchSide="right"` |
| Best for | mobile sheets, action sheets, comments | create/edit forms, filters, detail panels | RTL panels, side navigation |

### Bottom (default)

No `direction` prop. Keep the drag handle; drop the frame for a clean sheet.

```tsx
<Drawer>
  <DrawerTrigger asChild>
    <Button variant="PrimeStyle">Open bottom sheet</Button>
  </DrawerTrigger>
  <DrawerContent framed={false}>
    {/* drag handle appears automatically */}
    <DrawerHeader>
      <DrawerTitle>Comments</DrawerTitle>
    </DrawerHeader>
    {/* ... */}
  </DrawerContent>
</Drawer>
```

**Half-screen / snap points** — the bottom drawer can open to half height then snap to full. Drive it with Vaul's `snapPoints` on the root:

```tsx
<Drawer snapPoints={[0.5, 1]} fadeFromIndex={1}>
  <DrawerTrigger asChild>
    <Button variant="PrimeStyle">Open half-screen</Button>
  </DrawerTrigger>
  <DrawerContent framed={false} wrapperClassName="h-full max-h-[97vh]">
    {/* ... */}
  </DrawerContent>
</Drawer>
```

### Right

A floating panel anchored to the right edge — the canonical home for create/edit forms and filter panels. Hide the handle, anchor with `wrapperClassName`, round the corners.

```tsx
<Drawer direction="right">
  <DrawerTrigger asChild>
    <Button variant="PrimeStyle">Open right drawer</Button>
  </DrawerTrigger>
  <DrawerContent
    showHandle={false}
    wrapperClassName="top-2 right-2 bottom-2 left-auto mt-0 h-auto w-[420px] max-w-[calc(100vw-16px)]"
    trayClassName="rounded-[16px]"
    className="rounded-[10px]"
  >
    <DrawerHeader>
      <DrawerTitle>Filters</DrawerTitle>
      <DrawerDescription>Status, owner, tags, priority…</DrawerDescription>
    </DrawerHeader>
    <div className="px-4 pb-4 space-y-3 flex-1 overflow-y-auto">
      {/* ...filter rows... */}
    </div>
    <DrawerFooter>
      <DrawerClose asChild>
        <Button variant="PrimeStyle">Apply</Button>
      </DrawerClose>
      <DrawerClose asChild>
        <Button variant="BorderStyle">Reset</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

> Widen `w-[420px]` to `w-[1046px]` (as in the form example) for a roomy two-column form. Always pair a fixed width with `max-w-[calc(100vw-16px)]` so it never overflows on small screens.

### Left (RTL / navigation)

Mirror of the right recipe: `direction="left"`, anchor to the left edge, and if you use a notch, set `notchSide="right"` so the tab mirrors correctly.

```tsx
<Drawer direction="left">
  <DrawerTrigger asChild>
    <Button variant="PrimeStyle">Open left drawer</Button>
  </DrawerTrigger>
  <DrawerContent
    showHandle={false}
    notchSide="right"
    wrapperClassName="top-2 left-2 bottom-2 right-auto mt-0 h-auto w-[420px] max-w-[calc(100vw-16px)]"
    className="rounded-tl-[16px] rounded-b-[16px]"
    notch={
      <DrawerNotch>
        <DrawerClose asChild>
          <DrawerNotchClose />
        </DrawerClose>
        <DrawerNotchPill color="Yellow">
          Open in new tab
          <i className="ri-arrow-right-up-line text-[12px]" />
        </DrawerNotchPill>
      </DrawerNotch>
    }
  >
    <DrawerHeader>
      <DrawerHeaderTitle>
        <DrawerBadge color="Purple">Menu</DrawerBadge>
        <DrawerTitle>Navigation</DrawerTitle>
      </DrawerHeaderTitle>
    </DrawerHeader>
    {/* ...nav items... */}
  </DrawerContent>
</Drawer>
```

### Full-screen

Anchor a bottom drawer to every edge via `wrapperClassName`.

```tsx
<Drawer>
  <DrawerTrigger asChild>
    <Button variant="PrimeStyle">Open full-screen</Button>
  </DrawerTrigger>
  <DrawerContent
    framed={false}
    wrapperClassName="inset-x-0 top-0 bottom-0 m-0 h-screen w-screen max-w-none"
  >
    {/* immersive editor / media viewer */}
  </DrawerContent>
</Drawer>
```

## API Reference

### `Drawer` (root)

Wraps Vaul's `Drawer.Root` and defaults `shouldScaleBackground` to `true`. Accepts all [Vaul Root props](https://vaul.emilkowal.ski/api).

| Prop | Type | Default | Description |
|---|---|---|---|
| `direction` | `"bottom" \| "top" \| "left" \| "right"` | `"bottom"` | Edge the drawer slides in from. |
| `shouldScaleBackground` | `boolean` | `true` | Scales/pushes the page back when open (the iOS sheet effect). |
| `open` | `boolean` | — | Controlled open state. |
| `onOpenChange` | `(open: boolean) => void` | — | Fires when open state changes. |
| `snapPoints` | `(number \| string)[]` | — | Snap stops, e.g. `[0.5, 1]` for half then full. |
| `fadeFromIndex` | `number` | — | Snap index from which the overlay starts to fade. |
| `nested` | `boolean` | — | Prefer the `DrawerNested` component instead. |

### `DrawerContent`

The panel. This is where direction-specific styling is applied.

| Prop | Type | Default | Description |
|---|---|---|---|
| `framed` | `boolean` | `true` | Show the dark "tray" frame (border + inset shadow) around the panel. Set `false` for clean bottom sheets. |
| `showHandle` | `boolean` | `true` | Show the centered drag handle. Auto-hidden when a `notch` is present. Set `false` for side drawers. |
| `notch` | `ReactNode` | — | A `DrawerNotch` tab rendered on the top edge. |
| `notchSide` | `"left" \| "right"` | `"left"` | Which side the notch attaches to (and which corner stays square). Use `"right"` for left-anchored drawers. |
| `wrapperClassName` | `string` | — | Classes on the outer positioned element — this is how you anchor/size the panel per direction. |
| `trayClassName` | `string` | — | Classes on the dark tray frame (e.g. corner rounding). |
| `className` | `string` | — | Classes on the inner light content surface. |
| `...props` | Vaul `Content` props | — | Forwarded to `Drawer.Content`. |

### Sub-components

| Component | Description |
|---|---|
| `DrawerTrigger` | Opens the drawer. Use `asChild` to wrap your own button. |
| `DrawerClose` | Closes the drawer. Use `asChild` to wrap any element. |
| `DrawerNested` | A nested/stacked drawer. Must be rendered inside an open `DrawerContent`. |
| `DrawerHeader` | Header row (space-between layout) holding title + actions. |
| `DrawerHeaderTitle` | Dark rounded pill that groups a `DrawerBadge` + `DrawerTitle`. |
| `DrawerHeaderActions` | Dark rounded pill (right-aligned) for header buttons. |
| `DrawerTitle` | Accessible title (maps to Vaul `Drawer.Title`). |
| `DrawerDescription` | Muted supporting text (maps to Vaul `Drawer.Description`). |
| `DrawerBadge` | Small uppercase status pill. `color`: `Blue \| Green \| Red \| Yellow \| Purple \| Gray` (default `Blue`). |
| `DrawerFooter` | Bottom action area (`mt-auto`, stacked). |
| `DrawerNotch` | The top-edge tab container. `side`: `"left" \| "right"`. |
| `DrawerNotchClose` | Round close button for inside a notch. |
| `DrawerNotchPill` | Pill button for inside a notch. `color`: `Yellow \| Blue \| Gray` (default `Yellow`). Styled `<button>` only — wire navigation yourself via `onClick` (see ["What 'Open in new tab' does"](#what-open-in-new-tab-does)). |
| `DrawerNotchDivider` | Thin vertical divider between notch items. |
| `DrawerNotchApp` | App identity block (icon + name) for inside a notch. Props: `icon?`, `name`. |
| `DrawerPortal` / `DrawerOverlay` | Lower-level primitives; rarely used directly. |

## Best Practices

- **Pick the anchor by job.** Bottom for mobile sheets / action sheets / comments; right for create-edit forms and filter/detail panels; left for RTL panels and side navigation.
- **Side drawers: hide the handle.** Always pass `showHandle={false}` on left/right drawers — the drag handle only makes sense on a bottom sheet.
- **Always cap the width.** Pair any fixed `w-[…]` with `max-w-[calc(100vw-16px)]` so the panel never overflows narrow viewports.
- **One drawer for create *and* edit.** Branch on a `mode` prop for the badge/title and feed `defaultValue`/`value` from the record. Don't build two near-identical drawers.
- **Group form fields with `SectionBlock`.** Use a colored `SectionBlock` per logical group (Identity, Address, …) and the `FieldRow` / `RowDivider` helpers for consistent label/field rows.
- **Make the body scroll, not the panel.** Put `flex-1 overflow-y-auto` on the body wrapper so the header/footer stay pinned while content scrolls.
- **`DrawerNested` only inside an open drawer.** It will not work as a standalone trigger.

## Related Components

- **[Dialog](./dialog.md)** — centered modal for short confirmations and compact forms.
- **[AlertDialog](./alert-dialog.md)** — blocking confirmation for destructive actions.
- **[SectionBlock](./section-block.md)** — the grouping container used for the form body above.
- **[InputField](./input-field.md)** — the input used in the form rows.
