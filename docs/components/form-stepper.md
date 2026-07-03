---
title: FormStepper
description: Pill-shaped multi-step indicator for forms and wizards. Three semantic step types (default, success, negative) with resting, hover, selected, and selected-hover states. Full LTR and RTL support.
component: true
group: Forms
keywords: [form-stepper, stepper, wizard, steps, pill, multi-step, form, indicator, RTL]
---

# FormStepper

A pill-shaped multi-step indicator for forms and wizards. Each step renders a circular indicator and a label inside a pill. Selection swaps the pill background to black with a white label; hover deepens the shadow on selected pills and grows the label gap on non-selected ones. The status badge on the indicator switches the visual to `success` (green check) or `negative` (red info).

The component is composed of `FormStepper`, `FormStep`, `FormStepIndicator`, and `FormStepLabel`.

## Installation

```bash
npx torch-glare@latest add FormStepper
```

## Imports

```typescript
import {
  FormStepper,
  FormStep,
  FormStepIndicator,
  FormStepLabel,
} from '@/components/FormStepper'
```

## Basic Usage

```tsx
import { useState } from 'react'
import {
  FormStepper,
  FormStep,
  FormStepIndicator,
  FormStepLabel,
} from '@/components/FormStepper'

export function BasicFormStepper() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <FormStepper activeStep={activeStep}>
      <FormStep index={0} type="success" onClick={() => setActiveStep(0)}>
        <FormStepIndicator />
        <FormStepLabel>Account</FormStepLabel>
      </FormStep>
      <FormStep index={1} type="default" onClick={() => setActiveStep(1)}>
        <FormStepIndicator />
        <FormStepLabel>Profile</FormStepLabel>
      </FormStep>
      <FormStep index={2} type="negative" onClick={() => setActiveStep(2)}>
        <FormStepIndicator />
        <FormStepLabel>Payment</FormStepLabel>
      </FormStep>
      <FormStep index={3} type="default" onClick={() => setActiveStep(3)}>
        <FormStepIndicator />
        <FormStepLabel>Confirm</FormStepLabel>
      </FormStep>
    </FormStepper>
  )
}
```

`FormStepper.activeStep` drives which pill renders selected — each `FormStep` auto-selects when its `index` matches. Pass `selected` on a step to override the match.

## Examples

### Step Types

Three semantic types. `success` and `negative` add a small status badge on the indicator (check / info icon) and use filled colors when selected. `default` uses a gray ring at rest, blue ring on hover, and a solid blue fill when selected.

```tsx
export function StepTypes() {
  return (
    <FormStepper>
      <FormStep index={0} type="default" selected={false}>
        <FormStepIndicator />
        <FormStepLabel>Default</FormStepLabel>
      </FormStep>
      <FormStep index={1} type="success" selected={false}>
        <FormStepIndicator />
        <FormStepLabel>Success</FormStepLabel>
      </FormStep>
      <FormStep index={2} type="negative" selected={false}>
        <FormStepIndicator />
        <FormStepLabel>Negative</FormStepLabel>
      </FormStep>
    </FormStepper>
  )
}
```

### Selected state

```tsx
export function SelectedSteps() {
  return (
    <FormStepper>
      <FormStep index={0} type="default" selected>
        <FormStepIndicator />
        <FormStepLabel>Default</FormStepLabel>
      </FormStep>
      <FormStep index={1} type="success" selected>
        <FormStepIndicator />
        <FormStepLabel>Success</FormStepLabel>
      </FormStep>
      <FormStep index={2} type="negative" selected>
        <FormStepIndicator />
        <FormStepLabel>Negative</FormStepLabel>
      </FormStep>
    </FormStepper>
  )
}
```

### RTL direction

The pill, label spacing, and indicator badge all flip under `dir="rtl"`.

```tsx
export function RTLFormStepper() {
  return (
    <div dir="rtl">
      <FormStepper>
        <FormStep index={0} type="default" selected>
          <FormStepIndicator />
          <FormStepLabel>افتراضي</FormStepLabel>
        </FormStep>
        <FormStep index={1} type="success">
          <FormStepIndicator />
          <FormStepLabel>نجاح</FormStepLabel>
        </FormStep>
        <FormStep index={2} type="negative">
          <FormStepIndicator />
          <FormStepLabel>خطأ</FormStepLabel>
        </FormStep>
      </FormStepper>
    </div>
  )
}
```

