---
title: Avatar
description: User profile image component with automatic fallback to initials, built on Radix UI Avatar primitive.
component: true
group: Data Display
keywords: [avatar, profile, image, user, picture, fallback, initials]
---

# Avatar

A flexible avatar component for displaying user profile images with automatic fallback support. Built on Radix UI's Avatar primitive for robust image loading handling.

## Installation

```bash
npx torch-cli add avatar
```

**Dependencies**: Requires `@radix-ui/react-avatar`

## Imports

```typescript
import { Avatar, AvatarImage, AvatarFallback } from '@/components/Avatar'
```

## Basic Usage

```tsx
import { Avatar, AvatarImage, AvatarFallback } from '@/components/Avatar'

export function BasicAvatar() {
  return (
    <Avatar>
      <AvatarImage src="/user-photo.jpg" alt="User Name" />
      <AvatarFallback>UN</AvatarFallback>
    </Avatar>
  )
}
```

## Examples

### With Image

Avatar displaying user photo with fallback.

```tsx
export function AvatarWithImage() {
  return (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="User" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>

      <div>
        <h4 className="font-semibold">John Doe</h4>
        <p className="text-sm text-content-presentation-global-secondary">
          john@example.com
        </p>
      </div>
    </div>
  )
}
```

### Fallback Initials

Avatar showing initials when image fails to load.

```tsx
export function AvatarWithInitials() {
  const users = [
    { name: 'John Doe', initials: 'JD' },
    { name: 'Jane Smith', initials: 'JS' },
    { name: 'Bob Johnson', initials: 'BJ' },
    { name: 'Alice Brown', initials: 'AB' },
  ]

  return (
    <div className="flex gap-3">
      {users.map(user => (
        <Avatar key={user.name}>
          <AvatarImage src="/invalid-url.jpg" alt={user.name} />
          <AvatarFallback>{user.initials}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  )
}
```

### Different Sizes

Avatars in various sizes for different contexts.

```tsx
export function AvatarSizes() {
  return (
    <div className="flex items-end gap-4">
      <div className="flex flex-col items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/user.jpg" />
          <AvatarFallback className="text-xs">XS</AvatarFallback>
        </Avatar>
        <span className="text-xs">32px</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/user.jpg" />
          <AvatarFallback className="text-sm">S</AvatarFallback>
        </Avatar>
        <span className="text-xs">40px (default)</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src="/user.jpg" />
          <AvatarFallback>M</AvatarFallback>
        </Avatar>
        <span className="text-xs">48px</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Avatar className="h-16 w-16">
          <AvatarImage src="/user.jpg" />
          <AvatarFallback className="text-lg">L</AvatarFallback>
        </Avatar>
        <span className="text-xs">64px</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Avatar className="h-24 w-24">
          <AvatarImage src="/user.jpg" />
          <AvatarFallback className="text-2xl">XL</AvatarFallback>
        </Avatar>
        <span className="text-xs">96px</span>
      </div>
    </div>
  )
}
```

### User List

List of users with avatars and info.

```tsx
export function UserList() {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', avatar: '/john.jpg', status: 'online' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', avatar: '/jane.jpg', status: 'offline' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', avatar: '/bob.jpg', status: 'away' },
  ]

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="space-y-2">
      {users.map(user => (
        <div key={user.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-background-presentation-global-secondary">
          <div className="relative">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <span className={cn(
              "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
              user.status === 'online' && "bg-green-500",
              user.status === 'offline' && "bg-gray-400",
              user.status === 'away' && "bg-yellow-500"
            )} />
          </div>

          <div className="flex-1">
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-content-presentation-global-secondary">
              {user.email}
            </div>
          </div>

          <button className="text-sm text-blue-500 hover:underline">
            Message
          </button>
        </div>
      ))}
    </div>
  )
}
```

### Avatar Group

Stacked avatars showing group members.

