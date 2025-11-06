---
title: ProfileMenu
description: User profile menu component with avatar, name, and optional dropdown content
group: Overlays & Dialogs
keywords: [profile-menu, user-menu, avatar-menu, account-menu, popover]
---

# ProfileMenu

> A specialized popover-based component for user profile menus. Features avatar display, user name, animated purple accent on hover, and optional dropdown content with auto-sizing to match button width.

## Installation

No additional dependencies required (uses internal Popover component).

## Import

```typescript
import { ProfileMenu } from '@torch-ui/components'
```

## Quick Examples

### Basic Usage

```typescript
import { ProfileMenu } from '@torch-ui/components'

function Example() {
  return (
    <ProfileMenu
      label="John Doe"
      icon="/avatar.jpg"
    />
  )
}
```

### With Dropdown Content

```typescript
import { ProfileMenu } from '@torch-ui/components'
import { PopoverItem } from '@torch-ui/components'

function ProfileDropdown() {
  return (
    <ProfileMenu
      label="John Doe"
      icon="/avatar.jpg"
      popoverChildren={
        <>
          <PopoverItem variant="SystemStyle">My Profile</PopoverItem>
          <PopoverItem variant="SystemStyle">Settings</PopoverItem>
          <PopoverItem variant="SystemStyle">Logout</PopoverItem>
        </>
      }
    />
  )
}
```

### Selected State

```typescript
import { ProfileMenu } from '@torch-ui/components'
import { useState } from 'react'

function SelectedProfile() {
  const [selected, setSelected] = useState(true)

  return (
    <ProfileMenu
      label="John Doe"
      icon="/avatar.jpg"
      selected={selected}
    />
  )
}
```

### With Overlay Blur

```typescript
import { ProfileMenu } from '@torch-ui/components'
import { PopoverItem } from '@torch-ui/components'

function BlurredProfileMenu() {
  return (
    <ProfileMenu
      label="Admin User"
      icon="/admin-avatar.jpg"
      overlayBlur={true}
      popoverChildren={
        <>
          <PopoverItem variant="SystemStyle">Admin Dashboard</PopoverItem>
          <PopoverItem variant="SystemStyle">System Settings</PopoverItem>
          <PopoverItem variant="SystemStyle">Sign Out</PopoverItem>
        </>
      }
    />
  )
}
```

### Complete User Menu

```typescript
import { ProfileMenu } from '@torch-ui/components'
import { PopoverItem } from '@torch-ui/components'
import { useRouter } from 'next/navigation'

function UserMenu({ user }: { user: User }) {
  const router = useRouter()

  const handleLogout = () => {
    // Logout logic
    router.push('/login')
  }

  return (
    <ProfileMenu
      label={user.name}
      icon={user.avatar}
      popoverChildren={
        <>
          <PopoverItem
            variant="SystemStyle"
            onClick={() => router.push('/profile')}
          >
            <i className="ri-user-line" />
            <span>My Profile</span>
          </PopoverItem>
          <PopoverItem
            variant="SystemStyle"
            onClick={() => router.push('/settings')}
          >
            <i className="ri-settings-line" />
            <span>Settings</span>
          </PopoverItem>
          <PopoverItem
            variant="SystemStyle"
            onClick={() => router.push('/billing')}
          >
            <i className="ri-bank-card-line" />
            <span>Billing</span>
          </PopoverItem>
          <div className="border-t my-1" />
          <PopoverItem
            variant="Negative"
            onClick={handleLogout}
          >
            <i className="ri-logout-box-line" />
            <span>Sign Out</span>
          </PopoverItem>
        </>
      }
    />
  )
}
```

### With Status Indicator

```typescript
import { ProfileMenu } from '@torch-ui/components'
import { PopoverItem } from '@torch-ui/components'

function OnlineProfileMenu() {
  return (
    <ProfileMenu
      label={
        <div className="flex items-center gap-2">
          <span>John Doe</span>
          <span className="w-2 h-2 bg-green-500 rounded-full" />
        </div>
      }
      icon="/avatar.jpg"
      popoverChildren={
        <>
          <PopoverItem variant="SystemStyle">Set Status</PopoverItem>
          <PopoverItem variant="SystemStyle">Profile</PopoverItem>
          <PopoverItem variant="SystemStyle">Logout</PopoverItem>
        </>
      }
    />
  )
}
```

### With Role Badge

```typescript
import { ProfileMenu } from '@torch-ui/components'
import { PopoverItem, Badge } from '@torch-ui/components'

function AdminProfileMenu({ user }: { user: User }) {
  return (
    <ProfileMenu
      label={
        <div className="flex flex-col items-start">
          <span>{user.name}</span>
          <Badge variant="purple" size="XS" label={user.role} />
        </div>
      }
      icon={user.avatar}
      popoverChildren={
        <>
          <PopoverItem variant="SystemStyle">Dashboard</PopoverItem>
          <PopoverItem variant="SystemStyle">Users</PopoverItem>
          <PopoverItem variant="SystemStyle">Settings</PopoverItem>
        </>
      }
    />
  )
}
```

### Dark Theme

