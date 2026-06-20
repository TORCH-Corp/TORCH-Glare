# Building with TORCH Glare

TORCH Glare is a React + Radix UI + Tailwind component library. Compose screens
from its components (imported from the bundle) and use its **semantic Tailwind
utility classes** for your own layout glue. Do not hand-write component CSS or
invent class names — the design language lives in the tokens below.

## Theme wrapping (required for correct colors)

Every token resolves per the `data-theme` attribute on an ancestor. TORCH Glare's
themes are, counter-intuitively:

- `data-theme="default"` → the **LIGHT** theme (dark text on light surfaces). Use
  this for normal app UI on a white/light page.
- `data-theme="dark"` → the dark theme (light text on dark surfaces).
- No `data-theme` ancestor → falls back to the DARK variant, so a component placed
  on a white page with no theme wrapper renders dark-on-dark and looks broken.

**Always wrap your app (or each surface) in a themed container.** Components also
accept a `theme` prop (`"default" | "dark" | "light"`) that sets `data-theme` on
themselves. For a whole app, wrap once:

```jsx
<div data-theme="default" className="bg-background-presentation-form-base text-content-presentation-global-primary min-h-screen">
  {/* your screen */}
</div>
```

`ThemeProvider` (exported) additionally syncs theme to `localStorage` + the
`<html>` element if you want runtime theme switching — but it is NOT required for
styling; the `data-theme` attribute is what colors everything.

## The styling idiom: semantic Tailwind utilities

Style YOUR layout with TORCH Glare's semantic classes (not raw hex, not generic
Tailwind colors). The class name encodes context → element → state:

`{bg|text|border}-{background|content|border}-{presentation|system}-{group}-{...}`

- `presentation` = normal content UI (forms, cards, tables). `system` = chrome
  (sidebars, app shell, headers) — usually dark.

Real families you can use (all verified in the shipped stylesheet):

| Purpose | Example classes |
|-|-|
| Surfaces (bg) | `bg-background-presentation-form-base`, `bg-background-presentation-form-field-primary`, `bg-background-presentation-action-secondary`, `bg-background-presentation-action-hover`, `bg-background-presentation-action-disabled`, `bg-background-presentation-action-selected` |
| Badge surfaces | `bg-background-presentation-badge-blue`, `-green`, `-red`, `-purple`, `-gray`, `-navy`, `-red-orange` (each has a matching `text-content-presentation-badge-*`) |
| Text | `text-content-presentation-global-primary`, `text-content-presentation-action-light-primary`, `text-content-presentation-action-link`, `text-content-presentation-state-disabled` |
| Borders | `border-border-presentation-action-primary`, `border-border-presentation-action-hover`, `border-border-presentation-state-focus`, `border-border-presentation-state-negative` |
| State (negative/success/etc.) | `bg-background-presentation-state-negative-primary`, `border-border-presentation-state-negative`, `text-content-presentation-state-success` |
| Typography | `typography-body-small-regular`, `typography-body-medium-medium`, `typography-body-large-semibold`, `typography-display-large-bold`, `typography-headers-*` |

Sizes across the system: `S` (22px) / `M` (28px) / `L` (34px) / `XL` (40px) — most
form/button components take a `size` prop using these.

## Where the truth lives

- **Tokens & classes**: the bound stylesheet `styles.css` and its `@import`
  closure (`_ds_bundle.css`, `fonts/fonts.css`). Read these for the exact set of
  available token classes before styling — they enumerate every `--*` token and
  every emitted utility.
- **Per-component API**: each `components/<group>/<Name>/<Name>.d.ts` is the prop
  contract; `<Name>.prompt.md` is the usage doc. Read these before composing a
  component.

## Common composition gotchas

- **Compound components**: `Input` is a compound — its parts are bare exports
  imported flat from `torch-glare`: `import { Group, Icon, Input, Trilling }` then
  `<Group><Icon>…</Icon><Input/></Group>` (`Trilling` is the trailing slot; bare
  `<Input>` is just the `<input>`). `InputOTP` uses `InputOTPGroup` +
  `InputOTPSlot`. Tables, Dialogs, Dropdowns, Selects, etc. compose from named
  sub-parts (e.g. `DialogContent`, `SelectTrigger`, `TableRow`) — all bundle
  exports; check each component's `.d.ts`/`.prompt.md`.
- **`InputField`** is the higher-level single field (extends `<input>` attrs, so
  `placeholder` etc. work) with `size`/`variant`/`icon`/`errorMessage` props; it
  has no `label` prop — use `InnerLabelField`/`LabelField`/`Label` for labeling.
- **Radio**: `Radio` / `LabeledRadio` / `RadioCard` must live inside a `RadioGroup`.
- **`system`-style components** (SearchField, ProfileMenu, drawers, sidebars) are
  designed for dark surfaces — place them in a `data-theme="dark"` region.
- **Icons** are Remix Icon classes: `<i className="ri-search-line" />`. The font
  ships with the DS; use any `ri-*` name.

## One idiomatic example

```jsx
import { Button, InputField, Badge, Label } from "torch-glare";

function CreateProjectCard() {
  return (
    <div
      data-theme="default"
      className="bg-background-presentation-form-base border border-border-presentation-action-primary rounded-lg p-6 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="typography-body-large-semibold text-content-presentation-global-primary">
          New project
        </h2>
        <Badge label="Draft" variant="gray" />
      </div>
      <div className="flex flex-col gap-1">
        <Label label="Project name" size="M" />
        <InputField placeholder="Acme marketing site" size="M" />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="BorderStyle">Cancel</Button>
        <Button variant="PrimeStyle">Create project</Button>
      </div>
    </div>
  );
}
```
