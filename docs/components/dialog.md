---
title: Dialog
description: Modal dialog component with overlay backdrop for displaying content above the main page
group: Overlays & Dialogs
keywords: [dialog, modal, overlay, popup, radix-ui, compound-component]
---

# Dialog

> A modal dialog component built on Radix UI that displays content in a centered overlay above the main page content. Features smooth animations, backdrop overlay, and keyboard/focus management.

## Installation

```bash
npm install @radix-ui/react-dialog
```

## Import

```typescript
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogCloseButton,
} from '@torch-ui/components'
```

## Quick Examples

### Basic Usage

```typescript
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@torch-ui/components'
import { Button } from '@torch-ui/components'

function Example() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome</DialogTitle>
          <DialogDescription>
            This is a basic dialog example.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
```

### With Header and Footer

```typescript
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from '@torch-ui/components'
import { Button } from '@torch-ui/components'

function FormDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here.
          </DialogDescription>
        </DialogHeader>

        {/* Form content */}
        <div className="space-y-4 p-4">
          <input type="text" placeholder="Name" className="w-full p-2 border rounded" />
          <input type="email" placeholder="Email" className="w-full p-2 border rounded" />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="SecondaryStyle">Cancel</Button>
          </DialogClose>
          <Button variant="PrimaryStyle">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### Controlled State

```typescript
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@torch-ui/components'
import { useState } from 'react'

function ControlledDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button>Open</button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Controlled Dialog</DialogTitle>
        <p>This dialog's state is controlled externally.</p>
        <button onClick={() => setOpen(false)}>Close</button>
      </DialogContent>
    </Dialog>
  )
}
```

### With Custom Close Button

```typescript
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogCloseButton } from '@torch-ui/components'
import { ActionButton } from '@torch-ui/components'

function CustomCloseDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>Open</button>
      </DialogTrigger>
      <DialogContent className="relative p-6">
        <DialogCloseButton className="absolute top-4 right-4">
          <ActionButton size="XS" aria-label="Close dialog">
            <i className="ri-close-line" />
          </ActionButton>
        </DialogCloseButton>

        <DialogTitle>Dialog with Custom Close</DialogTitle>
        <p>Click the X button to close.</p>
      </DialogContent>
    </Dialog>
  )
}
```

### Confirmation Dialog

```typescript
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from '@torch-ui/components'
import { Button } from '@torch-ui/components'

