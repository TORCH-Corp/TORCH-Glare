---
name: SectionBlock
title: SectionBlock
description: Sectioned card container with a colored title badge for grouping related content like forms, tables, or lists.
category: layout
group: Layout & Containers
tags: [layout, card, section, container, form, group]
status: stable
version: 1.1.22
dependencies:
  - "class-variance-authority": "^0.7.0"
---

# SectionBlock

> A card container with an optional colored title badge. Use it to group related content — custom field forms, tables, settings groups — under a clear, color-coded heading.

## Installation

```bash
npx torch-glare add SectionBlock
```

## Import

```typescript
import { SectionBlock, type SectionColor } from "@/components/SectionBlock";
```

## Basic Usage

```tsx
import { SectionBlock } from "@/components/SectionBlock";

export function Example() {
  return (
    <SectionBlock color="Blue" title="Project details">
      <p className="text-content-presentation-action-light-primary py-4">
        Card body content goes here.
      </p>
    </SectionBlock>
  );
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `SectionColor` | `"Blue"` | Color of the title badge. One of `Blue`, `Yellow`, `Green`, `Red`, `Orange`, `Purple`, `Pink`, `Gray`. |
| `title` | `ReactNode` | — | Title rendered inside the colored badge. Optional — when omitted, the header is hidden entirely. Accepts any ReactNode (string, JSX with icons, links, etc.). |
| `containerClassName` | `string` | — | Class name applied to the outer container (alongside `className`). |
| `headerClassName` | `string` | — | Class name applied to the header wrapper around the title badge. |
| `bodyClassName` | `string` | — | Class name applied to the body wrapper holding `children`. |
| `className` | `string` | — | Standard React class name on the outer container. |
| `children` | `ReactNode` | — | Body content. |
| `...rest` | `HTMLAttributes<HTMLDivElement>` | — | All standard div props except `title` (which is overridden). |

### TypeScript

```typescript
export type SectionColor =
  | "Blue"
  | "Yellow"
  | "Green"
  | "Red"
  | "Orange"
  | "Purple"
  | "Pink"
  | "Gray";

export interface SectionBlockProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  color?: SectionColor;
  title?: ReactNode;
  containerClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
}
```

The component is a `forwardRef<HTMLDivElement, SectionBlockProps>`.

## Examples

### All Colors

```tsx
import { SectionBlock, type SectionColor } from "@/components/SectionBlock";

const COLORS: SectionColor[] = [
  "Blue",
  "Yellow",
  "Green",
  "Red",
  "Orange",
  "Purple",
  "Pink",
  "Gray",
];

export function AllColors() {
  return (
    <div className="flex flex-col gap-[24px]">
      {COLORS.map((color) => (
        <SectionBlock key={color} color={color} title={`${color} section`}>
          <p className="text-content-presentation-action-light-primary py-4">
            This is a {color.toLowerCase()} sectioned card.
          </p>
        </SectionBlock>
      ))}
    </div>
  );
}
```

### No Title

When `title` is omitted, the header is hidden but the body padding remains.

```tsx
<SectionBlock>
  <p className="text-content-presentation-action-light-primary py-4">
    A SectionBlock without a title — header is hidden, body still padded.
  </p>
</SectionBlock>
```

### Rich Title with Icon

`title` accepts any ReactNode, so you can pass JSX with icons, counts, links, etc.

```tsx
<SectionBlock
  color="Purple"
  title={
    <span className="flex items-center gap-[6px]">
      <i className="ri-magic-line" />
      Rich title with icon
    </span>
  }
>
  <p className="text-content-presentation-action-light-primary py-4">
    The title prop is fully customizable.
  </p>
</SectionBlock>
```

### Custom Fields Form

A common pattern: pair `SectionBlock` with a row layout to build labeled-field forms.

```tsx
import { type ReactNode } from "react";
import { SectionBlock } from "@/components/SectionBlock";
import { InputField } from "@/components/InputField";
import { ActionButton } from "@/components/ActionButton";

export function CustomFieldsForm() {
  return (
    <SectionBlock
      color="Blue"
      title={
        <span className="flex items-center gap-[6px]">
          <i className="ri-edit-box-line" />
          Custom fields
        </span>
      }
    >
      <FieldRow
        label="Name"
        required
        right={
          <div className="flex flex-1 items-center gap-[12px]">
            <InputField placeholder="First Name*" className="flex-1" />
            <InputField placeholder="Last Name*" className="flex-1" />
          </div>
        }
      />

      <RowDivider />

      <FieldRow
        label="Department"
        right={<InputField placeholder="Write Hint Here" className="flex-1" />}
      />

      <RowDivider />

      <FieldRow
        label="Alias names"
        right={
          <InputField
            placeholder="Write Hint Here"
            className="flex-1"
            childrenSide={
              <ActionButton aria-label="Add alias name">
                <i className="ri-add-line" />
              </ActionButton>
            }
          />
        }
      />
    </SectionBlock>
  );
}

interface FieldRowProps {
  label: string;
  required?: boolean;
  right: ReactNode;
}

function FieldRow({ label, required, right }: FieldRowProps) {
  return (
    <div className="flex items-center gap-[24px] py-[18px]">
      <div className="flex w-[220px] shrink-0 items-center gap-[6px]">
        <span className="typography-body-medium-regular text-content-presentation-action-light-primary">
          {label}
        </span>
        {required && (
          <span className="typography-body-small-medium text-content-presentation-state-negative">
            (Required)
          </span>
        )}
      </div>
      <div className="flex flex-1 items-center">{right}</div>
    </div>
  );
}

