---
title: CNLayout
description: Comprehensive dashboard layout system with sidebar navigation, header, and content areas.
component: true
group: Layout & Containers
keywords: [layout, dashboard, sidebar, navigation, admin, panel]
---

# CNLayout

A complete layout system for building dashboard and admin panel interfaces. Features a flexible sidebar with icon buttons, navigation items, and footer, plus a styled content body with gradient effects.

## Installation

```bash
npx torch-cli add cn-layout
```

## Imports

```typescript
import {
  Layout,
  Body,
  SideBar,
  SideBarItem,
  SideBarIconButton,
  SideBarFooterItem,
  SideBarChildContainer
} from '@/layouts/CNLayout'
```

## Basic Usage

```tsx
import { Layout, Body, SideBar, SideBarItem } from '@/layouts/CNLayout'

export function BasicLayout() {
  return (
    <Layout>
      <SideBar
        headerChild={<Logo />}
        icon Buttons={
          <>
            <SideBarIconButton>
              <i className="ri-home-line"></i>
            </SideBarIconButton>
          </>
        }
        navigationChildren={[
          <SideBarItem>Dashboard</SideBarItem>,
          <SideBarItem>Settings</SideBarItem>,
        ]}
      />

      <Body>
        {/* Your page content */}
      </Body>
    </Layout>
  )
}
```

## Examples

### Complete Dashboard Layout

Full-featured dashboard with navigation and content.

```tsx
export function DashboardLayout() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [activeSection, setActiveSection] = useState('overview')

  return (
    <Layout>
      <SideBar
        headerChild={
          <div className="text-xl font-bold">
            MyApp
          </div>
        }
        iconButtons={
          <>
            <SideBarIconButton
              active={activeTab === 'dashboard'}
              onClick={() => setActiveTab('dashboard')}
              message="Dashboard"
            >
              <i className="ri-dashboard-3-line"></i>
            </SideBarIconButton>

            <SideBarIconButton
              active={activeTab === 'projects'}
              onClick={() => setActiveTab('projects')}
              message="Projects"
              count={5}
            >
              <i className="ri-folder-line"></i>
            </SideBarIconButton>

            <SideBarIconButton
              active={activeTab === 'tasks'}
              onClick={() => setActiveTab('tasks')}
              message="Tasks"
              count={12}
            >
              <i className="ri-task-line"></i>
            </SideBarIconButton>

            <SideBarIconButton
              active={activeTab === 'messages'}
              onClick={() => setActiveTab('messages')}
              message="Messages"
              count={3}
            >
              <i className="ri-message-3-line"></i>
            </SideBarIconButton>
          </>
        }
        navigationChildren={[
          <SideBarItem
            active={activeSection === 'overview'}
            onClick={() => setActiveSection('overview')}
          >
            <i className="ri-pie-chart-line mr-2"></i>
            Overview
          </SideBarItem>,

          <SideBarItem
            active={activeSection === 'analytics'}
            onClick={() => setActiveSection('analytics')}
          >
            <i className="ri-line-chart-line mr-2"></i>
            Analytics
          </SideBarItem>,

          <SideBarItem
            active={activeSection === 'reports'}
            onClick={() => setActiveSection('reports')}
          >
            <i className="ri-file-chart-line mr-2"></i>
            Reports
          </SideBarItem>,

          <SideBarItem
            active={activeSection === 'team'}
            onClick={() => setActiveSection('team')}
          >
            <i className="ri-team-line mr-2"></i>
            Team
          </SideBarItem>,
        ]}
        footerChildren={
          <>
            <SideBarFooterItem>
              <i className="ri-settings-3-line mr-2"></i>
              Settings
            </SideBarFooterItem>

            <SideBarFooterItem>
              <i className="ri-question-line mr-2"></i>
              Help
            </SideBarFooterItem>
          </>
        }
      />

      <Body>
        <div className="p-6">
          {/* Dashboard content */}
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          {/* Content based on active section */}
        </div>
      </Body>
    </Layout>
  )
}
```

### Admin Panel with Multi-Level Navigation

Admin interface with grouped navigation sections.

