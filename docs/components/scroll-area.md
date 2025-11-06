---
title: ScrollArea
description: Custom styled scrollable container with controlled scrollbar appearance built on Radix UI.
component: true
group: Layout & Containers
keywords: [scroll, scrollbar, overflow, container, viewport, radix]
---

# ScrollArea

A customizable scrollable container component with styled scrollbars. Built on Radix UI's ScrollArea primitive for consistent cross-browser scrolling behavior.

## Installation

```bash
npx torch-cli add scroll-area
```

**Dependencies**: Requires `@radix-ui/react-scroll-area`

## Imports

```typescript
import { ScrollArea, ScrollBar } from '@/components/ScrollArea'
```

## Basic Usage

```tsx
import { ScrollArea } from '@/components/ScrollArea'

export function BasicScrollArea() {
  return (
    <ScrollArea className="h-[300px] w-full rounded-lg p-4">
      <div className="space-y-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="p-4 border rounded">
            Item {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
```

## Examples

### Vertical Scrolling

Standard vertical scroll container.

```tsx
export function VerticalScroll() {
  const items = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `Article ${i + 1}`,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  }))

  return (
    <ScrollArea className="h-[500px] w-full rounded-lg border">
      <div className="p-6 space-y-4">
        {items.map(item => (
          <article key={item.id} className="pb-4 border-b">
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-content-presentation-global-secondary">
              {item.content}
            </p>
          </article>
        ))}
      </div>
    </ScrollArea>
  )
}
```

### Horizontal Scrolling

Horizontal scroll for wide content.

```tsx
export function HorizontalScroll() {
  return (
    <ScrollArea className="w-full rounded-lg border">
      <div className="flex gap-4 p-4" style={{ width: 'max-content' }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-64 h-40 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl"
          >
            Card {i + 1}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
```

### Both Directions

Scroll in both vertical and horizontal directions.

```tsx
export function BidirectionalScroll() {
  return (
    <ScrollArea className="h-[400px] w-full rounded-lg border">
      <div className="p-4" style={{ minWidth: '1200px' }}>
        <table className="w-full">
          <thead>
            <tr className="bg-background-presentation-global-secondary">
              {Array.from({ length: 10 }).map((_, i) => (
                <th key={i} className="p-3 text-left whitespace-nowrap">
                  Column {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 30 }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b">
                {Array.from({ length: 10 }).map((_, colIndex) => (
                  <td key={colIndex} className="p-3 whitespace-nowrap">
                    Data {rowIndex + 1},{colIndex + 1}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
```

### Chat Messages

Scrollable chat message container.

```tsx
export function ChatMessages() {
  const messages = [
    { id: 1, user: 'John', text: 'Hey! How are you?', time: '10:30 AM', own: false },
    { id: 2, user: 'You', text: 'I\'m good! Thanks for asking.', time: '10:31 AM', own: true },
    { id: 3, user: 'John', text: 'Working on anything interesting?', time: '10:32 AM', own: false },
    // ... more messages
  ]

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll to bottom on new messages
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="flex flex-col h-[600px] border rounded-lg">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Chat with John</h3>
      </div>

      <ScrollArea className="flex-1">
        <div ref={scrollRef} className="p-4 space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.own ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[70%] rounded-lg p-3",
                  message.own
                    ? "bg-blue-500 text-white"
                    : "bg-background-presentation-global-secondary"
                )}
              >
                {!message.own && (
                  <div className="text-xs font-semibold mb-1">{message.user}</div>
                )}
                <div>{message.text}</div>
                <div className="text-xs opacity-70 mt-1">{message.time}</div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <input
          type="text"
          placeholder="Type a message..."
          className="w-full px-3 py-2 border rounded"
        />
      </div>
    </div>
  )
}
```

### Code Block

Scrollable code display.

```tsx
export function CodeBlock() {
  const code = `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// Example usage
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log("Original array:", numbers);
const sorted = bubbleSort([...numbers]);
console.log("Sorted array:", sorted);`

  return (
    <div className="rounded-lg overflow-hidden border">
      <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
        <span className="text-sm font-mono">bubbleSort.js</span>
        <button className="text-xs hover:bg-gray-700 px-2 py-1 rounded">
          Copy
        </button>
      </div>

      <ScrollArea className="h-[300px]">
        <pre className="p-4 bg-gray-900 text-gray-100 font-mono text-sm">
          <code>{code}</code>
        </pre>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
```

