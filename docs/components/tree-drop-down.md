---
title: TreeDropDown
description: Expandable/collapsible tree navigation item with smooth animations for hierarchical content
group: Data Display
keywords: [tree, dropdown, navigation, expandable, collapsible, accordion, hierarchy, nested]
---

# TreeDropDown

> An animated expandable/collapsible tree navigation component for displaying hierarchical content structures. Perfect for nested navigation menus, file trees, and categorized lists.

## Installation

```bash
npm install class-variance-authority
```

## Import

```typescript
import { TreeDropDown } from '@torch-ui/components'
```

## Quick Examples

### Basic Usage

```typescript
import { TreeDropDown } from '@torch-ui/components'

function Example() {
  return (
    <TreeDropDown treeLabel="Documents">
      <div>README.md</div>
      <div>package.json</div>
      <div>tsconfig.json</div>
    </TreeDropDown>
  )
}
```

### Nested Tree Structure

```typescript
import { TreeDropDown } from '@torch-ui/components'

function FileTree() {
  return (
    <TreeDropDown treeLabel="src" variant="default">
      <TreeDropDown treeLabel="components" variant="secondary">
        <div>Button.tsx</div>
        <div>Input.tsx</div>
        <div>Card.tsx</div>
      </TreeDropDown>
      <TreeDropDown treeLabel="utils" variant="secondary">
        <div>helpers.ts</div>
        <div>constants.ts</div>
      </TreeDropDown>
      <div>index.ts</div>
    </TreeDropDown>
  )
}
```

### Controlled State

```typescript
import { TreeDropDown } from '@torch-ui/components'
import { useState } from 'react'

function ControlledTree() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Collapse' : 'Expand'} Tree
      </button>
      <TreeDropDown
        treeLabel="Settings"
        open={isOpen}
      >
        <div>General</div>
        <div>Privacy</div>
        <div>Security</div>
      </TreeDropDown>
    </div>
  )
}
```

### With Custom Labels

```typescript
import { TreeDropDown } from '@torch-ui/components'
import { Badge } from '@torch-ui/components'

function TreeWithBadges() {
  return (
    <TreeDropDown
      treeLabel={
        <div className="flex items-center gap-2">
          <span>Notifications</span>
          <Badge variant="red" label="3" size="XS" />
        </div>
      }
    >
      <div>New message from Alice</div>
      <div>Comment on your post</div>
      <div>System update available</div>
    </TreeDropDown>
  )
}
```

### Documentation Navigation

```typescript
import { TreeDropDown } from '@torch-ui/components'

function DocsNavigation() {
  return (
    <div className="space-y-1">
      <TreeDropDown treeLabel="Getting Started" variant="default">
        <div>Installation</div>
        <div>Quick Start</div>
        <div>Configuration</div>
      </TreeDropDown>

      <TreeDropDown treeLabel="Components" variant="default">
        <TreeDropDown treeLabel="Forms" variant="secondary">
          <div>Button</div>
          <div>Input</div>
          <div>Checkbox</div>
        </TreeDropDown>
        <TreeDropDown treeLabel="Layout" variant="secondary">
          <div>Card</div>
          <div>Grid</div>
        </TreeDropDown>
      </TreeDropDown>

      <TreeDropDown treeLabel="API Reference" variant="default">
        <div>Props</div>
        <div>Hooks</div>
        <div>Types</div>
      </TreeDropDown>
    </div>
  )
}
```

### Dark Theme

```typescript
import { TreeDropDown } from '@torch-ui/components'

function DarkTree() {
  return (
    <TreeDropDown
      treeLabel="Dark Mode Tree"
      theme="dark"
      variant="default"
    >
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
    </TreeDropDown>
  )
}
```

### With Icons

```typescript
import { TreeDropDown } from '@torch-ui/components'

function IconTree() {
  return (
    <TreeDropDown
      treeLabel={
        <div className="flex items-center gap-2">
          <i className="ri-folder-line" />
          <span>Projects</span>
        </div>
      }
    >
      <div className="flex items-center gap-2">
        <i className="ri-file-text-line" />
        <span>project-1.md</span>
      </div>
      <div className="flex items-center gap-2">
        <i className="ri-file-code-line" />
        <span>app.tsx</span>
      </div>
    </TreeDropDown>
  )
}
```

### Multi-Level Navigation