```tsx
export function AdminPanel() {
  const [activeModule, setActiveModule] = useState('users')

  const navigationSections = [
    {
      title: 'User Management',
      items: [
        { id: 'users', label: 'Users', icon: 'ri-user-line' },
        { id: 'roles', label: 'Roles', icon: 'ri-shield-user-line' },
        { id: 'permissions', label: 'Permissions', icon: 'ri-lock-line' },
      ]
    },
    {
      title: 'Content',
      items: [
        { id: 'posts', label: 'Posts', icon: 'ri-article-line' },
        { id: 'media', label: 'Media', icon: 'ri-image-line' },
        { id: 'categories', label: 'Categories', icon: 'ri-folder-line' },
      ]
    },
    {
      title: 'System',
      items: [
        { id: 'settings', label: 'Settings', icon: 'ri-settings-3-line' },
        { id: 'logs', label: 'Logs', icon: 'ri-file-list-line' },
        { id: 'backups', label: 'Backups', icon: 'ri-save-line' },
      ]
    },
  ]

  return (
    <Layout>
      <SideBar
        headerChild={
          <div className="flex items-center gap-2">
            <i className="ri-admin-line text-2xl"></i>
            <span className="font-bold">Admin</span>
          </div>
        }
        iconButtons={<></>}
        navigationChildren={navigationSections.flatMap(section => [
          <SideBarChildContainer key={section.title}>
            <div className="text-xs uppercase text-content-system-global-secondary px-2 mb-1">
              {section.title}
            </div>
          </SideBarChildContainer>,
          ...section.items.map(item => (
            <SideBarItem
              key={item.id}
              active={activeModule === item.id}
              onClick={() => setActiveModule(item.id)}
            >
              <i className={`${item.icon} mr-2`}></i>
              {item.label}
            </SideBarItem>
          ))
        ])}
        footerChildren={
          <SideBarFooterItem>
            <i className="ri-logout-box-line mr-2"></i>
            Sign Out
          </SideBarFooterItem>
        }
      />

      <Body>
        {/* Admin panel content */}
      </Body>
    </Layout>
  )
}
```

### Custom Sidebar Content

Using children prop for completely custom sidebar layout.

```tsx
export function CustomSidebarLayout() {
  return (
    <Layout>
      <SideBar>
        <div className="w-full h-full flex flex-col">
          {/* Custom header */}
          <div className="h-[56px] bg-background-system-body-base flex items-center justify-center border-b">
            <img src="/logo.svg" alt="Logo" className="h-8" />
          </div>

          {/* Custom navigation */}
          <div className="flex-1 p-4 bg-background-system-body-base">
            <nav className="space-y-2">
              {/* Custom navigation structure */}
              <div className="font-semibold mb-2">Main Menu</div>
              <button className="w-full text-left p-2 rounded hover:bg-gray-100">
                Dashboard
              </button>
              <button className="w-full text-left p-2 rounded hover:bg-gray-100">
                Projects
              </button>
            </nav>
          </div>

          {/* Custom footer */}
          <div className="p-4 bg-background-system-body-base border-t">
            <div className="flex items-center gap-2">
              <img src="/avatar.jpg" className="w-8 h-8 rounded-full" />
              <div className="text-sm">
                <div className="font-medium">John Doe</div>
                <div className="text-gray-500">john@example.com</div>
              </div>
            </div>
          </div>
        </div>
      </SideBar>

      <Body>
        {/* Content */}
      </Body>
    </Layout>
  )
}
```

### Icon-Only Sidebar

Compact sidebar showing only icons.

```tsx
export function CompactSidebar() {
  const [activeIcon, setActiveIcon] = useState('home')

  const icons = [
    { id: 'home', icon: 'ri-home-3-line', tooltip: 'Home' },
    { id: 'search', icon: 'ri-search-line', tooltip: 'Search' },
    { id: 'notifications', icon: 'ri-notification-3-line', tooltip: 'Notifications', count: 5 },
    { id: 'messages', icon: 'ri-message-3-line', tooltip: 'Messages', count: 2 },
    { id: 'settings', icon: 'ri-settings-3-line', tooltip: 'Settings' },
  ]

  return (
    <Layout>
      <SideBar
        className="!w-[58px]"
        iconButtons={
          <>
            {icons.map(item => (
              <SideBarIconButton
                key={item.id}
                active={activeIcon === item.id}
                onClick={() => setActiveIcon(item.id)}
                message={item.tooltip}
                count={item.count}
              >
                <i className={item.icon}></i>
              </SideBarIconButton>
            ))}
          </>
        }
        navigationChildren={[
          <SideBarItem iconOnly>
            <i className="ri-user-line"></i>
          </SideBarItem>,
          <SideBarItem iconOnly>
            <i className="ri-folder-line"></i>
          </SideBarItem>,
        ]}
      />

      <Body>
        {/* Content */}
      </Body>
    </Layout>
  )
}
```

