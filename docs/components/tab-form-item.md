---
title: TabFormItem
description: Tab-style navigation component for forms and multi-step workflows with top, side, and tree layouts.
component: true
group: Forms & Inputs
keywords: [tab, form, navigation, step, multi-step, wizard, sidebar, topbar]
---

# TabFormItem

A flexible tab navigation component designed for forms and multi-step workflows. Supports three distinct layouts (top, side, tree) with active states and icon support.

## Installation

```bash
npx torch-cli add tab-form-item
```

## Imports

```typescript
import TabFormItem from '@/components/TabFormItem'
import { formBarItemStyles } from '@/components/TabFormItem'
```

## Basic Usage

```tsx
import TabFormItem from '@/components/TabFormItem'

export function BasicTabFormItem() {
  const [activeTab, setActiveTab] = useState('general')

  return (
    <div className="flex gap-2">
      <TabFormItem
        componentType="top"
        active={activeTab === 'general'}
        onClick={() => setActiveTab('general')}
      >
        General Settings
      </TabFormItem>
      <TabFormItem
        componentType="top"
        active={activeTab === 'advanced'}
        onClick={() => setActiveTab('advanced')}
      >
        Advanced Settings
      </TabFormItem>
      <TabFormItem
        componentType="top"
        active={activeTab === 'security'}
        onClick={() => setActiveTab('security')}
      >
        Security
      </TabFormItem>
    </div>
  )
}
```

## Examples

### Top Navigation Tabs

Top tabs are typically used for primary navigation within forms or settings pages.

```tsx
export function TopNavigationTabs() {
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'ri-user-line' },
    { id: 'notifications', label: 'Notifications', icon: 'ri-notification-line' },
    { id: 'privacy', label: 'Privacy', icon: 'ri-shield-line' },
    { id: 'billing', label: 'Billing', icon: 'ri-bank-card-line' },
  ]

  return (
    <div className="border-b border-border-presentation-tab-topbar-primary">
      <div className="flex gap-1 px-4">
        {tabs.map(tab => (
          <TabFormItem
            key={tab.id}
            componentType="top"
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            <i className={`${tab.icon} mr-2`}></i>
            {tab.label}
          </TabFormItem>
        ))}
      </div>
    </div>
  )
}
```

### Sidebar Navigation

Side tabs are perfect for vertical navigation in settings panels or multi-step forms.

```tsx
export function SidebarNavigation() {
  const [activeSection, setActiveSection] = useState('account')

  const sections = [
    { id: 'account', label: 'Account', description: 'Manage your account settings' },
    { id: 'appearance', label: 'Appearance', description: 'Customize the look and feel' },
    { id: 'integrations', label: 'Integrations', description: 'Connect third-party services' },
    { id: 'api', label: 'API Keys', description: 'Manage API access' },
    { id: 'team', label: 'Team', description: 'Manage team members' },
  ]

  return (
    <div className="flex">
      <div className="w-64 border-r border-border-presentation-tab-sidebar-primary">
        <div className="p-2 space-y-1">
          {sections.map(section => (
            <TabFormItem
              key={section.id}
              componentType="side"
              active={activeSection === section.id}
              onClick={() => setActiveSection(section.id)}
              className="text-left"
            >
              <div className="flex-1">
                <div className="font-medium">{section.label}</div>
                <div className="text-xs text-content-presentation-global-secondary">
                  {section.description}
                </div>
              </div>
            </TabFormItem>
          ))}
        </div>
      </div>
      <div className="flex-1 p-6">
        {/* Content for active section */}
      </div>
    </div>
  )
}
```

### Icon-Only Tabs

Use icon-only tabs for compact navigation or mobile interfaces.

```tsx
export function IconOnlyTabs() {
  const [activeTab, setActiveTab] = useState('home')

  const tabs = [
    { id: 'home', icon: 'ri-home-3-line', tooltip: 'Home' },
    { id: 'search', icon: 'ri-search-line', tooltip: 'Search' },
    { id: 'notifications', icon: 'ri-notification-3-line', tooltip: 'Notifications' },
    { id: 'profile', icon: 'ri-user-3-line', tooltip: 'Profile' },
    { id: 'settings', icon: 'ri-settings-3-line', tooltip: 'Settings' },
  ]

  return (
    <div className="flex gap-2">
      {tabs.map(tab => (
        <TabFormItem
          key={tab.id}
          componentType="top"
          buttonType="icon"
          active={activeTab === tab.id}
          onClick={() => setActiveTab(tab.id)}
          title={tab.tooltip}
          aria-label={tab.tooltip}
        >
          <i className={tab.icon}></i>
        </TabFormItem>
      ))}
    </div>
  )
}
```