```tsx
export function AvatarGroup() {
  const members = [
    { name: 'Alice', avatar: '/alice.jpg' },
    { name: 'Bob', avatar: '/bob.jpg' },
    { name: 'Charlie', avatar: '/charlie.jpg' },
    { name: 'David', avatar: '/david.jpg' },
  ]

  const remainingCount = 12

  return (
    <div>
      <h4 className="font-semibold mb-3">Project Team (16 members)</h4>

      <div className="flex items-center">
        {members.map((member, index) => (
          <Avatar
            key={member.name}
            className="border-2 border-white -ml-2 first:ml-0"
            style={{ zIndex: members.length - index }}
          >
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback>{member.name[0]}</AvatarFallback>
          </Avatar>
        ))}

        {remainingCount > 0 && (
          <div className="h-10 w-10 rounded-full bg-background-presentation-global-secondary border-2 border-white -ml-2 flex items-center justify-center text-sm font-semibold"
            style={{ zIndex: 0 }}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    </div>
  )
}
```

### Colored Fallbacks

Unique colors for each user's initials.

```tsx
export function ColoredAvatars() {
  const users = [
    { name: 'John Doe', color: 'bg-blue-500' },
    { name: 'Jane Smith', color: 'bg-green-500' },
    { name: 'Bob Johnson', color: 'bg-purple-500' },
    { name: 'Alice Brown', color: 'bg-pink-500' },
    { name: 'Charlie Davis', color: 'bg-orange-500' },
  ]

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('')
  }

  return (
    <div className="flex gap-3">
      {users.map(user => (
        <Avatar key={user.name}>
          <AvatarImage src="/invalid.jpg" />
          <AvatarFallback className={cn(user.color, "text-white")}>
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
      ))}
    </div>
  )
}
```

### With Status Indicator

Avatar showing online/offline status.

```tsx
export function AvatarWithStatus() {
  const [isOnline, setIsOnline] = useState(true)

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Avatar className="h-16 w-16">
          <AvatarImage src="/user.jpg" alt="User" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>

        {/* Status indicator */}
        <span className={cn(
          "absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white",
          isOnline ? "bg-green-500" : "bg-gray-400"
        )} />
      </div>

      <div>
        <h4 className="font-semibold">John Doe</h4>
        <p className="text-sm text-content-presentation-global-secondary">
          {isOnline ? 'Online' : 'Offline'}
        </p>
        <button
          onClick={() => setIsOnline(!isOnline)}
          className="text-xs text-blue-500 mt-1"
        >
          Toggle Status
        </button>
      </div>
    </div>
  )
}
```

### Comment Thread

Avatars in comment/chat interfaces.

```tsx
export function CommentThread() {
  const comments = [
    { id: 1, author: 'John Doe', avatar: '/john.jpg', text: 'This looks great!', time: '2 hours ago' },
    { id: 2, author: 'Jane Smith', avatar: '/jane.jpg', text: 'Agreed, nice work!', time: '1 hour ago' },
    { id: 3, author: 'Bob Johnson', avatar: '/bob.jpg', text: 'Can we add more features?', time: '30 min ago' },
  ]

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('')

  return (
    <div className="space-y-4">
      {comments.map(comment => (
        <div key={comment.id} className="flex gap-3">
          <Avatar>
            <AvatarImage src={comment.avatar} alt={comment.author} />
            <AvatarFallback>{getInitials(comment.author)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 bg-background-presentation-global-secondary p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-sm">{comment.author}</span>
              <span className="text-xs text-content-presentation-global-tertiary">
                {comment.time}
              </span>
            </div>
            <p className="text-sm">{comment.text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
```

### Profile Header

Large avatar for profile pages.