### Multi-Tab Application

Application with tab switching and persistent sidebar.

```tsx
export function MultiTabApp() {
  const [activeWorkspace, setActiveWorkspace] = useState('work')
  const [activeView, setActiveView] = useState('list')

  const workspaces = [
    { id: 'work', icon: 'ri-briefcase-line', label: 'Work', count: 12 },
    { id: 'personal', icon: 'ri-user-line', label: 'Personal', count: 5 },
    { id: 'shared', icon: 'ri-group-line', label: 'Shared', count: 3 },
  ]

  return (
    <Layout>
      <SideBar
        headerChild={
          <select
            value={activeWorkspace}
            onChange={(e) => setActiveWorkspace(e.target.value)}
            className="w-full px-2 py-1 rounded border"
          >
            {workspaces.map(ws => (
              <option key={ws.id} value={ws.id}>
                {ws.label} ({ws.count})
              </option>
            ))}
          </select>
        }
        iconButtons={
          <>
            <SideBarIconButton
              active={activeView === 'list'}
              onClick={() => setActiveView('list')}
              message="List View"
            >
              <i className="ri-list-check"></i>
            </SideBarIconButton>

            <SideBarIconButton
              active={activeView === 'board'}
              onClick={() => setActiveView('board')}
              message="Board View"
            >
              <i className="ri-layout-grid-line"></i>
            </SideBarIconButton>

            <SideBarIconButton
              active={activeView === 'calendar'}
              onClick={() => setActiveView('calendar')}
              message="Calendar View"
            >
              <i className="ri-calendar-line"></i>
            </SideBarIconButton>
          </>
        }
        navigationChildren={[
          <SideBarItem>All Tasks</SideBarItem>,
          <SideBarItem>In Progress</SideBarItem>,
          <SideBarItem>Completed</SideBarItem>,
        ]}
        footerChildren={
          <SideBarFooterItem>
            <i className="ri-add-line mr-2"></i>
            New Task
          </SideBarFooterItem>
        }
      />

      <Body>
        {/* Render view based on activeView */}
      </Body>
    </Layout>
  )
}
```

### Sidebar with Variants

Using variant prop for different color schemes.

```tsx
export function VariantSidebar() {
  return (
    <Layout>
      <SideBar
        iconButtons={
          <>
            <SideBarIconButton variant="secondary">
              <i className="ri-home-line"></i>
            </SideBarIconButton>
          </>
        }
        navigationChildren={[
          <SideBarItem variant="secondary">
            Dashboard
          </SideBarItem>,
          <SideBarItem variant="secondary" active>
            Analytics
          </SideBarItem>,
        ]}
        footerChildren={
          <SideBarFooterItem variant="secondary">
            Settings
          </SideBarFooterItem>
        }
      />

      <Body>
        {/* Content */}
      </Body>
    </Layout>
  )
}
```

### Disabled Items

Showing disabled navigation items.

```tsx
export function DisabledItems() {
  return (
    <Layout>
      <SideBar
        iconButtons={<></>}
        navigationChildren={[
          <SideBarItem>Available Feature</SideBarItem>,
          <SideBarItem disabled>
            <i className="ri-lock-line mr-2"></i>
            Premium Feature
          </SideBarItem>,
          <SideBarItem disabled>
            <i className="ri-lock-line mr-2"></i>
            Coming Soon
          </SideBarItem>,
        ]}
      />

      <Body>
        {/* Content */}
      </Body>
    </Layout>
  )
}
```

### With Router Integration

Using CNLayout with React Router.