```typescript
import { TreeDropDown } from '@torch-ui/components'

function MultiLevelNav() {
  return (
    <TreeDropDown treeLabel="Company" variant="default" open>
      <TreeDropDown treeLabel="Engineering" variant="secondary">
        <TreeDropDown treeLabel="Frontend" variant="secondary">
          <div>React Team</div>
          <div>Vue Team</div>
        </TreeDropDown>
        <TreeDropDown treeLabel="Backend" variant="secondary">
          <div>API Team</div>
          <div>Database Team</div>
        </TreeDropDown>
      </TreeDropDown>
      <TreeDropDown treeLabel="Design" variant="secondary">
        <div>UI/UX</div>
        <div>Graphics</div>
      </TreeDropDown>
    </TreeDropDown>
  )
}
```

### Custom Styling

```typescript
import { TreeDropDown } from '@torch-ui/components'

function StyledTree() {
  return (
    <TreeDropDown
      treeLabel="Custom Styled Tree"
      className="border border-gray-300 rounded-lg p-2"
      childrenContainerClassName="bg-gray-50 rounded p-2"
    >
      <div className="hover:bg-gray-100 p-2 rounded">Item 1</div>
      <div className="hover:bg-gray-100 p-2 rounded">Item 2</div>
      <div className="hover:bg-gray-100 p-2 rounded">Item 3</div>
    </TreeDropDown>
  )
}
```

### Initially Expanded

```typescript
import { TreeDropDown } from '@torch-ui/components'

function ExpandedByDefault() {
  return (
    <TreeDropDown
      treeLabel="Expanded Section"
      open={true} // Initially expanded
    >
      <div>Visible content 1</div>
      <div>Visible content 2</div>
      <div>Visible content 3</div>
    </TreeDropDown>
  )
}
```

## API Reference

### TreeDropDown Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `treeLabel` | `ReactNode` | Required | Label/header for the tree item (can be string or JSX) |
| `variant` | `'default' \| 'secondary'` | `'secondary'` | Visual style variant |
| `open` | `boolean` | `undefined` | Controlled open/closed state |
| `theme` | `'dark' \| 'light' \| 'default'` | - | Theme variant |
| `className` | `string` | - | Additional CSS classes for the header |
| `childrenContainerClassName` | `string` | - | Additional CSS classes for children container |
| `children` | `ReactNode` | - | Content to show when expanded |

### Inherited Props

Extends `HTMLAttributes<HTMLDivElement>`, so all standard div props are supported:
- `onClick`, `onMouseEnter`, `onMouseLeave`, etc.
- `id`, `role`, `aria-*` attributes
- `style`, `data-*` attributes

## TypeScript

### Full Type Definitions

```typescript
import { HTMLAttributes, ReactNode } from 'react'
import { VariantProps } from 'class-variance-authority'

interface TreeDropDownProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof TreeDropDownVariants> {
  theme?: 'dark' | 'light' | 'default'
  treeLabel: ReactNode
  open?: boolean
  variant?: 'secondary' | 'default'
  childrenContainerClassName?: string
}

export const TreeDropDown: React.FC<TreeDropDownProps>
```

### Usage with TypeScript

```typescript
import { TreeDropDown } from '@torch-ui/components'
import { ReactNode } from 'react'

interface TreeItem {
  id: string
  label: ReactNode
  children?: TreeItem[]
}

function TypedTree({ items }: { items: TreeItem[] }) {
  return (
    <>
      {items.map((item) => (
        <TreeDropDown key={item.id} treeLabel={item.label}>
          {item.children?.map((child) => (
            <div key={child.id}>{child.label}</div>
          ))}
        </TreeDropDown>
      ))}
    </>
  )
}
```

## Common Patterns

### Recursive Tree Structure

```typescript
import { TreeDropDown } from '@torch-ui/components'

interface TreeNode {
  id: string
  label: string
  children?: TreeNode[]
}

function RecursiveTree({ nodes }: { nodes: TreeNode[] }) {
  return (
    <>
      {nodes.map((node) =>
        node.children ? (
          <TreeDropDown key={node.id} treeLabel={node.label}>
            <RecursiveTree nodes={node.children} />
          </TreeDropDown>
        ) : (
          <div key={node.id}>{node.label}</div>
        )
      )}
    </>
  )
}

// Usage
const data: TreeNode[] = [
  {
    id: '1',
    label: 'Parent 1',
    children: [
      { id: '1.1', label: 'Child 1.1' },
      {
        id: '1.2',
        label: 'Child 1.2',
        children: [{ id: '1.2.1', label: 'Grandchild 1.2.1' }],
      },
    ],
  },
]

<RecursiveTree nodes={data} />
```