### Tree Navigation

Tree tabs are designed for hierarchical navigation structures.

```tsx
export function TreeNavigation() {
  const [expanded, setExpanded] = useState<string[]>(['docs'])
  const [active, setActive] = useState('getting-started')

  const treeItems = [
    {
      id: 'docs',
      label: 'Documentation',
      children: [
        { id: 'getting-started', label: 'Getting Started' },
        { id: 'installation', label: 'Installation' },
        { id: 'configuration', label: 'Configuration' },
      ]
    },
    {
      id: 'api',
      label: 'API Reference',
      children: [
        { id: 'endpoints', label: 'Endpoints' },
        { id: 'authentication', label: 'Authentication' },
        { id: 'rate-limits', label: 'Rate Limits' },
      ]
    },
  ]

  const toggleExpand = (id: string) => {
    setExpanded(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="w-64">
      {treeItems.map(item => (
        <div key={item.id}>
          <TabFormItem
            componentType="tree"
            onClick={() => toggleExpand(item.id)}
            className="font-medium"
          >
            <i className={`ri-arrow-${expanded.includes(item.id) ? 'down' : 'right'}-s-line mr-1`}></i>
            {item.label}
          </TabFormItem>
          {expanded.includes(item.id) && (
            <div className="ml-6">
              {item.children.map(child => (
                <TabFormItem
                  key={child.id}
                  componentType="tree"
                  active={active === child.id}
                  onClick={() => setActive(child.id)}
                >
                  {child.label}
                </TabFormItem>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
```

### Multi-Step Form Wizard

Combine TabFormItem with form steps for a wizard-like experience.

```tsx
export function FormWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const steps = [
    { label: 'Personal Info', icon: 'ri-user-line' },
    { label: 'Address', icon: 'ri-map-pin-line' },
    { label: 'Payment', icon: 'ri-bank-card-line' },
    { label: 'Review', icon: 'ri-check-double-line' },
  ]

  const goToStep = (index: number) => {
    if (index <= currentStep || completedSteps.includes(index - 1)) {
      setCurrentStep(index)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => [...prev, currentStep])
      setCurrentStep(currentStep + 1)
    }
  }

  return (
    <div>
      {/* Step indicators */}
      <div className="flex justify-between mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex-1">
            <TabFormItem
              componentType="top"
              active={currentStep === index}
              onClick={() => goToStep(index)}
              disabled={index > currentStep && !completedSteps.includes(index - 1)}
              className={cn(
                "w-full",
                completedSteps.includes(index) && "text-content-presentation-action-success-primary"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-background-presentation-global-tertiary text-xs">
                  {completedSteps.includes(index) ? (
                    <i className="ri-check-line text-content-presentation-action-success-primary"></i>
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </div>
            </TabFormItem>
            {index < steps.length - 1 && (
              <div className={cn(
                "h-0.5 mt-4",
                completedSteps.includes(index)
                  ? "bg-background-presentation-action-success-primary"
                  : "bg-border-presentation-global-primary"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="p-6 border border-border-presentation-global-primary rounded-lg">
        <h2 className="text-xl font-semibold mb-4">{steps[currentStep].label}</h2>
        {/* Form fields for current step */}
        <button onClick={nextStep} className="mt-4">
          {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  )
}
```

### With React Router

Integrate TabFormItem with React Router for navigation.

```tsx
import { NavLink } from 'react-router-dom'

export function RouterTabs() {
  const routes = [
    { path: '/dashboard', label: 'Dashboard', icon: 'ri-dashboard-line' },
    { path: '/projects', label: 'Projects', icon: 'ri-folder-line' },
    { path: '/tasks', label: 'Tasks', icon: 'ri-task-line' },
    { path: '/calendar', label: 'Calendar', icon: 'ri-calendar-line' },
  ]

  return (
    <nav className="border-b border-border-presentation-tab-topbar-primary">
      <div className="flex gap-1 px-4">
        {routes.map(route => (
          <NavLink key={route.path} to={route.path}>
            {({ isActive }) => (
              <TabFormItem
                componentType="top"
                active={isActive}
                asChild
              >
                <span>
                  <i className={`${route.icon} mr-2`}></i>
                  {route.label}
                </span>
              </TabFormItem>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
```

### Themed Tabs

Apply different themes for various contexts.