### Custom badge icon

`FormStepIndicator.badgeIcon` overrides the default check / info icon for `success` / `negative` types.

```tsx
<FormStep index={0} type="success" selected>
  <FormStepIndicator badgeIcon={<i className="ri-shield-check-line" />} />
  <FormStepLabel>Verified</FormStepLabel>
</FormStep>
```

### Custom indicator content

Children of `FormStepIndicator` replace the auto-rendered step number.

```tsx
<FormStep index={0} type="default" selected>
  <FormStepIndicator>
    <i className="ri-user-line" />
  </FormStepIndicator>
  <FormStepLabel>Account</FormStepLabel>
</FormStep>
```

## API Reference

### FormStepper

| Prop         | Type                            | Default | Description                                                       |
| ------------ | ------------------------------- | ------- | ----------------------------------------------------------------- |
| `activeStep` | `number`                        | `0`     | Zero-based index of the currently selected step.                  |
| `theme`      | `'dark' \| 'light' \| 'default'` | —       | Theme override applied via `data-theme`.                          |
| `className`  | `string`                        | —       | Extra classes merged onto the root `<div>`.                       |

Standard `HTMLAttributes<HTMLDivElement>` are forwarded.

### FormStep

| Prop        | Type                                    | Default     | Description                                                                |
| ----------- | --------------------------------------- | ----------- | -------------------------------------------------------------------------- |
| `index`     | `number`                                | `0`         | Zero-based step index. Matched against `FormStepper.activeStep`.           |
| `type`      | `'default' \| 'success' \| 'negative'` | `'default'` | Visual type. `success` and `negative` add a status badge on the indicator. |
| `selected`  | `boolean`                               | —           | Force the selected state, overriding the index/`activeStep` match.         |
| `className` | `string`                                | —           | Extra classes merged onto the pill root.                                   |

Standard `HTMLAttributes<HTMLDivElement>` (minus `type`) are forwarded — typical use is `onClick` for navigation.

### FormStepIndicator

| Prop        | Type        | Default | Description                                                                   |
| ----------- | ----------- | ------- | ----------------------------------------------------------------------------- |
| `badgeIcon` | `ReactNode` | —       | Override the default badge icon (check for `success`, info for `negative`).   |
| `children`  | `ReactNode` | —       | Replaces the auto-rendered step number.                                       |
| `className` | `string`    | —       | Extra classes merged onto the indicator `<div>`.                              |

### FormStepLabel

Forwards `HTMLAttributes<HTMLDivElement>`. Color and label spacing follow the parent `FormStep` selection state.

## Styling

- Pill height: `28px`, fully rounded, `2px` inner padding.
- Indicator: `24×24px` circle, `border-[3px]` for `default`, solid fill for `success`/`negative`.
- Status badge: `15×15px` circle pinned to the top-right of the indicator (top-left under RTL), with `border` matching the page background.
- Selection: `bg-[#000000]` pill with `text-[#FFFFFF]` label and a `0 0 32px 2px rgba(0,0,0,0.05)` shadow that deepens on hover.
- Non-selected hover: `bg-[#FFFFFF]` pill, label gap grows from `6px` to `9px`, ring color flips to `#004699`.

## TypeScript Types

```typescript
type FormStepperType = 'default' | 'success' | 'negative'

interface FormStepperProps extends React.HTMLAttributes<HTMLDivElement> {
  activeStep?: number
  theme?: 'dark' | 'light' | 'default'
}

interface FormStepProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'type'> {
  index?: number
  type?: FormStepperType
  selected?: boolean
}
```

## Accessibility

- Each `FormStep` is a focusable interactive surface — attach `onClick` and (if needed) `role="button"` plus `tabIndex={0}` for keyboard navigation.
- The status badge is `aria-hidden`; the meaning should be carried by the label text (e.g. `"Payment — error"`).
- Color is never the sole signal for `success`/`negative` — pair with text or an off-screen description.

## Best Practices

1. Drive selection with `activeStep` from the parent form state — avoid setting `selected` per step manually.
2. Use `success` only for *completed and validated* steps, `negative` only for *failed* steps. Default = pending or current.
3. Keep labels short — the pill grows by `~3px` on hover, and long labels make that animation jittery.
4. Wire `onClick` for non-linear navigation (jump-to-step). For strict wizards, omit `onClick` on future steps.
