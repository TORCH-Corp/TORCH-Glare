---
title: Stepper
description: Generic horizontal/vertical stepper with pending, active, completed, and error states. Composed of Stepper, Step, StepIndicator, StepConnector, StepLabel, and StepDescription.
component: true
group: Forms
keywords: [stepper, steps, wizard, progress, multi-step, vertical, horizontal]
---

# Stepper

A generic step-progress component for wizards, onboarding flows, and multi-section forms. Each step has four states — `pending`, `active`, `completed`, `error` — derived automatically from `activeStep` or set explicitly per `Step`.

The component is composed of `Stepper`, `Step`, `StepIndicator`, `StepConnector`, `StepLabel`, and `StepDescription`. Compare to [`FormStepper`](./form-stepper.md), which is a pill-shaped variant with no connector line.

## Installation

```bash
npx torch-glare@latest add Stepper
```

## Imports

```typescript
import {
  Stepper,
  Step,
  StepIndicator,
  StepConnector,
  StepLabel,
  StepDescription,
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

State derivation: `index < activeStep` → `completed`, `index === activeStep` → `active`, otherwise `pending`. Pass `isCompleted`, `isActive`, or `isError` on a `Step` to override.

## Examples

### Vertical orientation with descriptions

```tsx
<Stepper orientation="vertical" activeStep={1}>
  <Step index={0}>
    <StepIndicator />
    <div>
      <StepLabel>Create account</StepLabel>
      <StepDescription>Email and password.</StepDescription>
    </div>
  </Step>
  <StepConnector />
  <Step index={1}>
    <StepIndicator />
    <div>
      <StepLabel>Verify email</StepLabel>
      <StepDescription>Check your inbox for a code.</StepDescription>
    </div>
  </Step>
  <StepConnector />
  <Step index={2}>
    <StepIndicator />
    <div>
      <StepLabel>Done</StepLabel>
      <StepDescription>You're all set.</StepDescription>
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
  <Step index={1} isError>
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
<Step index={0} isCompleted>
  <StepIndicator
    completedIcon={<i className="ri-shield-check-line" />}
    errorIcon={<i className="ri-shield-cross-line" />}
  />
  <StepLabel>Verified</StepLabel>
</Step>
```

### Sizes

```tsx
<Stepper size="S" activeStep={1}> {/* 22px indicators */} </Stepper>
<Stepper size="M" activeStep={1}> {/* 28px — default */} </Stepper>
<Stepper size="L" activeStep={1}> {/* 34px */} </Stepper>
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
| `isActive`    | `boolean` | —       | Force the active state.                                      |
| `isCompleted` | `boolean` | —       | Force the completed state.                                   |
| `isError`     | `boolean` | —       | Force the error state. Overrides active and completed.       |

### StepIndicator

| Prop            | Type        | Default | Description                                       |
| --------------- | ----------- | ------- | ------------------------------------------------- |
| `icon`          | `ReactNode` | —       | Replaces the step number for the pending state.   |
| `completedIcon` | `ReactNode` | —       | Replaces the default check icon when completed.   |
| `errorIcon`     | `ReactNode` | —       | Replaces the default close icon on error.         |

### StepConnector

The line between steps. No props beyond standard HTML attributes — orientation comes from the parent `Stepper`.

### StepLabel / StepDescription

Forward `HTMLAttributes<HTMLDivElement>`. Their colors follow the parent `Step` state automatically.

## Styling

- Default state: `bg-background-presentation-action-disabled`, gray border, disabled foreground.
- Active: blue informational background + focus ring.
- Completed: green success background and ring; check icon.
- Error: red negative background and ring; close icon.
- Connectors: `2px` line, gray when pending, focus-blue when the preceding step is completed.

## TypeScript Types

```typescript
import type { VariantProps } from 'class-variance-authority'
import type { stepperStyles, stepIndicatorStyles } from '@/components/Stepper'

type StepperVariants  = VariantProps<typeof stepperStyles>
// { orientation?: 'horizontal' | 'vertical' }

type IndicatorVariants = VariantProps<typeof stepIndicatorStyles>
// { state?: 'pending' | 'active' | 'completed' | 'error'; size?: 'S' | 'M' | 'L' }
```

## Accessibility

- Wrap the stepper in a `<nav aria-label="Progress">` when it represents real navigation.
- Use `aria-current="step"` on the active step's container when steps are interactive.
- Don't rely on color alone for error — pair with `StepDescription` or an off-screen message.

## Best Practices

1. Use `Stepper` when you need a connector line + numbered/iconified steps. Use `FormStepper` when you want pill-shaped buttons without a line.
2. Keep `Step` count to 3–5 horizontal, 3–7 vertical. Beyond that, switch to a checklist or summary.
3. Drive state from `activeStep` in the parent — only fall back to `isActive`/`isCompleted` for non-linear flows.
4. Provide a `StepDescription` only on vertical steppers — descriptions wrap horizontal layouts awkwardly.