```tsx
export function ThemedTabs() {
  const [theme, setTheme] = useState<'default' | 'dark' | 'light'>('default')
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="space-y-4">
      {/* Theme selector */}
      <div className="flex gap-2">
        {(['default', 'dark', 'light'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={cn(
              "px-3 py-1 rounded",
              theme === t && "bg-background-presentation-action-primary-hover text-white"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Themed tabs */}
      <div className={cn(
        "p-4 rounded-lg",
        theme === 'dark' && "bg-gray-900",
        theme === 'light' && "bg-gray-50"
      )}>
        <div className="flex gap-2">
          {['overview', 'analytics', 'reports', 'settings'].map(tab => (
            <TabFormItem
              key={tab}
              componentType="top"
              theme={theme}
              active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </TabFormItem>
          ))}
        </div>
      </div>
    </div>
  )
}
```

## API Reference

### TabFormItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| componentType | `'top' \| 'side' \| 'tree'` | `'side'` | Layout style of the tab |
| active | `boolean` | `false` | Whether the tab is currently active |
| buttonType | `'button' \| 'icon'` | `'button'` | Display mode for the tab |
| theme | `'dark' \| 'light' \| 'default'` | `'default'` | Theme variant |
| asChild | `boolean` | `false` | Merge props with child element |
| as | `React.ElementType` | `'button'` | Custom element type to render |
| className | `string` | - | Additional CSS classes |
| children | `ReactNode` | - | Tab content |
| onClick | `() => void` | - | Click handler |
| disabled | `boolean` | - | Disable tab interaction |

### formBarItemStyles

The `formBarItemStyles` function is exported for custom implementations:

```typescript
const customTabStyles = formBarItemStyles({
  componentType: 'top',
  active: true,
  buttonType: 'button'
})
```

## Styling

### Component Types

#### Top Style
- Height: 28px
- Horizontal padding: 24px
- Rounded corners: 4px
- Hover effect with background color change
- Active state with distinct background and text color

#### Side Style
- Height: 36px
- Full width
- Left-aligned content
- Padding animation on hover (8px → 16px)
- Active state with selected background

#### Tree Style
- Height: 36px
- Full width
- Similar to side style but without sidebar-specific borders
- Designed for hierarchical navigation

### Button Types

#### Button Mode
- Standard padding and text display
- Suitable for text labels

#### Icon Mode
- Square dimensions (28px × 28px)
- No padding
- Centered icon display

## TypeScript Types

```typescript
interface TabFormItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  componentType: 'top' | 'side' | 'tree'
  active?: boolean
  buttonType?: 'icon' | 'button'
  theme?: 'dark' | 'light' | 'default'
  asChild?: boolean
  as?: React.ElementType
}

type FormBarItemStylesProps = {
  componentType?: 'top' | 'side' | 'tree'
  active?: boolean
  buttonType?: 'icon' | 'button'
}
```

## Common Patterns

### Tab Groups

```tsx
function TabGroup({ tabs, value, onChange, componentType = 'top' }) {
  return (
    <div className="flex gap-2">
      {tabs.map(tab => (
        <TabFormItem
          key={tab.value}
          componentType={componentType}
          active={value === tab.value}
          onClick={() => onChange(tab.value)}
          disabled={tab.disabled}
        >
          {tab.icon && <i className={`${tab.icon} mr-2`}></i>}
          {tab.label}
          {tab.badge && (
            <span className="ml-2 px-1.5 py-0.5 text-xs bg-background-presentation-action-primary-hover text-white rounded">
              {tab.badge}
            </span>
          )}
        </TabFormItem>
      ))}
    </div>
  )
}
```

### Scrollable Tabs

```tsx
function ScrollableTabs({ tabs, value, onChange }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide"
      >
        {tabs.map(tab => (
          <TabFormItem
            key={tab.id}
            componentType="top"
            active={value === tab.id}
            onClick={() => onChange(tab.id)}
            className="flex-shrink-0"
          >
            {tab.label}
          </TabFormItem>
        ))}
      </div>

      {/* Scroll indicators */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
    </div>
  )
}
```

## Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import TabFormItem from '@/components/TabFormItem'

