---
title: ActionsGroup
description: Container component for grouping action buttons with optional dividers.
component: true
group: Layout & Containers
keywords: [actions, buttons, group, container, toolbar, divider]
---

# ActionsGroup

A flexible container component for grouping action buttons and controls with optional decorative dividers. Perfect for creating organized toolbars, button groups, and action panels.

## Installation

```bash
npx torch-cli add actions-group
```

## Imports

```typescript
import ActionsGroup from '@/components/ActionsGroup'
```

## Basic Usage

```tsx
import ActionsGroup from '@/components/ActionsGroup'
import { Button } from '@/components/Button'

export function BasicActionsGroup() {
  return (
    <ActionsGroup>
      <Button variant="PrimeStyle">Save</Button>
      <Button variant="SecStyle">Cancel</Button>
    </ActionsGroup>
  )
}
```

## Examples

### With Dividers

Add decorative dividers on both sides of the action group.

```tsx
export function ActionsWithDividers() {
  return (
    <div className="p-6 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Document Settings</h2>
      <p className="mb-6">Configure your document preferences below.</p>

      <ActionsGroup withDivider>
        <Button variant="PrimeStyle" size="M">
          <i className="ri-save-line mr-2"></i>
          Save Changes
        </Button>
        <Button variant="SecStyle" size="M">
          <i className="ri-close-line mr-2"></i>
          Discard
        </Button>
      </ActionsGroup>
    </div>
  )
}
```

### Form Actions

Standard form submit and cancel actions.

```tsx
export function FormActions() {
  return (
    <form className="space-y-4 max-w-2xl">
      <div>
        <label className="block mb-2">Project Name</label>
        <InputField placeholder="Enter project name" className="w-full" />
      </div>

      <div>
        <label className="block mb-2">Description</label>
        <TextAreaInput
          placeholder="Enter description"
          rows={4}
          className="w-full"
        />
      </div>

      <ActionsGroup className="justify-end">
        <Button variant="SecStyle" type="button">
          Cancel
        </Button>
        <Button variant="PrimeStyle" type="submit">
          Create Project
        </Button>
      </ActionsGroup>
    </form>
  )
}
```

### Modal Footer Actions

Actions in modal or dialog footers.

```tsx
export function ModalFooterActions() {
  return (
    <div className="max-w-lg border rounded-lg shadow-lg">
      {/* Modal Header */}
      <div className="p-6 border-b">
        <h3 className="text-xl font-bold">Delete Confirmation</h3>
      </div>

      {/* Modal Content */}
      <div className="p-6">
        <p>
          Are you sure you want to delete this item? This action cannot be undone.
        </p>
      </div>

      {/* Modal Footer */}
      <ActionsGroup withDivider className="p-6 justify-end">
        <Button variant="SecStyle">
          Cancel
        </Button>
        <Button variant="DangerStyle">
          <i className="ri-delete-bin-line mr-2"></i>
          Delete
        </Button>
      </ActionsGroup>
    </div>
  )
}
```

### Multi-Action Groups

Multiple action groups with different purposes.

```tsx
export function MultiActionGroups() {
  return (
    <div className="border rounded-lg">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Document Editor</h3>
      </div>

      <div className="p-4 space-y-4">
        {/* Primary Actions */}
        <ActionsGroup className="justify-between">
          <div className="flex gap-2">
            <Button variant="PrimeStyle" size="S">
              <i className="ri-save-line mr-2"></i>
              Save
            </Button>
            <Button variant="SecStyle" size="S">
              <i className="ri-file-copy-line mr-2"></i>
              Duplicate
            </Button>
          </div>

          <Button variant="SecStyle" size="S">
            <i className="ri-more-2-fill"></i>
          </Button>
        </ActionsGroup>

        {/* Secondary Actions */}
        <ActionsGroup withDivider>
          <Button variant="SecStyle" size="S">
            <i className="ri-share-line mr-2"></i>
            Share
          </Button>
          <Button variant="SecStyle" size="S">
            <i className="ri-download-line mr-2"></i>
            Export
          </Button>
          <Button variant="SecStyle" size="S">
            <i className="ri-printer-line mr-2"></i>
            Print
          </Button>
        </ActionsGroup>

        {/* Danger Zone */}
        <ActionsGroup withDivider>
          <Button variant="DangerStyle" size="S" className="w-full">
            <i className="ri-delete-bin-line mr-2"></i>
            Delete Document
          </Button>
        </ActionsGroup>
      </div>
    </div>
  )
}
```

### Card Actions

Action buttons within cards.

```tsx
export function CardActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map(id => (
        <div key={id} className="border rounded-lg overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500"></div>

          <div className="p-4">
            <h3 className="font-bold text-lg mb-2">Project {id}</h3>
            <p className="text-sm text-content-presentation-global-secondary mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>

            <ActionsGroup className="justify-end">
              <Button variant="SecStyle" size="S">
                View
              </Button>
              <Button variant="PrimeStyle" size="S">
                Edit
              </Button>
            </ActionsGroup>
          </div>
        </div>
      ))}
    </div>
  )
}
```