function ConfirmationDialog({ onConfirm }: { onConfirm: () => void }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="DestructiveStyle">Delete Account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="SecondaryStyle">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="DestructiveStyle" onClick={onConfirm}>
              Delete Account
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### Nested Form Dialog

```typescript
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@torch-ui/components'
import { Button, Input } from '@torch-ui/components'
import { useForm } from 'react-hook-form'

interface FormData {
  username: string
  email: string
}

function FormDialog() {
  const { register, handleSubmit } = useForm<FormData>()

  const onSubmit = (data: FormData) => {
    console.log(data)
    // Close dialog after submission
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Sign Up</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create Account</DialogTitle>
            <DialogDescription>
              Fill in your details to create a new account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 p-4">
            <Input {...register('username')} placeholder="Username" />
            <Input {...register('email')} type="email" placeholder="Email" />
          </div>

          <DialogFooter>
            <Button type="submit">Create Account</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

### Content-Heavy Dialog

```typescript
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@torch-ui/components'
import { Button, ScrollArea } from '@torch-ui/components'

function ContentDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Terms & Conditions</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>
            Please read our terms carefully.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-96 p-4">
          <div className="space-y-4">
            <h3 className="font-semibold">1. Acceptance of Terms</h3>
            <p>By accessing our service, you agree to these terms...</p>
            {/* More content */}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button>I Agree</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### Multi-Step Dialog

```typescript
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@torch-ui/components'
import { Button } from '@torch-ui/components'
import { useState } from 'react'

function MultiStepDialog() {
  const [step, setStep] = useState(1)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Start Wizard</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Setup Wizard - Step {step}/3</DialogTitle>
        </DialogHeader>

        <div className="p-4">
          {step === 1 && <div>Step 1: Basic Information</div>}
          {step === 2 && <div>Step 2: Preferences</div>}
          {step === 3 && <div>Step 3: Confirmation</div>}
        </div>

        <DialogFooter>
          {step > 1 && (
            <Button variant="SecondaryStyle" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)}>Next</Button>
          ) : (
            <Button>Finish</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### Image Preview Dialog

```typescript
import { Dialog, DialogTrigger, DialogContent } from '@torch-ui/components'

function ImageDialog({ src, alt }: { src: string; alt: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <img
          src={src}
          alt={alt}
          className="w-32 h-32 object-cover cursor-pointer hover:opacity-80"
        />
      </DialogTrigger>
      <DialogContent className="max-w-4xl bg-transparent border-none shadow-none">
        <img src={src} alt={alt} className="w-full h-auto" />
      </DialogContent>
    </Dialog>
  )
}
```

### Loading State Dialog

```typescript
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@torch-ui/components'
import { Button, SpinLoading } from '@torch-ui/components'
import { useState } from 'react'

function LoadingDialog() {
  const [loading, setLoading] = useState(false)

  const handleAction = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Process Data</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Processing...</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <SpinLoading size="L" />
          </div>
        ) : (
          <div className="p-4">
            <p>Click below to start processing.</p>
            <Button onClick={handleAction} className="mt-4">
              Start
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
```

## API Reference

### Dialog (Root)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `defaultOpen` | `boolean` | `false` | Uncontrolled default open state |
| `modal` | `boolean` | `true` | Whether to render as modal (trap focus) |

### DialogTrigger

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Render trigger as child element |

### DialogContent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `onEscapeKeyDown` | `(event) => void` | - | Callback when Escape is pressed |
| `onPointerDownOutside` | `(event) => void` | - | Callback when clicking outside |
| `onInteractOutside` | `(event) => void` | - | Callback for any outside interaction |

### DialogHeader, DialogFooter

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### DialogTitle

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `asChild` | `boolean` | `false` | Render as child element |

### DialogDescription

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `asChild` | `boolean` | `false` | Render as child element |

### DialogClose

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Render close button as child |

### DialogCloseButton

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes for close button |

## TypeScript

### Full Type Definitions

```typescript
import * as DialogPrimitive from '@radix-ui/react-dialog'

// Root component
interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
  modal?: boolean
  children: React.ReactNode
}

export const Dialog: React.FC<DialogProps>

// Compound components
export const DialogTrigger: React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
>

export const DialogContent: React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>

export const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>>
export const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>>
export const DialogTitle: React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>
export const DialogDescription: React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>
export const DialogClose: React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>
export const DialogCloseButton: React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>
```

## Common Patterns

### Alert/Confirmation Pattern

```typescript
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@torch-ui/components'
import { Button } from '@torch-ui/components'

function useConfirmDialog() {
  const [open, setOpen] = useState(false)
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null)

  const confirm = () => new Promise<boolean>((resolve) => {
    setOpen(true)
    setResolver(() => resolve)
  })

  const handleConfirm = (value: boolean) => {
    resolver?.(value)
    setOpen(false)
  }

  const ConfirmDialog = (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogDescription>
          Are you sure you want to proceed?
        </DialogDescription>
        <div className="flex gap-2 mt-4">
          <Button onClick={() => handleConfirm(false)}>Cancel</Button>
          <Button onClick={() => handleConfirm(true)}>Confirm</Button>
        </div>
      </DialogContent>
    </Dialog>
  )

  return { confirm, ConfirmDialog }
}
```

### Preventing Close on Outside Click

```typescript
<DialogContent
  onInteractOutside={(e) => {
    e.preventDefault()
  }}
>
  {/* Content that shouldn't be dismissed */}
</DialogContent>
```

## Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@torch-ui/components'

describe('Dialog', () => {
  it('opens when trigger is clicked', () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    )

    fireEvent.click(screen.getByText('Open'))
    expect(screen.getByText('Test Dialog')).toBeInTheDocument()
  })

  it('closes when Escape is pressed', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Test</DialogTitle>
        </DialogContent>
      </Dialog>
    )

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByText('Test')).not.toBeInTheDocument()
  })

  it('calls onOpenChange callback', () => {
    const handleChange = jest.fn()

    render(
      <Dialog onOpenChange={handleChange}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>Content</DialogContent>
      </Dialog>
    )

    fireEvent.click(screen.getByText('Open'))
    expect(handleChange).toHaveBeenCalledWith(true)
  })
})
```