```tsx
import { NavLink } from 'react-router-dom'

export function RouterLayout() {
  return (
    <Layout>
      <SideBar
        headerChild={<Logo />}
        iconButtons={<></>}
        navigationChildren={[
          <NavLink to="/" style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <SideBarItem active={isActive}>
                <i className="ri-home-line mr-2"></i>
                Home
              </SideBarItem>
            )}
          </NavLink>,

          <NavLink to="/dashboard" style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <SideBarItem active={isActive}>
                <i className="ri-dashboard-line mr-2"></i>
                Dashboard
              </SideBarItem>
            )}
          </NavLink>,

          <NavLink to="/settings" style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <SideBarItem active={isActive}>
                <i className="ri-settings-line mr-2"></i>
                Settings
              </SideBarItem>
            )}
          </NavLink>,
        ]}
      />

      <Body>
        <Outlet /> {/* React Router outlet */}
      </Body>
    </Layout>
  )
}
```

## API Reference

### Layout Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | `ReactNode` | - | Sidebar and Body components |
| className | `string` | - | Additional CSS classes |

### Body Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | `ReactNode` | - | Page content |
| className | `string` | - | Additional CSS classes |

### SideBar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| headerChild | `ReactNode` | - | Header content (logo, title) |
| iconButtons | `ReactNode` | - | Icon buttons column |
| navigationChildren | `ReactNode \| ReactNode[]` | - | Navigation items |
| footerChildren | `ReactNode` | - | Footer content |
| children | `ReactNode` | - | Custom sidebar content (overrides other props) |
| className | `string` | - | Additional CSS classes |

### SideBarItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| active | `boolean` | `false` | Active/selected state |
| disabled | `boolean` | `false` | Disabled state |
| iconOnly | `boolean` | `false` | Icon-only display mode |
| variant | `'default' \| 'secondary'` | `'default'` | Visual variant |
| theme | `Themes` | - | Theme override |
| asChild | `boolean` | `false` | Merge props with child |
| as | `React.ElementType` | `'span'` | Element type |
| className | `string` | - | Additional CSS classes |
| children | `ReactNode` | - | Item content |
| onClick | `() => void` | - | Click handler |

### SideBarIconButton Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| active | `boolean` | `false` | Active state |
| count | `number` | - | Badge count |
| message | `ReactNode` | - | Tooltip message |
| disabled | `boolean` | `false` | Disabled state |
| variant | `'default' \| 'secondary'` | `'default'` | Visual variant |
| theme | `Themes` | - | Theme override |
| asChild | `boolean` | `false` | Merge props with child |
| as | `React.ElementType` | `'button'` | Element type |
| className | `string` | - | Additional CSS classes |
| children | `ReactNode` | - | Icon content |
| onClick | `() => void` | - | Click handler |

### SideBarFooterItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `'primary' \| 'secondary'` | `'primary'` | Visual variant |
| theme | `Themes` | - | Theme override |
| asChild | `boolean` | `false` | Merge props with child |
| as | `React.ElementType` | `'button'` | Element type |
| className | `string` | - | Additional CSS classes |
| children | `ReactNode` | - | Footer item content |
| onClick | `() => void` | - | Click handler |

### SideBarChildContainer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| theme | `Themes` | - | Theme override |
| className | `string` | - | Additional CSS classes |
| children | `ReactNode` | - | Container content |

## Styling

### Layout Structure

- **Full Height**: 100dvh viewport height
- **Responsive Gap**: 10px gap on large screens
- **Base Background**: System body base color
- **Padding**: 16px on large screens

### Body Styling

- **Gradient Border**: Blue sparkle gradient effect
- **Shadow**: Pronounced shadow for depth
- **Rounded Corners**: 12px border radius
- **Top Accent**: Decorative gradient at top-left
- **Scrollable**: Hidden scrollbar with overflow

### Sidebar Dimensions

- **Default Width**: 265px
- **Header Height**: 56px
- **Icon Column**: 46px width
- **Hidden on Mobile**: Only visible on lg breakpoint

### Navigation Item Animations

- **Padding Transition**: Animates from 8px to 14px on hover
- **Border**: 2px left border (or right in RTL)
- **Duration**: 150ms ease-in-out

## TypeScript Types