```typescript
import { ProfileMenu } from '@torch-ui/components'
import { PopoverItem } from '@torch-ui/components'

function DarkProfileMenu() {
  return (
    <ProfileMenu
      label="John Doe"
      icon="/avatar.jpg"
      theme="dark"
      popoverChildren={
        <>
          <PopoverItem variant="SystemStyle">Profile</PopoverItem>
          <PopoverItem variant="SystemStyle">Settings</PopoverItem>
        </>
      }
    />
  )
}
```

### Multiple Profile Switcher

```typescript
import { ProfileMenu } from '@torch-ui/components'
import { PopoverItem } from '@torch-ui/components'
import { useState } from 'react'

function ProfileSwitcher() {
  const [currentUser, setCurrentUser] = useState('user1')

  const users = [
    { id: 'user1', name: 'Personal', avatar: '/personal.jpg' },
    { id: 'user2', name: 'Work', avatar: '/work.jpg' },
  ]

  const current = users.find(u => u.id === currentUser)!

  return (
    <ProfileMenu
      label={current.name}
      icon={current.avatar}
      popoverChildren={
        <>
          {users.map((user) => (
            <PopoverItem
              key={user.id}
              variant="SystemStyle"
              active={currentUser === user.id}
              onClick={() => setCurrentUser(user.id)}
            >
              <img
                src={user.avatar}
                className="w-6 h-6 rounded-full"
                alt={user.name}
              />
              <span>{user.name}</span>
            </PopoverItem>
          ))}
          <div className="border-t my-1" />
          <PopoverItem variant="SystemStyle">
            Add Account
          </PopoverItem>
        </>
      }
    />
  )
}
```

### With Custom Actions

```typescript
import { ProfileMenu } from '@torch-ui/components'
import { PopoverItem } from '@torch-ui/components'

function ActionsProfileMenu() {
  return (
    <ProfileMenu
      label="Developer"
      icon="/dev-avatar.jpg"
      popoverChildren={
        <>
          <PopoverItem variant="SystemStyle">
            <i className="ri-code-line" />
            <span>View Source</span>
          </PopoverItem>
          <PopoverItem variant="SystemStyle">
            <i className="ri-terminal-line" />
            <span>Open Terminal</span>
          </PopoverItem>
          <PopoverItem variant="SystemStyle">
            <i className="ri-bug-line" />
            <span>Report Issue</span>
          </PopoverItem>
        </>
      }
    />
  )
}
```

### With Keyboard Shortcuts

```typescript
import { ProfileMenu } from '@torch-ui/components'
import { PopoverItem } from '@torch-ui/components'

function ShortcutProfileMenu() {
  return (
    <ProfileMenu
      label="Pro User"
      icon="/pro-avatar.jpg"
      popoverChildren={
        <>
          <PopoverItem variant="SystemStyle">
            <span>Profile</span>
            <span className="ml-auto text-xs opacity-60">⌘P</span>
          </PopoverItem>
          <PopoverItem variant="SystemStyle">
            <span>Settings</span>
            <span className="ml-auto text-xs opacity-60">⌘,</span>
          </PopoverItem>
          <PopoverItem variant="SystemStyle">
            <span>Help</span>
            <span className="ml-auto text-xs opacity-60">⌘?</span>
          </PopoverItem>
        </>
      }
    />
  )
}
```

## API Reference

### ProfileMenu Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `ReactNode` | Required | User name or label content |
| `icon` | `string` | - | Avatar image URL |
| `selected` | `boolean` | `false` | Selected/active state |
| `theme` | `'dark' \| 'light' \| 'default'` | - | Theme variant |
| `popoverChildren` | `ReactNode` | - | Dropdown menu content |
| `overlayBlur` | `boolean` | `false` | Add blurred backdrop |
| `className` | `string` | - | Additional CSS classes |
| `onClick` | `() => void` | - | Click handler for button |
| `onPointerDown` | `(e: PointerEvent) => void` | - | Pointer down handler |

## TypeScript

### Full Type Definitions

```typescript
import { HTMLAttributes, ReactNode } from 'react'

interface ProfileMenuProps extends HTMLAttributes<HTMLButtonElement> {
  label: ReactNode
  icon?: string
  selected?: boolean
  theme?: 'dark' | 'light' | 'default'
  popoverChildren?: ReactNode
  overlayBlur?: boolean
  className?: string
}

export const ProfileMenu: React.FC<ProfileMenuProps>
```

### Usage with TypeScript

```typescript
import { ProfileMenu } from '@torch-ui/components'

interface User {
  name: string
  avatar: string
  role: string
}

function TypedProfileMenu({ user }: { user: User }) {
  const profileMenuProps: React.ComponentProps<typeof ProfileMenu> = {
    label: user.name,
    icon: user.avatar,
    theme: 'dark',
    popoverChildren: (
      <>
        {/* Menu items */}
      </>
    ),
  }

  return <ProfileMenu {...profileMenuProps} />
}
```

## Features

### Visual Effects

**Purple Accent on Hover**:
- Purple line indicator appears on left
- Arrow icon turns purple
- Smooth transition (150ms)