## Accessibility

- **Keyboard Support**:
  - Escape: Close dialog
  - Tab: Navigate through focusable elements
  - Shift+Tab: Navigate backwards
- **ARIA Attributes**:
  - `role="dialog"` automatically applied
  - `aria-modal="true"` when modal
  - `aria-labelledby` links to title
  - `aria-describedby` links to description
- **Focus Management**:
  - Focus trapped within dialog when open
  - Focus returned to trigger on close
  - First focusable element focused on open
- **Screen Readers**: Dialog announced with title and description

### Best Practices for Accessibility

```typescript
// Always provide a title
<DialogContent>
  <DialogTitle>Dialog Title</DialogTitle> {/* Required */}
  <DialogDescription>Description</DialogDescription> {/* Recommended */}
</DialogContent>

// Use semantic buttons
<DialogClose asChild>
  <Button aria-label="Close dialog">Close</Button>
</DialogClose>
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (minified) | ~8kb |
| Bundle size (gzipped) | ~3kb |
| Dependencies | @radix-ui/react-dialog (~12kb) |
| First render | <10ms |
| Animation duration | 200ms |
| Tree-shakeable | ✅ |

### Performance Tips

1. **Lazy load dialog content**: Don't render until opened
   ```typescript
   {open && <DialogContent>{/* Heavy content */}</DialogContent>}
   ```

2. **Use asChild prop**: Avoid extra wrapper elements
   ```typescript
   <DialogTrigger asChild>
     <Button>Open</Button>
   </DialogTrigger>
   ```

## Migration from Other Modals

### From Material-UI Dialog

```diff
- import { Dialog, DialogTitle, DialogContent } from '@mui/material'
+ import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@torch-ui/components'

- <Dialog open={open} onClose={() => setOpen(false)}>
-   <DialogTitle>Title</DialogTitle>
-   <DialogContent>Content</DialogContent>
- </Dialog>

+ <Dialog open={open} onOpenChange={setOpen}>
+   <DialogContent>
+     <DialogTitle>Title</DialogTitle>
+     <div>Content</div>
+   </DialogContent>
+ </Dialog>
```

### From Headless UI Dialog

```diff
- import { Dialog } from '@headlessui/react'
+ import { Dialog, DialogContent, DialogTitle } from '@torch-ui/components'

- <Dialog open={open} onClose={setOpen}>
-   <Dialog.Panel>
-     <Dialog.Title>Title</Dialog.Title>
-     Content
-   </Dialog.Panel>
- </Dialog>

+ <Dialog open={open} onOpenChange={setOpen}>
+   <DialogContent>
+     <DialogTitle>Title</DialogTitle>
+     Content
+   </DialogContent>
+ </Dialog>
```

## Best Practices

1. **Always provide DialogTitle**: Required for accessibility
   ```typescript
   <DialogContent>
     <DialogTitle>Required Title</DialogTitle>
   </DialogContent>
   ```

2. **Use controlled state for complex interactions**
   ```typescript
   const [open, setOpen] = useState(false)
   <Dialog open={open} onOpenChange={setOpen}>
   ```

3. **Wrap trigger with asChild**: Avoid unnecessary wrappers
   ```typescript
   <DialogTrigger asChild>
     <Button>Open</Button>
   </DialogTrigger>
   ```

4. **Don't nest dialogs**: Use separate dialogs or switch content
   ```typescript
   // Avoid: <Dialog><Dialog></Dialog></Dialog>
   // Use: Multiple root-level dialogs with state management
   ```

5. **Handle loading states**: Show feedback during async operations
   ```typescript
   {loading ? <SpinLoading /> : <FormContent />}
   ```

6. **Provide clear close affordances**: Include close button and cancel option
   ```typescript
   <DialogCloseButton>
     <ActionButton aria-label="Close">×</ActionButton>
   </DialogCloseButton>
   ```

7. **Keep content concise**: Long content should use ScrollArea
   ```typescript
   <ScrollArea className="max-h-96">{longContent}</ScrollArea>
   ```

## Related Components

- [AlertDialog](./alert-dialog.md) - Dialog variant for confirmation/alerts
- [Drawer](./drawer.md) - Bottom sheet alternative to dialog
- [Popover](./popover.md) - Non-modal overlay for contextual content
- [Tooltip](./tooltip.md) - Small overlay for hints