### Expand/Collapse All

```typescript
import { TreeDropDown } from '@torch-ui/components'
import { useState } from 'react'

function ExpandCollapseAll() {
  const [expandAll, setExpandAll] = useState(false)

  return (
    <div>
      <button onClick={() => setExpandAll(!expandAll)}>
        {expandAll ? 'Collapse' : 'Expand'} All
      </button>

      <TreeDropDown treeLabel="Section 1" open={expandAll}>
        <div>Item 1.1</div>
        <div>Item 1.2</div>
      </TreeDropDown>

      <TreeDropDown treeLabel="Section 2" open={expandAll}>
        <div>Item 2.1</div>
        <div>Item 2.2</div>
      </TreeDropDown>
    </div>
  )
}
```

### With Active State

```typescript
import { TreeDropDown } from '@torch-ui/components'
import { useState } from 'react'

function NavigationTree() {
  const [activeItem, setActiveItem] = useState<string>('home')

  const Item = ({ id, label }: { id: string; label: string }) => (
    <div
      onClick={() => setActiveItem(id)}
      className={`cursor-pointer p-2 rounded ${
        activeItem === id ? 'bg-blue-100 text-blue-600' : ''
      }`}
    >
      {label}
    </div>
  )

  return (
    <TreeDropDown treeLabel="Navigation">
      <Item id="home" label="Home" />
      <Item id="about" label="About" />
      <Item id="contact" label="Contact" />
    </TreeDropDown>
  )
}
```

## Variants

### Default Variant

- Used for top-level tree items
- Purple/blue accent colors when active
- Suitable for primary navigation sections

```typescript
<TreeDropDown variant="default" treeLabel="Main Section">
  {/* content */}
</TreeDropDown>
```

### Secondary Variant

- Used for nested tree items
- Navy/blue accent colors when active
- Better for nested hierarchies

```typescript
<TreeDropDown variant="secondary" treeLabel="Subsection">
  {/* content */}
</TreeDropDown>
```

## Animation Behavior

### Expand Animation
- Max-height transitions from 0 to 20000px
- Duration: 500ms ease-in-out
- Arrow rotates 180 degrees
- Margin-top adds 4px spacing

### Collapse Animation
- Max-height transitions to 0
- Duration: 500ms ease-in-out
- Arrow rotates back to 0 degrees
- Margin-top returns to 0

### Hover Effects
- Background color change
- Border color highlight
- Gap increases slightly (2px → 14px or 8px when active)
- Duration: 150ms ease-in-out

## Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { TreeDropDown } from '@torch-ui/components'

describe('TreeDropDown', () => {
  it('renders tree label', () => {
    render(
      <TreeDropDown treeLabel="My Tree">
        <div>Child content</div>
      </TreeDropDown>
    )

    expect(screen.getByText('My Tree')).toBeInTheDocument()
  })

  it('toggles content on click', () => {
    render(
      <TreeDropDown treeLabel="Toggle Tree">
        <div>Hidden content</div>
      </TreeDropDown>
    )

    const header = screen.getByText('Toggle Tree')

    // Initially collapsed
    expect(screen.queryByText('Hidden content')).not.toBeVisible()

    // Click to expand
    fireEvent.click(header)
    expect(screen.getByText('Hidden content')).toBeVisible()

    // Click to collapse
    fireEvent.click(header)
    expect(screen.queryByText('Hidden content')).not.toBeVisible()
  })

  it('respects controlled open prop', () => {
    const { rerender } = render(
      <TreeDropDown treeLabel="Controlled" open={false}>
        <div>Content</div>
      </TreeDropDown>
    )

    expect(screen.queryByText('Content')).not.toBeVisible()

    rerender(
      <TreeDropDown treeLabel="Controlled" open={true}>
        <div>Content</div>
      </TreeDropDown>
    )

    expect(screen.getByText('Content')).toBeVisible()
  })
})
```

### Testing Nested Trees

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { TreeDropDown } from '@torch-ui/components'

test('nested trees work independently', () => {
  render(
    <TreeDropDown treeLabel="Parent">
      <TreeDropDown treeLabel="Child">
        <div>Grandchild</div>
      </TreeDropDown>
    </TreeDropDown>
  )

  // Expand parent
  fireEvent.click(screen.getByText('Parent'))
  expect(screen.getByText('Child')).toBeInTheDocument()

  // Expand child
  fireEvent.click(screen.getByText('Child'))
  expect(screen.getByText('Grandchild')).toBeVisible()
})
```