```tsx
export function ProfileHeader() {
  return (
    <div className="relative">
      {/* Cover photo */}
      <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg" />

      {/* Profile info */}
      <div className="px-6 pb-6">
        <div className="flex items-end justify-between -mt-12 mb-4">
          <Avatar className="h-24 w-24 border-4 border-white">
            <AvatarImage src="/profile.jpg" alt="John Doe" />
            <AvatarFallback className="text-2xl">JD</AvatarFallback>
          </Avatar>

          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
            Edit Profile
          </button>
        </div>

        <h1 className="text-2xl font-bold">John Doe</h1>
        <p className="text-content-presentation-global-secondary">
          Software Engineer @Company
        </p>
        <p className="mt-2">
          Building great products with React and TypeScript. Open source contributor.
        </p>

        <div className="flex gap-4 mt-4">
          <div>
            <div className="font-bold">1,234</div>
            <div className="text-sm text-content-presentation-global-secondary">Followers</div>
          </div>
          <div>
            <div className="font-bold">567</div>
            <div className="text-sm text-content-presentation-global-secondary">Following</div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Team Members Grid

Grid layout with team member avatars.

```tsx
export function TeamGrid() {
  const team = [
    { name: 'John Doe', role: 'CEO', avatar: '/john.jpg' },
    { name: 'Jane Smith', role: 'CTO', avatar: '/jane.jpg' },
    { name: 'Bob Johnson', role: 'Designer', avatar: '/bob.jpg' },
    { name: 'Alice Brown', role: 'Developer', avatar: '/alice.jpg' },
    { name: 'Charlie Davis', role: 'Marketing', avatar: '/charlie.jpg' },
    { name: 'Eve Wilson', role: 'Sales', avatar: '/eve.jpg' },
  ]

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('')

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Our Team</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {team.map(member => (
          <div key={member.name} className="flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 mb-3">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback className="text-lg">{getInitials(member.name)}</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold">{member.name}</h3>
            <p className="text-sm text-content-presentation-global-secondary">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## API Reference

### Avatar Props

Extends all Radix UI Avatar.Root props.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | `string` | - | Additional CSS classes |
| children | `ReactNode` | - | AvatarImage and AvatarFallback |
| ref | `Ref` | - | Forwarded ref |

### AvatarImage Props

Extends all Radix UI Avatar.Image props.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| src | `string` | - | Image source URL |
| alt | `string` | - | Alt text for image |
| className | `string` | - | Additional CSS classes |
| ref | `Ref` | - | Forwarded ref |

### AvatarFallback Props

Extends all Radix UI Avatar.Fallback props.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | `ReactNode` | - | Fallback content (typically initials) |
| className | `string` | - | Additional CSS classes |
| ref | `Ref` | - | Forwarded ref |

### Size Guide

| Class | Size | Use Case |
|-------|------|----------|
| `h-6 w-6` | 24px | Tiny inline avatars |
| `h-8 w-8` | 32px | Small lists, compact UI |
| `h-10 w-10` | 40px | Default size, most common |
| `h-12 w-12` | 48px | Prominent lists |
| `h-16 w-16` | 64px | Profile cards |
| `h-20 w-20` | 80px | Team pages |
| `h-24 w-24` | 96px | Large profiles |

## Styling

### Default Styles

- **Shape**: Circular (rounded-full)
- **Size**: 40px × 40px default
- **Image**: Object-cover, aspect-square
- **Fallback**: Centered flex, system background

### Custom Styling

```tsx
// Square avatar
<Avatar className="rounded-lg">
  <AvatarImage src="/user.jpg" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

// Custom background
<Avatar>
  <AvatarImage src="/user.jpg" />
  <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-600 text-white">
    JD
  </AvatarFallback>
</Avatar>

// With border
<Avatar className="border-2 border-blue-500">
  <AvatarImage src="/user.jpg" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

## TypeScript Types

```typescript
import type * as AvatarPrimitive from '@radix-ui/react-avatar'

type AvatarProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>

type AvatarImageProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>

type AvatarFallbackProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
```

## Common Patterns

### Generate Initials

```tsx
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

<Avatar>
  <AvatarImage src={user.avatar} />
  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
</Avatar>
```

### Generate Colors

```tsx
function stringToColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = hash % 360
  return `hsl(${hue}, 70%, 50%)`
}

<Avatar>
  <AvatarImage src={user.avatar} />
  <AvatarFallback style={{ backgroundColor: stringToColor(user.name) }}>
    {getInitials(user.name)}
  </AvatarFallback>
</Avatar>
```

### With Loading State

```tsx
function AvatarWithLoading({ src, alt, fallback }) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <Avatar>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse" />
      )}
      <AvatarImage
        src={src}
        alt={alt}
        onLoadingStatusChange={(status) => setIsLoading(status === 'loading')}
      />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  )
}
```

## Testing

```typescript
import { render, screen } from '@testing-library/react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/Avatar'