function RowDivider() {
  return <div className="h-px w-full bg-border-presentation-global-primary" />;
}
```

### Bilingual Form with Language Switch (EN / AR)

A real-world pattern: a `SectionBlock` form with an EN/AR language switcher in the header. The colored title badge and the `TabSwitch` stay LTR; only the field rows flip to RTL when Arabic is selected, and all labels/placeholders are translated.

Key points:

- Put the `TabSwitch` in a `relative` wrapper and position it `absolute top-2 right-2` so it sits at the header's top-right **outside** the colored title badge (the badge wraps the entire `title` node).
- Apply `dir` to each field **row**, not to the `SectionBlock` root — otherwise the header (badge + switch) flips too.
- Drive copy through a tiny `t(en, ar)` helper keyed off the selected language.

```tsx
import { type ReactNode, useState } from "react";
import { SectionBlock } from "@/components/SectionBlock";
import { InputField } from "@/components/InputField";
import { ActionButton } from "@/components/ActionButton";
import { TabSwitch } from "@/components/TabSwitch";

export function BilingualFieldsForm() {
  const [language, setLanguage] = useState<"ar" | "en">("en");
  const isAr = language === "ar";
  const t = (en: string, ar: string) => (isAr ? ar : en);

  return (
    <div className="relative">
      <SectionBlock
        color="Blue"
        title={
          <span className="flex items-center gap-[6px]">
            <i className="ri-edit-box-line" />
            {t("Custom fields", "حقول مخصصة")}
          </span>
        }
      >
        <FieldRow
          dir={isAr ? "rtl" : "ltr"}
          label={t("Name", "الاسم")}
          required
          requiredLabel={t("(Required)", "(مطلوب)")}
          right={
            <div className="flex flex-1 items-center gap-[12px] min-w-0">
              <InputField placeholder={t("First Name*", "الاسم الأول*")} className="flex-1 min-w-0" />
              <InputField placeholder={t("Last Name*", "اسم العائلة*")} className="flex-1 min-w-0" />
            </div>
          }
        />

        <RowDivider />

        <FieldRow
          dir={isAr ? "rtl" : "ltr"}
          label={t("Department", "القسم")}
          right={<InputField placeholder={t("Write Hint Here", "اكتب التلميح هنا")} className="flex-1" />}
        />

        <RowDivider />

        <FieldRow
          dir={isAr ? "rtl" : "ltr"}
          label={t("Alias names", "الأسماء المستعارة")}
          right={
            <InputField
              placeholder={t("Write Hint Here", "اكتب التلميح هنا")}
              className="flex-1"
              childrenSide={
                <ActionButton aria-label={t("Add alias name", "إضافة اسم مستعار")}>
                  <i className="ri-add-line" />
                </ActionButton>
              }
            />
          }
        />
      </SectionBlock>

      <TabSwitch
        className="absolute top-2 right-2 z-10"
        size="S"
        value={language}
        onValueChange={setLanguage}
        options={[
          { value: "en", label: "English" },
          { value: "ar", label: "العربية" },
        ]}
      />
    </div>
  );
}

interface FieldRowProps {
  label: string;
  required?: boolean;
  requiredLabel?: string;
  right: ReactNode;
  dir?: "ltr" | "rtl";
}

function FieldRow({ label, required, requiredLabel = "(Required)", right, dir }: FieldRowProps) {
  return (
    <div dir={dir} className="flex items-center gap-[24px] py-[18px]">
      <div className="flex w-[140px] shrink-0 items-center gap-[6px]">
        <span className="typography-body-medium-regular text-content-presentation-action-light-primary">
          {label}
        </span>
        {required && (
          <span className="typography-body-small-medium text-content-presentation-state-negative">
            {requiredLabel}
          </span>
        )}
      </div>
      <div className="flex flex-1 items-center min-w-0">{right}</div>
    </div>
  );
}

function RowDivider() {
  return <div className="h-px w-full bg-border-presentation-global-primary" />;
}
```

### Custom Layout (override defaults)

Use `containerClassName`, `headerClassName`, and `bodyClassName` to override the built-in spacing and width without losing the title/body structure.

```tsx
<SectionBlock
  color="Green"
  title="Compact card"
  containerClassName="w-[600px] pt-[4px] pb-[16px]"
  bodyClassName="px-[24px]"
>
  <p className="text-content-presentation-action-light-primary py-2">
    Tighter, narrower variant.
  </p>
</SectionBlock>
```

## Patterns

- **Color coding**: Use distinct colors to help users scan a page of multiple sections (e.g., Blue for primary forms, Yellow for warnings, Red for destructive zones).
- **No-title sections**: Drop the `title` prop entirely when the section's purpose is obvious from context — keeps the body padding without the visual weight of a header.
- **Composing with form fields**: `SectionBlock` does not impose any inner layout — pair it with helpers like the `FieldRow` pattern above, or with `InputField`, `Form`, or `FieldSection` for more structured forms.
- **Default width**: The component ships with `w-[1100px]`. Override via `containerClassName="w-full"` (or any specific width) for narrower containers.

## Accessibility

- The container is a plain `<div>`. If the section represents a distinct landmark, add `role="region"` and an `aria-label` (or use `aria-labelledby` pointing at the title).
- The title is rendered as styled text inside a badge `<div>`, not as a heading element. If the section needs a heading semantically, wrap your `title` content in an appropriate `<h2>`/`<h3>` and reset its margin via Tailwind classes.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Card overflows on small screens | Default width is `w-[1100px]`. Override with `containerClassName="w-full"` or a smaller fixed width. |
| Title not showing | The `title` prop is optional — omitting it hides the entire header. Pass any non-null `ReactNode` to render it. |
| Badge color looks wrong | `color` only accepts the predefined `SectionColor` values. For custom badge colors, override via `headerClassName` and a custom child node. |
| Need a different background | The body uses `bg-background-presentation-form-base`. Override via `containerClassName` (your class wins via `cn()` merging). |
