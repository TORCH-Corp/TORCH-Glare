---
title: Stepper
description: The pill-shaped multi-step indicator — three semantic types (default, success, negative), horizontal or vertical, three sizes. Composed of Stepper, Step, StepIndicator, StepConnector and StepLabel.
component: true
group: Forms
keywords: [stepper, steps, wizard, progress, multi-step, vertical, horizontal]
---

# Stepper

The step-progress component for wizards, onboarding flows, and multi-section forms, drawn as the Figma `FormStepper-1.0` pill. Each step has a semantic `type` — `default`, `success`, `negative` — and a selected state derived from `activeStep` or set explicitly per `Step`.

Not to be confused with `FormRenderer.Stepper`, which is the wizard *behaviour* (step state, validation, Back/Next) and renders this component as its rail.

The component is composed of `Stepper`, `Step`, `StepIndicator`, `StepConnector` and `StepLabel`. It is the single stepper in the library — the former `FormStepper` merged into it, so its types, states and badge live here alongside the orientation, sizes and connector.

## Installation

TORCH Glare is a copy-in library: the CLI copies this component's source into your project
(you do **not** install it from the npm package). Run `init` once, then `add`:

```bash
npx torch-glare@latest init
npx torch-glare@latest add Stepper
```

`add` also copies any components, hooks, and utilities that `Stepper` depends on.

## Imports

```typescript
import {
  Stepper,
  Step,
  StepIndicator,
  StepConnector,
  StepLabel,
} from '@/components/Stepper'
```

## Basic Usage

```tsx
import { useState } from 'react'
import {
  Stepper,
  Step,
  StepIndicator,
  StepConnector,
  StepLabel,
} from '@/components/Stepper'

export function BasicStepper() {
  const [activeStep, setActiveStep] = useState(1)

  return (
    <Stepper activeStep={activeStep}>
      <Step index={0}>
        <StepIndicator />
        <StepLabel>Account</StepLabel>
      </Step>
      <StepConnector />
      <Step index={1}>
        <StepIndicator />
        <StepLabel>Profile</StepLabel>
      </Step>
      <StepConnector />
      <Step index={2}>
        <StepIndicator />
        <StepLabel>Confirm</StepLabel>
      </Step>
    </Stepper>
  )
}
```

State derivation: `index === activeStep` → selected. Pass `selected` on a `Step` to override it, and `type` to mark a step as `success` or `negative`.

## Examples

### Vertical orientation with descriptions

```tsx
<Stepper orientation="vertical" activeStep={1}>
  <Step index={0}>
    <StepIndicator />
    <div>
      <StepLabel>Create account</StepLabel>
    </div>
  </Step>
  <StepConnector />
  <Step index={1}>
    <StepIndicator />
    <div>
      <StepLabel>Verify email</StepLabel>
    </div>
  </Step>
  <StepConnector />
  <Step index={2}>
    <StepIndicator />
    <div>
      <StepLabel>Done</StepLabel>
    </div>
  </Step>
</Stepper>
```

### Error state

```tsx
<Stepper activeStep={2}>
  <Step index={0}>
    <StepIndicator />
    <StepLabel>Account</StepLabel>
  </Step>
  <StepConnector />
  <Step index={1} type="negative">
    <StepIndicator />
    <StepLabel>Payment</StepLabel>
  </Step>
  <StepConnector />
  <Step index={2}>
    <StepIndicator />
    <StepLabel>Confirm</StepLabel>
  </Step>
</Stepper>
```

`StepIndicator` auto-renders a check icon for `completed`, a close icon for `error`, and the step number otherwise. Override via `icon`, `completedIcon`, or `errorIcon`.

### Custom indicators

```tsx
<Step index={0} type="success">
  <StepIndicator
    completedIcon={<i className="ri-shield-check-line" />}
    errorIcon={<i className="ri-shield-cross-line" />}
  />
  <StepLabel>Verified</StepLabel>
</Step>
```

### Sizes

```tsx
<Stepper size="S" activeStep={1}> {/* 24px pill, 20px indicator */} </Stepper>
<Stepper size="M" activeStep={1}> {/* 28px pill, 24px indicator — default, the size Figma draws */} </Stepper>
<Stepper size="L" activeStep={1}> {/* 34px pill, 30px indicator */} </Stepper>
```

### Step Types

Three semantic types. `success` and `negative` add a small status badge on the indicator (check / info icon) and use filled colors when selected. `default` uses a gray ring at rest, blue ring on hover, and a solid blue fill when selected.

```tsx
export function StepTypes() {
  return (
    <Stepper>
      <Step index={0} type="default" selected={false}>
        <StepIndicator />
        <StepLabel>Default</StepLabel>
      </Step>
      <Step index={1} type="success" selected={false}>
        <StepIndicator />
        <StepLabel>Success</StepLabel>
      </Step>
      <Step index={2} type="negative" selected={false}>
        <StepIndicator />
        <StepLabel>Negative</StepLabel>
      </Step>
    </Stepper>
  )
}
```