### Toolbar Actions

Grouped toolbar controls.

```tsx
export function ToolbarActions() {
  return (
    <div className="border rounded-lg p-2 bg-background-system-body-secondary">
      <div className="flex items-center gap-2">
        {/* Text Formatting Group */}
        <ActionsGroup>
          <ActionButton size="S" title="Bold">
            <i className="ri-bold"></i>
          </ActionButton>
          <ActionButton size="S" title="Italic">
            <i className="ri-italic"></i>
          </ActionButton>
          <ActionButton size="S" title="Underline">
            <i className="ri-underline"></i>
          </ActionButton>
        </ActionsGroup>

        <Divider orientation="vertical" className="h-6" />

        {/* Alignment Group */}
        <ActionsGroup>
          <ActionButton size="S" title="Align Left">
            <i className="ri-align-left"></i>
          </ActionButton>
          <ActionButton size="S" title="Align Center">
            <i className="ri-align-center"></i>
          </ActionButton>
          <ActionButton size="S" title="Align Right">
            <i className="ri-align-right"></i>
          </ActionButton>
        </ActionsGroup>

        <Divider orientation="vertical" className="h-6" />

        {/* List Group */}
        <ActionsGroup>
          <ActionButton size="S" title="Bullet List">
            <i className="ri-list-unordered"></i>
          </ActionButton>
          <ActionButton size="S" title="Numbered List">
            <i className="ri-list-ordered"></i>
          </ActionButton>
        </ActionsGroup>

        <div className="flex-1" />

        {/* Save Group */}
        <ActionsGroup>
          <Button variant="SecStyle" size="S">
            Preview
          </Button>
          <Button variant="PrimeStyle" size="S">
            Publish
          </Button>
        </ActionsGroup>
      </div>
    </div>
  )
}
```

### Wizard Navigation

Multi-step form navigation.

```tsx
export function WizardNavigation() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  return (
    <div className="max-w-2xl">
      {/* Step Content */}
      <div className="border rounded-lg p-6 mb-4">
        <h2 className="text-xl font-bold mb-4">Step {currentStep} of {totalSteps}</h2>

        {currentStep === 1 && (
          <div>
            <h3 className="font-semibold mb-2">Personal Information</h3>
            {/* Form fields */}
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h3 className="font-semibold mb-2">Contact Details</h3>
            {/* Form fields */}
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h3 className="font-semibold mb-2">Review & Submit</h3>
            {/* Review content */}
          </div>
        )}
      </div>

      {/* Navigation Actions */}
      <ActionsGroup className="justify-between">
        <Button
          variant="SecStyle"
          disabled={currentStep === 1}
          onClick={() => setCurrentStep(currentStep - 1)}
        >
          <i className="ri-arrow-left-line mr-2"></i>
          Previous
        </Button>

        {currentStep < totalSteps ? (
          <Button
            variant="PrimeStyle"
            onClick={() => setCurrentStep(currentStep + 1)}
          >
            Next
            <i className="ri-arrow-right-line ml-2"></i>
          </Button>
        ) : (
          <Button variant="PrimeStyle">
            <i className="ri-check-line mr-2"></i>
            Submit
          </Button>
        )}
      </ActionsGroup>
    </div>
  )
}
```

### Confirmation Dialog

Confirmation actions with clear primary/secondary hierarchy.

```tsx
export function ConfirmationDialog({ title, message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
              <i className="ri-alert-line text-2xl text-yellow-600"></i>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-content-presentation-global-secondary">
                {message}
              </p>
            </div>
          </div>
        </div>

        <ActionsGroup withDivider className="p-6 justify-end gap-3">
          <Button variant="SecStyle" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="DangerStyle" onClick={onConfirm}>
            Confirm
          </Button>
        </ActionsGroup>
      </div>
    </div>
  )
}
```

### Table Row Actions

Inline actions for table rows.

```tsx
export function TableRowActions() {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    // ... more users
  ]

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-background-presentation-global-secondary">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-t">
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.role}</td>
              <td className="p-3">
                <ActionsGroup className="justify-end">
                  <ActionButton size="XS" title="Edit">
                    <i className="ri-pencil-line"></i>
                  </ActionButton>
                  <ActionButton size="XS" title="Delete">
                    <i className="ri-delete-bin-line"></i>
                  </ActionButton>
                </ActionsGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

### Loading States

Action groups with loading indicators.

```tsx
export function LoadingActions() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    await saveData()
    setIsLoading(false)
  }

  return (
    <ActionsGroup className="justify-end">
      <Button
        variant="SecStyle"
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button
        variant="PrimeStyle"
        onClick={handleSave}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <i className="ri-loader-4-line animate-spin mr-2"></i>
            Saving...
          </>
        ) : (
          <>
            <i className="ri-save-line mr-2"></i>
            Save
          </>
        )}
      </Button>
    </ActionsGroup>
  )
}
```

## API Reference

### ActionsGroup Props

Extends all HTML div element props.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| withDivider | `boolean` | `false` | Show dividers on both sides |
| theme | `Themes` | - | Theme override |
| className | `string` | - | Additional CSS classes |
| children | `ReactNode` | - | Action buttons and controls |

## Styling

### Default Styles

- **Display**: Flex container
- **Alignment**: Items centered
- **Gap**: 8px (0.5rem) between children
- **Width**: Full width by default

### Common Customizations

```tsx
// Right-aligned actions
<ActionsGroup className="justify-end" />