describe('Avatar', () => {
  it('renders image when src is valid', () => {
    render(
      <Avatar>
        <AvatarImage src="/valid.jpg" alt="Test User" />
        <AvatarFallback>TU</AvatarFallback>
      </Avatar>
    )

    expect(screen.getByAltText('Test User')).toBeInTheDocument()
  })

  it('shows fallback when image fails', async () => {
    render(
      <Avatar>
        <AvatarImage src="/invalid.jpg" alt="Test" />
        <AvatarFallback>TU</AvatarFallback>
      </Avatar>
    )

    // Wait for image to fail and fallback to show
    await waitFor(() => {
      expect(screen.getByText('TU')).toBeInTheDocument()
    })
  })

  it('applies custom className', () => {
    const { container } = render(
      <Avatar className="custom-avatar">
        <AvatarFallback>TU</AvatarFallback>
      </Avatar>
    )

    expect(container.firstChild).toHaveClass('custom-avatar')
  })
})
```

## Accessibility

- **Alt Text**: Always provide meaningful alt text for images
- **Semantic HTML**: Uses appropriate image elements
- **Fallback**: Graceful degradation to initials
- **Screen Reader**: Alt text and fallback are both accessible
- **Focus**: Can be made focusable with button wrapper
- **Contrast**: Fallback text meets WCAG standards

### Accessible Avatar

```tsx
<button className="focus:ring-2 focus:ring-blue-500 rounded-full">
  <Avatar>
    <AvatarImage src="/user.jpg" alt="John Doe's profile picture" />
    <AvatarFallback>JD</AvatarFallback>
  </Avatar>
  <span className="sr-only">View John Doe's profile</span>
</button>
```

## Performance

- **Lazy Loading**: Images load on demand via Radix
- **Fallback Priority**: Shows fallback immediately while loading
- **Image Optimization**: Use Next.js Image for optimized loading
- **Bundle Size**: ~1.5 KB gzipped (with Radix dependency)

### Performance Tips

```tsx
// Use Next.js Image
import Image from 'next/image'

<Avatar>
  <AvatarImage asChild>
    <Image src="/user.jpg" alt="User" width={40} height={40} />
  </AvatarImage>
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

// Memoize avatar lists
const MemoizedAvatar = React.memo(Avatar)
```

## Migration Guide

### From Custom Avatar

```tsx
// Before: Custom avatar
<div className="w-10 h-10 rounded-full overflow-hidden">
  <img src="/user.jpg" alt="User" className="w-full h-full object-cover" />
</div>

// After: Avatar component
<Avatar>
  <AvatarImage src="/user.jpg" alt="User" />
  <AvatarFallback>U</AvatarFallback>
</Avatar>
```

## Best Practices

1. **Always Provide Fallback**: Never skip AvatarFallback
2. **Meaningful Alt Text**: Describe who the avatar represents
3. **Consistent Sizes**: Use same size for same context
4. **Initials**: Use 1-2 characters maximum for fallback
5. **Colors**: Consider unique colors per user
6. **Loading**: Handle loading states gracefully
7. **Status Indicators**: Position consistently (bottom-right)
8. **Accessibility**: Ensure proper labels and focus states