### Notification List

Scrollable notifications panel.

```tsx
export function NotificationList() {
  const notifications = [
    {
      id: 1,
      type: 'message',
      title: 'New message from Sarah',
      description: 'Hey, can we schedule a meeting?',
      time: '2 minutes ago',
      unread: true,
    },
    // ... more notifications
  ]

  return (
    <div className="w-96 border rounded-lg shadow-lg">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold">Notifications</h3>
        <button className="text-sm text-blue-500">Mark all as read</button>
      </div>

      <ScrollArea className="h-[400px]">
        <div>
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={cn(
                "p-4 border-b hover:bg-background-presentation-global-secondary cursor-pointer transition-colors",
                notification.unread && "bg-blue-50"
              )}
            >
              <div className="flex gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full mt-2",
                  notification.unread ? "bg-blue-500" : "bg-transparent"
                )} />
                <div className="flex-1">
                  <h4 className="font-medium">{notification.title}</h4>
                  <p className="text-sm text-content-presentation-global-secondary mt-1">
                    {notification.description}
                  </p>
                  <span className="text-xs text-content-presentation-global-tertiary mt-2 block">
                    {notification.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
```

### File Explorer

Scrollable directory tree.

```tsx
export function FileExplorer() {
  const fileStructure = {
    name: 'project',
    type: 'folder',
    children: [
      {
        name: 'src',
        type: 'folder',
        children: [
          { name: 'components', type: 'folder', children: [] },
          { name: 'utils', type: 'folder', children: [] },
          { name: 'index.tsx', type: 'file' },
        ]
      },
      { name: 'package.json', type: 'file' },
      // ... more files
    ]
  }

  const FileTreeItem = ({ item, depth = 0 }) => (
    <div>
      <div
        className="flex items-center gap-2 px-2 py-1 hover:bg-background-presentation-global-secondary cursor-pointer rounded"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        <i className={item.type === 'folder' ? 'ri-folder-line' : 'ri-file-line'}></i>
        <span className="text-sm">{item.name}</span>
      </div>
      {item.children?.map((child, index) => (
        <FileTreeItem key={index} item={child} depth={depth + 1} />
      ))}
    </div>
  )

  return (
    <div className="w-64 border rounded-lg">
      <div className="p-3 border-b font-semibold">
        Explorer
      </div>

      <ScrollArea className="h-[500px]">
        <div className="p-2">
          <FileTreeItem item={fileStructure} />
        </div>
      </ScrollArea>
    </div>
  )
}
```

### Image Gallery

Horizontal scrolling gallery.

```tsx
export function ImageGallery() {
  const images = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    url: `/images/photo-${i + 1}.jpg`,
    title: `Photo ${i + 1}`
  }))

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gallery</h2>

      <ScrollArea className="w-full rounded-lg">
        <div className="flex gap-4 p-4" style={{ width: 'max-content' }}>
          {images.map(image => (
            <div key={image.id} className="flex-shrink-0">
              <div className="w-64 h-48 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-2 text-sm text-center">{image.title}</p>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
```

### Settings Panel

Scrollable settings with sections.

```tsx
export function SettingsPanel() {
  return (
    <div className="max-w-2xl border rounded-lg">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-sm text-content-presentation-global-secondary mt-1">
          Manage your account preferences
        </p>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="p-6 space-y-6">
          {/* Profile Section */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Display Name</label>
                <input type="text" className="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea rows={3} className="w-full px-3 py-2 border rounded"></textarea>
              </div>
            </div>
          </section>

          <Divider />

          {/* Notifications Section */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Notifications</h3>
            <div className="space-y-3">
              <LabeledCheckBox id="email" label="Email notifications" />
              <LabeledCheckBox id="push" label="Push notifications" />
              <LabeledCheckBox id="sms" label="SMS notifications" />
            </div>
          </section>

          <Divider />

          {/* More sections... */}
        </div>
      </ScrollArea>
    </div>
  )
}
```

## API Reference

### ScrollArea Props

Extends all Radix UI ScrollArea.Root props.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | - | Additional CSS classes |
| children | `ReactNode` | - | Scrollable content |
| ref | `Ref` | - | Forwarded ref |

### ScrollBar Props