describe('TabFormItem', () => {
  it('renders with correct component type', () => {
    render(
      <TabFormItem componentType="top">
        Test Tab
      </TabFormItem>
    )
    const tab = screen.getByText('Test Tab')
    expect(tab).toHaveClass('h-[28px]', 'px-[24px]')
  })

  it('applies active state correctly', () => {
    render(
      <TabFormItem componentType="side" active>
        Active Tab
      </TabFormItem>
    )
    const tab = screen.getByText('Active Tab')
    expect(tab).toHaveClass('bg-background-presentation-tab-sidebar-selected')
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(
      <TabFormItem componentType="top" onClick={handleClick}>
        Clickable Tab
      </TabFormItem>
    )

    fireEvent.click(screen.getByText('Clickable Tab'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders as icon button', () => {
    render(
      <TabFormItem componentType="top" buttonType="icon">
        <i className="ri-home-line"></i>
      </TabFormItem>
    )
    const tab = screen.getByRole('button')
    expect(tab).toHaveClass('h-[28px]', 'w-[28px]')
  })

  it('supports polymorphic rendering', () => {
    render(
      <TabFormItem componentType="top" as="a" href="/test">
        Link Tab
      </TabFormItem>
    )
    const link = screen.getByText('Link Tab')
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/test')
  })
})
```

## Accessibility

- **Semantic HTML**: Uses button element by default for proper keyboard interaction
- **Keyboard Navigation**: Full keyboard support with Tab and Enter/Space keys
- **ARIA Attributes**: Supports aria-label, aria-selected, and other ARIA properties
- **Focus Management**: Clear focus indicators and proper focus order
- **Screen Reader Support**: Announces active state and tab purpose
- **Disabled State**: Properly communicates disabled state to assistive technologies

### ARIA Example

```tsx
<div role="tablist" aria-orientation="horizontal">
  {tabs.map((tab, index) => (
    <TabFormItem
      key={tab.id}
      componentType="top"
      role="tab"
      aria-selected={activeTab === tab.id}
      aria-controls={`tabpanel-${tab.id}`}
      tabIndex={activeTab === tab.id ? 0 : -1}
      active={activeTab === tab.id}
      onClick={() => setActiveTab(tab.id)}
    >
      {tab.label}
    </TabFormItem>
  ))}
</div>
```

## Performance

- **Optimized Animations**: CSS transitions for smooth hover and active states
- **Minimal Re-renders**: Use React.memo for large tab lists
- **Event Delegation**: Efficient event handling for multiple tabs
- **Class Generation**: CVA for optimized className generation

### Performance Tips

1. **Memoize Tab Lists**:
```tsx
const MemoizedTabFormItem = React.memo(TabFormItem)

const tabs = useMemo(() =>
  data.map(item => ({
    id: item.id,
    label: item.label,
    icon: item.icon
  })),
  [data]
)
```

2. **Virtualize Long Lists**:
```tsx
import { Virtuoso } from 'react-virtuoso'

function VirtualizedSidebar({ items, activeId, onSelect }) {
  return (
    <Virtuoso
      data={items}
      itemContent={(index, item) => (
        <TabFormItem
          componentType="side"
          active={activeId === item.id}
          onClick={() => onSelect(item.id)}
        >
          {item.label}
        </TabFormItem>
      )}
    />
  )
}
```

## Migration Guide

### From Custom Tab Components

```tsx
// Before: Custom tab implementation
<button
  className={`px-4 py-2 ${active ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
  onClick={onClick}
>
  {label}
</button>

// After: Using TabFormItem
<TabFormItem
  componentType="top"
  active={active}
  onClick={onClick}
>
  {label}
</TabFormItem>
```

### From Other Tab Libraries

```tsx
// Before: Material-UI Tabs
<Tabs value={value} onChange={handleChange}>
  <Tab label="Item One" />
  <Tab label="Item Two" />
</Tabs>

// After: TabFormItem
<div className="flex gap-2">
  <TabFormItem
    componentType="top"
    active={value === 0}
    onClick={() => handleChange(0)}
  >
    Item One
  </TabFormItem>
  <TabFormItem
    componentType="top"
    active={value === 1}
    onClick={() => handleChange(1)}
  >
    Item Two
  </TabFormItem>
</div>
```

## Best Practices

1. **Use Appropriate Component Type**: Choose the right type (top/side/tree) based on your navigation hierarchy
2. **Maintain Active State**: Always track and display the active tab for user orientation
3. **Provide Visual Feedback**: Use hover and focus states to indicate interactivity
4. **Consider Mobile**: Use icon-only mode or horizontal scrolling for mobile layouts
5. **Group Related Tabs**: Organize tabs into logical groups for better user experience
6. **Limit Tab Count**: Consider using dropdown menus or pagination for many tabs
7. **Accessible Labels**: Always provide descriptive labels or aria-labels for icon-only tabs