## Accessibility

- **Keyboard Support**:
  - Enter/Space: Toggle expansion
  - Tab: Navigate between tree items
  - Arrow keys: Navigate within tree (when properly configured)
- **ARIA Attributes** (add manually for best support):
  ```typescript
  <TreeDropDown
    treeLabel="Section"
    role="treeitem"
    aria-expanded={isOpen}
  >
    {/* content */}
  </TreeDropDown>
  ```
- **Screen Readers**: Announce expansion state changes
- **Focus Management**: Visible focus outline on keyboard navigation
- **Reduced Motion**: Respects `prefers-reduced-motion` for animations

### Enhanced Accessibility Example

```typescript
import { TreeDropDown } from '@torch-ui/components'
import { useState } from 'react'

function AccessibleTree() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <TreeDropDown
      treeLabel="Accessible Tree"
      open={isOpen}
      role="treeitem"
      aria-expanded={isOpen}
      aria-label="File tree navigation"
    >
      <div role="group">
        <div role="treeitem" tabIndex={0}>
          Item 1
        </div>
        <div role="treeitem" tabIndex={0}>
          Item 2
        </div>
      </div>
    </TreeDropDown>
  )
}
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (gzip) | ~1.8kb |
| Dependencies | class-variance-authority |
| First render | <3ms |
| Animation duration | 500ms |
| Tree-shakeable | ✅ |

### Performance Tips

1. **Avoid deeply nested structures**: Limit to 3-4 levels for best UX
   ```typescript
   // Good: 2-3 levels
   <TreeDropDown>
     <TreeDropDown>
       <div>Content</div>
     </TreeDropDown>
   </TreeDropDown>
   ```

2. **Memoize tree labels**: Use `useMemo` for complex labels
   ```typescript
   const label = useMemo(() => (
     <ComplexLabel data={data} />
   ), [data])
   ```

3. **Virtualize large lists**: Use react-window for 100+ items
   ```typescript
   import { FixedSizeList } from 'react-window'
   ```

## Migration from Accordion

```diff
- import { Accordion } from 'other-library'
+ import { TreeDropDown } from '@torch-ui/components'

- <Accordion title="Section">
+ <TreeDropDown treeLabel="Section">
    <div>Content</div>
- </Accordion>
+ </TreeDropDown>
```

## Best Practices

1. **Use appropriate variants**: `default` for top-level, `secondary` for nested items
   ```typescript
   <TreeDropDown variant="default">
     <TreeDropDown variant="secondary">
       {/* content */}
     </TreeDropDown>
   </TreeDropDown>
   ```

2. **Provide meaningful labels**: Use clear, descriptive text or components
   ```typescript
   <TreeDropDown treeLabel="User Settings (5)">
     {/* Not just "Settings" */}
   </TreeDropDown>
   ```

3. **Limit nesting depth**: Keep hierarchies shallow (3-4 levels max)
   ```typescript
   // Avoid more than 3-4 levels of nesting
   ```

4. **Control state when needed**: Use `open` prop for coordinated behavior
   ```typescript
   <TreeDropDown open={expandAll}>
     {/* Synchronized expansion */}
   </TreeDropDown>
   ```

5. **Add icons for context**: Help users understand content types
   ```typescript
   <TreeDropDown
     treeLabel={
       <>
         <i className="ri-folder-line" />
         Folder Name
       </>
     }
   >
   ```

6. **Style children appropriately**: Use `childrenContainerClassName` for custom styling
   ```typescript
   <TreeDropDown childrenContainerClassName="space-y-2 p-2">
     {/* Well-spaced children */}
   </TreeDropDown>
   ```

7. **Handle empty states**: Show message when no children exist
   ```typescript
   <TreeDropDown treeLabel="Empty Folder">
     {children.length === 0 ? (
       <div className="text-gray-500">No items</div>
     ) : children}
   </TreeDropDown>
   ```

## Related Components

- [TreeSubLayout](./tree-sub-layout.md) - Complete tree navigation layout
- [ActionsGroup](./actions-group.md) - Group related tree actions
- [ScrollArea](./scroll-area.md) - Wrap long tree content
