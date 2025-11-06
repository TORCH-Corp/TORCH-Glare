---
title: AlertDialog
description: Confirmation and alert dialog component with status variants for important user decisions
group: Overlays & Dialogs
keywords: [alert-dialog, confirmation, modal, alert, warning, error, radix-ui]
---

# AlertDialog

> A specialized modal dialog for alerts and confirmations that require user acknowledgment or decision. Features status variants (info, success, warning, error) and integrated action buttons.

## Installation

```bash
npm install @radix-ui/react-alert-dialog
```

## Import

```typescript
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogLabel,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@torch-ui/components'
```

## Quick Examples

### Basic Alert

```typescript
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogAction } from '@torch-ui/components'
import { Button } from '@torch-ui/components'

function Example() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Show Alert</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Notification</AlertDialogTitle>
        <AlertDialogDescription>
          This is an important message that requires your attention.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogAction>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

### Delete Confirmation (Error Variant)

```typescript
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogLabel, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@torch-ui/components'
import { Button } from '@torch-ui/components'

function DeleteConfirmation() {
  const handleDelete = () => {
    // Perform delete operation
    console.log('Deleted!')
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="DestructiveStyle">Delete Item</Button>
      </AlertDialogTrigger>
      <AlertDialogContent variant="error">
        <AlertDialogHeader>
          <AlertDialogLabel title="Delete Item" />
        </AlertDialogHeader>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the item
          and remove it from our servers.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <i className="ri-close-line" />
          </AlertDialogCancel>
          <AlertDialogAction
            variant="DestructiveStyle"
            onClick={handleDelete}
          >
            Delete Permanently
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

### Success Alert

```typescript
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogLabel, AlertDialogDescription, AlertDialogAction } from '@torch-ui/components'

function SuccessAlert() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button>Complete Task</button>
      </AlertDialogTrigger>
      <AlertDialogContent variant="success">
        <AlertDialogLabel title="Task Completed" />
        <AlertDialogDescription>
          Your task has been successfully completed and saved.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogAction variant="PrimaryStyle">
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

### Warning Alert

```typescript
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogLabel, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@torch-ui/components'

function WarningAlert() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button>Proceed with Caution</button>
      </AlertDialogTrigger>
      <AlertDialogContent variant="warning">
        <AlertDialogLabel title="Warning Unsaved Changes" />
        <AlertDialogDescription>
          You have unsaved changes. If you leave now, your changes will be lost.
          Are you sure you want to continue?
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <i className="ri-close-line" />
          </AlertDialogCancel>
          <AlertDialogAction variant="PrimaryStyle">
            Leave Anyway
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

### Info Alert

```typescript
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogLabel, AlertDialogDescription, AlertDialogAction } from '@torch-ui/components'

function InfoAlert() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button>View Information</button>
      </AlertDialogTrigger>
      <AlertDialogContent variant="info">
        <AlertDialogLabel title="Information System Update" />
        <AlertDialogDescription>
          A new system update is available. The update will be installed during
          your next restart. This may take a few minutes.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogAction variant="PrimaryStyle">
            Got It
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

### Controlled State

```typescript
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogAction } from '@torch-ui/components'
import { useState } from 'react'

function ControlledAlert() {
  const [open, setOpen] = useState(false)

  const handleAction = () => {
    // Perform action
    setOpen(false)
  }

  return (
    <>
      <button onClick={() => setOpen(true)}>Show Alert</button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent variant="warning">
          <AlertDialogTitle>Confirm Action</AlertDialogTitle>
          <AlertDialogDescription>
            This is a controlled alert dialog.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleAction}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
```

### Account Deletion Flow

```typescript
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogLabel, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@torch-ui/components'
import { Button, Input } from '@torch-ui/components'
import { useState } from 'react'

function DeleteAccountDialog() {
  const [confirmText, setConfirmText] = useState('')
  const isValid = confirmText === 'DELETE'

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="DestructiveStyle">Delete Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent variant="error">
        <AlertDialogLabel title="Delete Account" />
        <AlertDialogDescription>
          <div className="space-y-4">
            <p>This will permanently delete your account and all associated data.</p>
            <p>Type <strong>DELETE</strong> to confirm:</p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE"
            />
          </div>
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <i className="ri-close-line" />
          </AlertDialogCancel>
          <AlertDialogAction
            variant="DestructiveStyle"
            disabled={!isValid}
          >
            Delete My Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

### Multi-Action Alert

```typescript
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogLabel, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@torch-ui/components'

function MultiActionAlert() {
  const handleSave = () => console.log('Saved')
  const handleDiscard = () => console.log('Discarded')

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button>Close Document</button>
      </AlertDialogTrigger>
      <AlertDialogContent variant="warning">
        <AlertDialogLabel title="Unsaved Changes" />
        <AlertDialogDescription>
          Do you want to save your changes before closing?
        </AlertDialogDescription>
        <AlertDialogFooter className="flex gap-2">
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction variant="SecondaryStyle" onClick={handleDiscard}>
            Don't Save
          </AlertDialogAction>
          <AlertDialogAction variant="PrimaryStyle" onClick={handleSave}>
            Save Changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

### With Loading State

```typescript
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogLabel, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@torch-ui/components'
import { SpinLoading } from '@torch-ui/components'
import { useState } from 'react'

function AsyncAlert() {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    await performAsyncAction()
    setLoading(false)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button>Sync Data</button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogLabel title="Sync Confirmation" />
        <AlertDialogDescription>
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <SpinLoading />
              <span className="ml-2">Syncing...</span>
            </div>
          ) : (
            'This will sync all your data with the server.'
          )}
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={loading}>
            {loading ? 'Syncing...' : 'Start Sync'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

### Permission Request

```typescript
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogLabel, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@torch-ui/components'

function PermissionAlert() {
  const handleAllow = () => {
    // Request permission
    navigator.mediaDevices.getUserMedia({ video: true })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button>Enable Camera</button>
      </AlertDialogTrigger>
      <AlertDialogContent variant="info">
        <AlertDialogLabel title="Camera Access Required" />
        <AlertDialogDescription>
          This app needs access to your camera to take photos. Your privacy is
          important to us and camera access can be revoked at any time.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>
            Not Now
          </AlertDialogCancel>
          <AlertDialogAction variant="PrimaryStyle" onClick={handleAllow}>
            Allow Camera Access
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

## API Reference

### AlertDialog (Root)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `defaultOpen` | `boolean` | `false` | Uncontrolled default open state |

### AlertDialogTrigger

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Render trigger as child element |

### AlertDialogContent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'default'` | Status variant for styling |
| `className` | `string` | - | Additional CSS classes |

### AlertDialogHeader, AlertDialogFooter

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### AlertDialogTitle

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### AlertDialogLabel

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | Required | Title text with first word bolded |
| `className` | `string` | - | Additional CSS classes |

### AlertDialogDescription

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### AlertDialogAction

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'M' \| 'S' \| 'L' \| 'XL'` | `'M'` | Button size |
| `variant` | `ButtonVariant` | `'BorderStyle'` | Button variant |
| `buttonType` | `'button' \| 'icon'` | `'button'` | Button type |
| `onClick` | `() => void` | - | Click handler |

### AlertDialogCancel

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'M' \| 'S' \| 'L' \| 'XL'` | `'M'` | Button size |
| `variant` | `ButtonVariant` | `'RedSecStyle'` | Button variant |
| `buttonType` | `'button' \| 'icon'` | `'icon'` | Button type |

## Variants

### Default Variant
- Neutral gray styling
- For general confirmations

### Info Variant
- Blue accent
- For informational messages
- Use when providing information that doesn't require critical action

### Success Variant
- Green accent
- For success confirmations
- Use after successful operations

### Warning Variant
- Yellow/orange accent
- For cautionary messages
- Use before potentially risky actions

### Error/Destructive Variant
- Red accent
- For destructive actions
- Use for delete, remove, or permanent changes

## TypeScript

### Full Type Definitions

```typescript
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { ButtonVariant } from '@torch-ui/types'

// Root component
interface AlertDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
  children: React.ReactNode
}

export const AlertDialog: React.FC<AlertDialogProps>

// Content component
interface AlertDialogContentProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> {
  variant?: 'info' | 'success' | 'warning' | 'error' | 'default'
}

export const AlertDialogContent: React.ForwardRefExoticComponent<AlertDialogContentProps>

// Label component (special title with first word bolded)
interface AlertDialogLabelProps {
  title: string
  className?: string
}

export const AlertDialogLabel: React.ForwardRefExoticComponent<AlertDialogLabelProps>

// Action buttons
interface AlertDialogActionProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> {
  size?: 'M' | 'S' | 'L' | 'XL'
  variant?: ButtonVariant
  buttonType?: 'button' | 'icon'
}

export const AlertDialogAction: React.ForwardRefExoticComponent<AlertDialogActionProps>
export const AlertDialogCancel: React.ForwardRefExoticComponent<AlertDialogActionProps>
```

## Common Patterns

### useAlertDialog Hook

```typescript
import { AlertDialog, AlertDialogContent, AlertDialogLabel, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@torch-ui/components'
import { useState } from 'react'

function useAlertDialog() {
  const [open, setOpen] = useState(false)
  const [config, setConfig] = useState<{
    title: string
    description: string
    variant?: 'info' | 'success' | 'warning' | 'error'
    onConfirm: () => void
  } | null>(null)

  const show = (newConfig: typeof config) => {
    setConfig(newConfig)
    setOpen(true)
  }

  const AlertDialogComponent = config && (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent variant={config.variant}>
        <AlertDialogLabel title={config.title} />
        <AlertDialogDescription>{config.description}</AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              config.onConfirm()
              setOpen(false)
            }}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  return { show, AlertDialogComponent }
}

// Usage
function App() {
  const { show, AlertDialogComponent } = useAlertDialog()

  const handleDelete = () => {
    show({
      title: 'Delete Item',
      description: 'Are you sure?',
      variant: 'error',
      onConfirm: () => console.log('Deleted'),
    })
  }

  return (
    <>
      <button onClick={handleDelete}>Delete</button>
      {AlertDialogComponent}
    </>
  )
}
```

## Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogAction } from '@torch-ui/components'

describe('AlertDialog', () => {
  it('renders with correct variant', () => {
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent variant="error">
          <AlertDialogTitle>Error</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>
    )

    const content = screen.getByRole('alertdialog')
    expect(content).toHaveAttribute('data-variant', 'error')
  })

  it('calls action handler', () => {
    const handleAction = jest.fn()

    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Confirm</AlertDialogTitle>
          <AlertDialogAction onClick={handleAction}>OK</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    )

    fireEvent.click(screen.getByText('OK'))
    expect(handleAction).toHaveBeenCalled()
  })
})
```

## Accessibility

- **Role**: Automatically has `role="alertdialog"`
- **Keyboard Support**:
  - Escape: Cancel/close
  - Tab: Navigate between actions
  - Enter/Space: Activate focused action
- **ARIA Attributes**:
  - `aria-labelledby` links to title
  - `aria-describedby` links to description
  - `aria-modal="true"`
- **Focus Management**:
  - Focus trapped within alert
  - Cancel action focused by default
  - Focus returned to trigger on close

### Best Practices

```typescript
// Always provide both title and description
<AlertDialogContent>
  <AlertDialogTitle>Required Title</AlertDialogTitle>
  <AlertDialogDescription>
    Clear explanation of what will happen
  </AlertDialogDescription>
</AlertDialogContent>

// Use appropriate variant for context
<AlertDialogContent variant="error"> {/* For destructive actions */}

// Provide clear action labels
<AlertDialogAction>Delete Permanently</AlertDialogAction> {/* Not just "OK" */}
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (minified) | ~10kb |
| Bundle size (gzipped) | ~4kb |
| Dependencies | @radix-ui/react-alert-dialog (~14kb) |
| First render | <15ms |
| Animation duration | 200ms |
| Tree-shakeable | ✅ |

## Migration from Dialog

```diff
- import { Dialog, DialogTrigger, DialogContent } from '@torch-ui/components'
+ import { AlertDialog, AlertDialogTrigger, AlertDialogContent } from '@torch-ui/components'

- <Dialog>
-   <DialogTrigger>Delete</DialogTrigger>
-   <DialogContent>
-     <DialogTitle>Confirm</DialogTitle>
-   </DialogContent>
- </Dialog>

+ <AlertDialog>
+   <AlertDialogTrigger>Delete</AlertDialogTrigger>
+   <AlertDialogContent variant="error">
+     <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
+     <AlertDialogFooter>
+       <AlertDialogCancel>Cancel</AlertDialogCancel>
+       <AlertDialogAction>Delete</AlertDialogAction>
+     </AlertDialogFooter>
+   </AlertDialogContent>
+ </AlertDialog>
```

## Best Practices

1. **Use appropriate variant**: Match variant to action severity
   ```typescript
   <AlertDialogContent variant="error"> {/* For delete */}
   <AlertDialogContent variant="warning"> {/* For unsaved changes */}
   ```

2. **Provide clear descriptions**: Explain consequences
   ```typescript
   <AlertDialogDescription>
     This will permanently delete 5 items and cannot be undone.
   </AlertDialogDescription>
   ```

3. **Use AlertDialogLabel for emphasis**: First word is automatically bolded
   ```typescript
   <AlertDialogLabel title="Delete Permanently" />
   {/* Renders: <strong>Delete</strong> Permanently */}
   ```

4. **Distinguish action buttons**: Make destructive action clear
   ```typescript
   <AlertDialogCancel>Cancel</AlertDialogCancel>
   <AlertDialogAction variant="DestructiveStyle">Delete</AlertDialogAction>
   ```

5. **Don't overuse**: Reserve for important decisions only
   ```typescript
   // Good: Delete, logout, discard changes
   // Bad: Every form submission, navigation
   ```

6. **Handle async actions**: Show loading state
   ```typescript
   <AlertDialogAction disabled={loading}>
     {loading ? 'Processing...' : 'Confirm'}
   </AlertDialogAction>
   ```

7. **Prevent accidental actions**: Add confirmation text input for critical operations
   ```typescript
   const isValid = confirmText === 'DELETE'
   <AlertDialogAction disabled={!isValid}>
   ```

## Related Components

- [Dialog](./dialog.md) - General purpose modal dialog
- [Toast](./toast.md) - Non-blocking notifications
- [Button](./button.md) - Used for action buttons