Extends all Radix UI ScrollAreaScrollbar props.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| orientation | `'vertical' \| 'horizontal'` | `'vertical'` | Scrollbar orientation |
| className | `string` | - | Additional CSS classes |
| ref | `Ref` | - | Forwarded ref |

## Styling

### Default Styles

- **Container**: Border, shadow, background color
- **Scrollbar Width**: 10px (2.5 Tailwind units)
- **Scrollbar Thumb**: Rounded, border color
- **Overflow**: Hidden with custom scrollbars

### Customization

```tsx
// Custom height
<ScrollArea className="h-[500px]" />

// Custom width
<ScrollArea className="w-[600px]" />

// Remove default styles
<ScrollArea className="border-0 shadow-none" />

// Custom scrollbar
<ScrollBar className="w-4 bg-gray-100" />
```

## TypeScript Types

```typescript
import type * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'

type ScrollAreaProps = React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.Root
>

type ScrollBarProps = React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.ScrollAreaScrollbar
>
```

## Common Patterns

### Auto-Scroll to Bottom

```tsx
function AutoScrollContainer({ messages }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight
      }
    }
  }, [messages])

  return (
    <ScrollArea ref={scrollRef} className="h-[400px]">
      {/* Content */}
    </ScrollArea>
  )
}
```

### Programmatic Scrolling

```tsx
function ScrollToTop() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToTop = () => {
    const viewport = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]')
    viewport?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <ScrollArea ref={scrollRef} className="h-[400px]">
        {/* Content */}
      </ScrollArea>
      <button onClick={scrollToTop}>Back to Top</button>
    </>
  )
}
```

## Testing

```typescript
import { render, screen } from '@testing-library/react'
import { ScrollArea, ScrollBar } from '@/components/ScrollArea'

describe('ScrollArea', () => {
  it('renders children correctly', () => {
    render(
      <ScrollArea>
        <div>Test content</div>
      </ScrollArea>
    )

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <ScrollArea className="custom-class">
        Content
      </ScrollArea>
    )

    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('renders horizontal scrollbar', () => {
    const { container } = render(
      <ScrollArea>
        Content
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    )

    const scrollbar = container.querySelector('[orientation="horizontal"]')
    expect(scrollbar).toBeInTheDocument()
  })
})
```

## Accessibility

- **Keyboard Navigation**: Arrow keys, Page Up/Down, Home/End
- **Screen Reader**: Announces scrollable region
- **Focus Management**: Maintains focus within scroll area
- **Touch Support**: Native touch scrolling on mobile
- **Scroll Indicators**: Visual scrollbar for context

## Performance

- **Virtual Scrolling**: Consider for large lists (use with react-window)
- **Render Optimization**: Only renders visible content
- **Smooth Scrolling**: Hardware-accelerated
- **Bundle Size**: ~2 KB (with Radix UI dependency)

### Performance Tips

```tsx
// Virtualize large lists
import { FixedSizeList } from 'react-window'

<ScrollArea className="h-[400px]">
  <FixedSizeList
    height={400}
    itemCount={1000}
    itemSize={35}
  >
    {({ index, style }) => (
      <div style={style}>Item {index}</div>
    )}
  </FixedSizeList>
</ScrollArea>

// Memoize content
const MemoizedContent = React.memo(({ data }) => (
  // Expensive content
))
```

## Migration Guide

### From Native Overflow

```tsx
// Before: Native scrolling
<div className="h-[400px] overflow-auto">
  Content
</div>

// After: ScrollArea
<ScrollArea className="h-[400px]">
  Content
</ScrollArea>
```

### From Other Libraries

```tsx
// Before: react-custom-scrollbars
<Scrollbars style={{ height: 400 }}>
  Content
</Scrollbars>

// After: ScrollArea
<ScrollArea className="h-[400px]">
  Content
</ScrollArea>
```

## Best Practices

1. **Set Fixed Height**: Always specify height for vertical scrolling
2. **Use Horizontal ScrollBar**: Add `<ScrollBar orientation="horizontal" />` for horizontal scrolling
3. **Consider Virtual Scrolling**: For lists with 100+ items
4. **Smooth Scrolling**: Use CSS `scroll-behavior: smooth` for animated scrolling
5. **Mobile Touch**: Test touch scrolling on mobile devices
6. **Accessibility**: Ensure keyboard navigation works properly
7. **Performance**: Memoize expensive content
8. **Auto-Scroll**: Implement auto-scroll for chat/log interfaces