// Spaced between
<ActionsGroup className="justify-between" />

// Centered actions
<ActionsGroup className="justify-center" />

// Custom gap
<ActionsGroup className="gap-4" />

// Vertical stacking (mobile)
<ActionsGroup className="flex-col md:flex-row" />
```

## TypeScript Types

```typescript
interface ActionsGroupProps extends HTMLAttributes<HTMLDivElement> {
  withDivider?: boolean
  theme?: Themes
}

type Themes = 'light' | 'dark' | 'default'
```

## Common Patterns

### Responsive Actions

```tsx
function ResponsiveActions() {
  return (
    <ActionsGroup className="flex-col sm:flex-row justify-end">
      <Button variant="SecStyle" className="w-full sm:w-auto">
        Cancel
      </Button>
      <Button variant="PrimeStyle" className="w-full sm:w-auto">
        Save
      </Button>
    </ActionsGroup>
  )
}
```

### Grouped with Spacing

```tsx
function GroupedActions() {
  return (
    <div className="space-y-4">
      <ActionsGroup withDivider>
        <Button>Action 1</Button>
        <Button>Action 2</Button>
      </ActionsGroup>

      <ActionsGroup withDivider>
        <Button variant="DangerStyle" className="w-full">
          Dangerous Action
        </Button>
      </ActionsGroup>
    </div>
  )
}
```

## Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import ActionsGroup from '@/components/ActionsGroup'
import { Button } from '@/components/Button'

describe('ActionsGroup', () => {
  it('renders children correctly', () => {
    render(
      <ActionsGroup>
        <Button>Save</Button>
        <Button>Cancel</Button>
      </ActionsGroup>
    )

    expect(screen.getByText('Save')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('shows dividers when withDivider is true', () => {
    const { container } = render(
      <ActionsGroup withDivider>
        <Button>Action</Button>
      </ActionsGroup>
    )

    const dividers = container.querySelectorAll('[role="none"]')
    expect(dividers).toHaveLength(2)
  })

  it('applies custom className', () => {
    const { container } = render(
      <ActionsGroup className="justify-end">
        <Button>Action</Button>
      </ActionsGroup>
    )

    expect(container.firstChild).toHaveClass('justify-end')
  })

  it('handles button clicks', () => {
    const handleClick = jest.fn()

    render(
      <ActionsGroup>
        <Button onClick={handleClick}>Click Me</Button>
      </ActionsGroup>
    )

    fireEvent.click(screen.getByText('Click Me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

## Accessibility

- **Semantic HTML**: Uses section element
- **Keyboard Navigation**: All buttons are keyboard accessible
- **Focus Management**: Proper tab order through actions
- **Screen Reader**: Actions are announced correctly
- **Visual Hierarchy**: Clear primary/secondary action distinction

## Performance

- **Lightweight**: Minimal overhead (simple flex container)
- **No Re-renders**: Static container, children control their own state
- **Bundle Size**: ~0.2 KB gzipped
- **CSS-Only Layout**: Uses flexbox for efficient layout

## Migration Guide

### From Custom Container

```tsx
// Before: Custom div
<div className="flex items-center gap-2">
  <button>Save</button>
  <button>Cancel</button>
</div>

// After: ActionsGroup
<ActionsGroup>
  <Button>Save</Button>
  <Button>Cancel</Button>
</ActionsGroup>
```

### From Other Libraries

```tsx
// Before: Material-UI DialogActions
<DialogActions>
  <Button>Cancel</Button>
  <Button>Save</Button>
</DialogActions>

// After: ActionsGroup
<ActionsGroup className="justify-end">
  <Button>Cancel</Button>
  <Button>Save</Button>
</ActionsGroup>
```

## Best Practices

1. **Consistent Alignment**: Use `justify-end` for form actions
2. **Primary Action Last**: Place primary action on the right (or bottom on mobile)
3. **Limit Actions**: Keep 2-4 actions per group for clarity
4. **Clear Hierarchy**: Use variant styling to indicate primary vs secondary
5. **Loading States**: Disable all actions during async operations
6. **Responsive Design**: Stack vertically on mobile if needed
7. **Dividers**: Use `withDivider` sparingly for emphasis
8. **Icon Usage**: Add icons to clarify action purpose