```typescript
interface LayoutProps extends HTMLAttributes<HTMLDivElement> {}

interface ContentProps extends HTMLAttributes<HTMLDivElement> {}

interface SideBarProps extends HTMLAttributes<HTMLDivElement> {
  iconButtons?: ReactNode
  headerChild?: ReactNode
  navigationChildren?: ReactNode | ReactNode[]
  footerChildren?: ReactNode
  children?: ReactNode
}

interface SideBarItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  as?: React.ElementType
  theme?: Themes
  variant?: 'default' | 'secondary'
  iconOnly?: boolean
  active?: boolean
  disabled?: boolean
}

interface SideBarIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  as?: React.ElementType
  theme?: Themes
  variant?: 'default' | 'secondary'
  active?: boolean
  count?: number
  message?: ReactNode
  disabled?: boolean
}

interface SideBarFooterItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  theme?: Themes
  as?: React.ElementType
  asChild?: boolean
  variant?: 'primary' | 'secondary'
}

interface SideBarChildContainerProps extends HTMLAttributes<HTMLDivElement> {
  theme?: Themes
}
```

## Common Patterns

### Collapsible Sidebar

```tsx
function CollapsibleLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Layout>
      <SideBar className={cn(collapsed && "!w-[58px]")}>
        {/* Collapsed sidebar content */}
      </SideBar>

      <Body>
        <button onClick={() => setCollapsed(!collapsed)}>
          <i className={`ri-arrow-${collapsed ? 'right' : 'left'}-s-line`}></i>
        </button>
        {/* Content */}
      </Body>
    </Layout>
  )
}
```

### Dynamic Navigation

```tsx
function DynamicNavigation({ items, activeId, onSelect }) {
  return (
    <SideBar
      navigationChildren={items.map(item => (
        <SideBarItem
          key={item.id}
          active={activeId === item.id}
          onClick={() => onSelect(item.id)}
          disabled={item.disabled}
        >
          {item.icon && <i className={`${item.icon} mr-2`}></i>}
          {item.label}
          {item.badge && (
            <span className="ml-auto">{item.badge}</span>
          )}
        </SideBarItem>
      ))}
    />
  )
}
```

## Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Layout, Body, SideBar, SideBarItem } from '@/layouts/CNLayout'

describe('CNLayout', () => {
  it('renders layout structure', () => {
    render(
      <Layout>
        <SideBar navigationChildren={[]} />
        <Body>Content</Body>
      </Layout>
    )

    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('handles navigation clicks', () => {
    const handleClick = jest.fn()

    render(
      <SideBar
        navigationChildren={[
          <SideBarItem onClick={handleClick}>
            Dashboard
          </SideBarItem>
        ]}
      />
    )

    fireEvent.click(screen.getByText('Dashboard'))
    expect(handleClick).toHaveBeenCalled()
  })

  it('shows active state', () => {
    render(
      <SideBarItem active>Active Item</SideBarItem>
    )

    const item = screen.getByText('Active Item')
    expect(item).toHaveClass('bg-background-system-action-primary-hover')
  })

  it('displays badge count', () => {
    render(
      <SideBarIconButton count={5}>
        <i className="ri-notification-line"></i>
      </SideBarIconButton>
    )

    expect(screen.getByText('5')).toBeInTheDocument()
  })
})
```

## Accessibility

- **Semantic HTML**: Uses aside, main, nav elements
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Proper focus indicators
- **Screen Reader Support**: Meaningful labels and structure
- **ARIA Attributes**: Supports all standard ARIA props
- **Tooltips**: Icon buttons include tooltips via message prop

## Performance

- **CSS Grid**: Efficient layout with CSS Grid
- **Hardware Acceleration**: GPU-accelerated transitions
- **Minimal Re-renders**: Optimized component structure
- **Hidden Scrollbars**: Custom scrollbar styling

## Best Practices

1. **Consistent Navigation**: Keep navigation structure predictable
2. **Active States**: Always indicate the current location
3. **Icon Consistency**: Use consistent icon sizes and styles
4. **Mobile Responsive**: Consider mobile layout alternatives
5. **Loading States**: Show loading indicators for async navigation
6. **Error Boundaries**: Wrap layout in error boundaries
7. **Badge Counts**: Use badges sparingly for important notifications