**Arrow Rotation**:
- Rotates 180° when dropdown opens
- Smooth animation
- Visual feedback for state

**Auto-Sizing**:
- Dropdown width matches button width
- Maintains consistent UI alignment
- Responsive to content

### Interaction States

**Default State**:
- Gray text and icon
- No background
- Subtle hover effect

**Hover State**:
- Purple accent line (left side)
- Purple arrow icon
- Light background highlight

**Selected State**:
- Purple accent visible
- Active background color
- Indicates current selection

**Open State**:
- Arrow rotated 180°
- Dropdown visible below
- z-index elevated

## Common Patterns

### Navigation Bar Profile

```typescript
function NavBarProfile({ user }: { user: User }) {
  return (
    <nav className="flex items-center justify-between p-4">
      <div>Logo</div>
      <div className="flex items-center gap-4">
        <button>Notifications</button>
        <ProfileMenu
          label={user.name}
          icon={user.avatar}
          popoverChildren={
            <>
              <PopoverItem variant="SystemStyle">Profile</PopoverItem>
              <PopoverItem variant="SystemStyle">Logout</PopoverItem>
            </>
          }
        />
      </div>
    </nav>
  )
}
```

### Sidebar Profile

```typescript
function SidebarProfile({ user }: { user: User }) {
  return (
    <div className="sidebar">
      {/* Sidebar content */}
      <div className="mt-auto p-4">
        <ProfileMenu
          label={user.name}
          icon={user.avatar}
          selected
          popoverChildren={
            <>
              <PopoverItem variant="SystemStyle">Switch Account</PopoverItem>
              <PopoverItem variant="SystemStyle">Settings</PopoverItem>
              <PopoverItem variant="SystemStyle">Sign Out</PopoverItem>
            </>
          }
        />
      </div>
    </div>
  )
}
```

## Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { ProfileMenu } from '@torch-ui/components'
import { PopoverItem } from '@torch-ui/components'

describe('ProfileMenu', () => {
  it('renders user name and avatar', () => {
    render(
      <ProfileMenu
        label="Test User"
        icon="/test-avatar.jpg"
      />
    )

    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('src', '/test-avatar.jpg')
  })

  it('opens dropdown on click', () => {
    render(
      <ProfileMenu
        label="Test User"
        icon="/avatar.jpg"
        popoverChildren={
          <PopoverItem>Profile</PopoverItem>
        }
      />
    )

    fireEvent.click(screen.getByText('Test User'))
    expect(screen.getByText('Profile')).toBeInTheDocument()
  })

  it('handles menu item click', () => {
    const handleClick = jest.fn()

    render(
      <ProfileMenu
        label="User"
        icon="/avatar.jpg"
        popoverChildren={
          <PopoverItem onClick={handleClick}>Logout</PopoverItem>
        }
      />
    )

    fireEvent.click(screen.getByText('User'))
    fireEvent.click(screen.getByText('Logout'))
    expect(handleClick).toHaveBeenCalled()
  })
})
```

## Accessibility

- **Keyboard Support**:
  - Enter/Space: Open dropdown
  - Arrow keys: Navigate menu items
  - Escape: Close dropdown
- **ARIA Attributes**: Inherited from Popover component
- **Focus Management**: Keyboard navigation supported
- **Screen Readers**: Announces user name and menu items

### Accessibility Best Practices

```typescript
// Provide alt text for avatar
<ProfileMenu
  label="John Doe"
  icon="/avatar.jpg"
  // Ensure PopoverItems have clear labels
  popoverChildren={
    <PopoverItem aria-label="View profile">
      Profile
    </PopoverItem>
  }
/>
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (minified) | ~2kb |
| Bundle size (gzipped) | ~1kb |
| Dependencies | Internal Popover |
| Hover animation | 150ms |
| Arrow rotation | Smooth CSS transition |
| Tree-shakeable | ✅ |

### Performance Tips

1. **Optimize avatar images**: Use appropriate sizes
   ```typescript
   // Use optimized 28x28px images
   <ProfileMenu icon="/avatar-28x28.jpg" />
   ```

2. **Lazy load dropdown content**: Render only when open
3. **Memoize menu items**: Prevent unnecessary re-renders

## Best Practices

1. **Always provide label and icon**: Both required for proper UI
   ```typescript
   <ProfileMenu label="User Name" icon="/avatar.jpg" />
   ```

2. **Use selected state for active profiles**: Visual feedback
   ```typescript
   <ProfileMenu selected={isActive} />
   ```

3. **Group related menu items**: Use separators
   ```typescript
   <PopoverItem>Profile</PopoverItem>
   <div className="border-t my-1" />
   <PopoverItem>Logout</PopoverItem>
   ```

4. **Place at consistent location**: Typically top-right or sidebar bottom
5. **Use overlay blur for critical actions**: Important confirmations
6. **Provide logout option**: Always include sign out
7. **Consider multi-account switching**: If applicable

## Related Components

- [Popover](./popover.md) - Base popover component
- [PopoverItem](./popover.md#popoveritem) - Menu item component
- [Avatar](./avatar.md) - Avatar display component
- [DropdownMenu](./dropdown-menu.md) - Alternative menu component