### Selected state

```tsx
export function SelectedSteps() {
  return (
    <Stepper>
      <Step index={0} type="default" selected>
        <StepIndicator />
        <StepLabel>Default</StepLabel>
      </Step>
      <Step index={1} type="success" selected>
        <StepIndicator />
        <StepLabel>Success</StepLabel>
      </Step>
      <Step index={2} type="negative" selected>
        <StepIndicator />
        <StepLabel>Negative</StepLabel>
      </Step>
    </Stepper>
  )
}
```

### RTL direction

The pill, label spacing, and indicator badge all flip under `dir="rtl"`.

```tsx
export function RTLStepper() {
  return (
    <div dir="rtl">
      <Stepper>
        <Step index={0} type="default" selected>
          <StepIndicator />
          <StepLabel>افتراضي</StepLabel>
        </Step>
        <Step index={1} type="success">
          <StepIndicator />
          <StepLabel>نجاح</StepLabel>
        </Step>
        <Step index={2} type="negative">
          <StepIndicator />
          <StepLabel>خطأ</StepLabel>
        </Step>
      </Stepper>
    </div>
  )
}
```

### Custom badge icon

`StepIndicator.badgeIcon` overrides the default check / info icon for `success` / `negative` types.

```tsx
<Step index={0} type="success" selected>
  <StepIndicator badgeIcon={<i className="ri-shield-check-line" />} />
  <StepLabel>Verified</StepLabel>
</Step>
```

### Custom indicator content

Children of `StepIndicator` replace the auto-rendered step number.

```tsx
<Step index={0} type="default" selected>
  <StepIndicator>
    <i className="ri-user-line" />
  </StepIndicator>
  <StepLabel>Account</StepLabel>
</Step>
```

## API Reference

### Stepper

| Prop          | Type                              | Default        | Description                                          |
| ------------- | --------------------------------- | -------------- | ---------------------------------------------------- |
| `activeStep`  | `number`                          | `0`            | Zero-based index of the active step.                 |
| `orientation` | `'horizontal' \| 'vertical'`      | `'horizontal'` | Layout direction.                                    |
| `size`        | `'S' \| 'M' \| 'L'`               | `'M'`          | Indicator size for all children.                     |
| `theme`       | `'dark' \| 'light' \| 'default'`  | —              | Theme override applied via `data-theme`.             |

### Step

| Prop          | Type      | Default | Description                                                  |
| ------------- | --------- | ------- | ------------------------------------------------------------ |
| `index`       | `number`  | `0`     | Zero-based step index. Compared with `Stepper.activeStep`.   |
| `type`        | `'default' \| 'success' \| 'negative'` | `'default'` | Semantic state. `success`/`negative` fill the indicator and add a corner badge. |
| `selected`    | `boolean` | `index === activeStep` | Force the selected state.                    |

### StepIndicator

| Prop            | Type        | Default | Description                                       |
| --------------- | ----------- | ------- | ------------------------------------------------- |
| `icon`          | `ReactNode` | —       | Replaces the step number.                         |
| `completedIcon` | `ReactNode` | —       | Replaces the default check icon when completed.   |
| `errorIcon`     | `ReactNode` | —       | Replaces the default close icon on error.         |

### StepConnector

The line between steps. No props beyond standard HTML attributes — orientation comes from the parent `Stepper`.

### StepLabel

Forward `HTMLAttributes<HTMLDivElement>`. Their colors follow the parent `Step` state automatically.

## Styling

- Default state: `bg-background-presentation-action-disabled`, gray border, disabled foreground.
- Active: blue informational background + focus ring.
- Completed: green success background and ring; check icon.
- Error: red negative background and ring; close icon.
- Connectors: `3px` rounded bar, `border-presentation-stepper-default` by default and focus-blue when `completed` is set. Vertically it centres itself under the indicator, tracking the stepper's size.

## TypeScript Types

```typescript
import type { VariantProps } from 'class-variance-authority'
import type { stepperStyles, stepIndicatorStyles } from '@/components/Stepper'

type StepperVariants  = VariantProps<typeof stepperStyles>
// { orientation?: 'horizontal' | 'vertical' }

type IndicatorVariants = VariantProps<typeof stepIndicatorStyles>
// { type?: 'default' | 'success' | 'negative'; selected?: boolean; size?: 'S' | 'M' | 'L' }
```

## Accessibility

- Wrap the stepper in a `<nav aria-label="Progress">` when it represents real navigation.
- Use `aria-current="step"` on the active step's container when steps are interactive.
- Don't rely on colour alone for the negative type — pair it with an off-screen message.

## Best Practices

1. Add `StepConnector` between steps when you want the run of progress drawn; leave it out for a bare row of pills.
2. Keep `Step` count to 3–5 horizontal, 3–7 vertical. Beyond that, switch to a checklist or summary.
3. Drive selection from `activeStep` in the parent — only fall back to `selected` for non-linear flows.
