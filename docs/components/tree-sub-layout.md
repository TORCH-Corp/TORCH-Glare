---
title: TreeSubLayout
description: Next.js layout component with hierarchical tree navigation for documentation and multi-level content.
component: true
group: Layout & Containers
keywords: [layout, tree, navigation, hierarchy, docs, sidebar, nextjs]
---

# TreeSubLayout

A specialized layout component for Next.js applications that provides hierarchical tree navigation with automatic active state tracking. Perfect for documentation sites, knowledge bases, and multi-level content structures.

## Installation

```bash
npx torch-cli add tree-sub-layout
```

**Note**: This component requires Next.js 13+ with App Router.

## Imports

```typescript
import TreeSubLayout, { HeaderPage } from '@/layouts/TreeSubLayout'
import type { PathConfig } from '@/layouts/TreeSubLayout'
```

## Basic Usage

```tsx
import TreeSubLayout from '@/layouts/TreeSubLayout'

const treeData = {
  '/docs': {
    pageHeader: 'Documentation',
    subTitle: 'Getting Started',
    TabsTree: [
      {
        id: 'introduction',
        title: 'Introduction',
        subTree: [
          { id: 'overview', title: 'Overview' },
          { id: 'installation', title: 'Installation' },
        ]
      },
      {
        id: 'components',
        title: 'Components',
      }
    ]
  }
}

export default function DocsLayout({ children }) {
  return (
    <TreeSubLayout treeData={treeData}>
      {children}
    </TreeSubLayout>
  )
}
```

## Examples

### Documentation Site

Complete documentation layout with multiple sections.

```tsx
const docsConfig = {
  '/docs': {
    pageHeader: 'Documentation',
    subTitle: 'v2.0',
    TabsTree: [
      {
        id: 'getting-started',
        title: 'Getting Started',
        subTree: [
          { id: 'introduction', title: 'Introduction' },
          { id: 'installation', title: 'Installation' },
          { id: 'quick-start', title: 'Quick Start' },
          { id: 'configuration', title: 'Configuration' },
        ]
      },
      {
        id: 'core-concepts',
        title: 'Core Concepts',
        subTree: [
          { id: 'components', title: 'Components' },
          { id: 'styling', title: 'Styling' },
          { id: 'theming', title: 'Theming' },
          { id: 'accessibility', title: 'Accessibility' },
        ]
      },
      {
        id: 'components-list',
        title: 'Components',
        subTree: [
          { id: 'button', title: 'Button' },
          { id: 'input', title: 'Input' },
          { id: 'select', title: 'Select' },
          { id: 'checkbox', title: 'Checkbox' },
        ]
      },
      {
        id: 'api',
        title: 'API Reference',
        subTree: [
          { id: 'hooks', title: 'Hooks' },
          { id: 'utilities', title: 'Utilities' },
          { id: 'types', title: 'Types' },
        ]
      },
    ]
  }
}

export default function DocsLayout({ children }) {
  return (
    <TreeSubLayout treeData={docsConfig}>
      {children}
    </TreeSubLayout>
  )
}
```

### Knowledge Base

Knowledge base with categorized articles.

```tsx
const kbConfig = {
  '/help': {
    pageHeader: 'Help Center',
    subTitle: 'Find answers to common questions',
    TabsTree: [
      {
        id: 'account',
        title: 'Account & Billing',
        subTree: [
          { id: 'create-account', title: 'Creating an Account' },
          { id: 'reset-password', title: 'Reset Password' },
          { id: 'billing', title: 'Billing Information' },
          { id: 'cancel', title: 'Cancel Subscription' },
        ]
      },
      {
        id: 'features',
        title: 'Features',
        subTree: [
          { id: 'dashboard', title: 'Using the Dashboard' },
          { id: 'reports', title: 'Generate Reports' },
          { id: 'export', title: 'Export Data' },
          { id: 'integrations', title: 'Integrations' },
        ]
      },
      {
        id: 'troubleshooting',
        title: 'Troubleshooting',
        subTree: [
          { id: 'login-issues', title: 'Login Issues' },
          { id: 'slow-performance', title: 'Slow Performance' },
          { id: 'error-messages', title: 'Error Messages' },
        ]
      },
      {
        id: 'contact',
        title: 'Contact Support',
      }
    ]
  }
}
```

### API Documentation

API reference with endpoints organized by category.

```tsx
const apiConfig = {
  '/api-docs': {
    pageHeader: 'API Documentation',
    subTitle: 'REST API v1',
    TabsTree: [
      {
        id: 'authentication',
        title: 'Authentication',
        subTree: [
          { id: 'auth-login', title: 'Login' },
          { id: 'auth-logout', title: 'Logout' },
          { id: 'auth-refresh', title: 'Refresh Token' },
          { id: 'auth-verify', title: 'Verify Token' },
        ]
      },
      {
        id: 'users',
        title: 'Users',
        subTree: [
          { id: 'users-list', title: 'List Users' },
          { id: 'users-get', title: 'Get User' },
          { id: 'users-create', title: 'Create User' },
          { id: 'users-update', title: 'Update User' },
          { id: 'users-delete', title: 'Delete User' },
        ]
      },
      {
        id: 'projects',
        title: 'Projects',
        subTree: [
          { id: 'projects-list', title: 'List Projects' },
          { id: 'projects-get', title: 'Get Project' },
          { id: 'projects-create', title: 'Create Project' },
          { id: 'projects-update', title: 'Update Project' },
          { id: 'projects-delete', title: 'Delete Project' },
        ]
      },
      {
        id: 'webhooks',
        title: 'Webhooks',
        subTree: [
          { id: 'webhooks-list', title: 'List Webhooks' },
          { id: 'webhooks-create', title: 'Create Webhook' },
          { id: 'webhooks-test', title: 'Test Webhook' },
        ]
      },
    ]
  }
}
```

### Product Guide

Product user guide with step-by-step instructions.

```tsx
const guideConfig = {
  '/guide': {
    pageHeader: 'User Guide',
    subTitle: 'Learn how to use our platform',
    TabsTree: [
      {
        id: 'setup',
        title: '1. Setup',
        subTree: [
          { id: 'workspace', title: 'Create Workspace' },
          { id: 'invite-team', title: 'Invite Team Members' },
          { id: 'configure', title: 'Configure Settings' },
        ]
      },
      {
        id: 'projects',
        title: '2. Projects',
        subTree: [
          { id: 'create-project', title: 'Create Your First Project' },
          { id: 'add-tasks', title: 'Add Tasks' },
          { id: 'assign', title: 'Assign Team Members' },
          { id: 'track-progress', title: 'Track Progress' },
        ]
      },
      {
        id: 'collaboration',
        title: '3. Collaboration',
        subTree: [
          { id: 'comments', title: 'Leave Comments' },
          { id: 'share-files', title: 'Share Files' },
          { id: 'notifications', title: 'Manage Notifications' },
        ]
      },
      {
        id: 'advanced',
        title: '4. Advanced Features',
        subTree: [
          { id: 'automation', title: 'Automation' },
          { id: 'custom-fields', title: 'Custom Fields' },
          { id: 'templates', title: 'Templates' },
        ]
      },
    ]
  }
}
```

### Multi-Path Configuration

Handle multiple paths with different navigation.

```tsx
const multiPathConfig = {
  '/docs/components': {
    pageHeader: 'Components',
    subTitle: 'UI Component Library',
    TabsTree: [
      {
        id: 'buttons',
        title: 'Buttons',
        subTree: [
          { id: 'button', title: 'Button' },
          { id: 'action-button', title: 'ActionButton' },
          { id: 'link-button', title: 'LinkButton' },
        ]
      },
      {
        id: 'forms',
        title: 'Forms',
        subTree: [
          { id: 'input', title: 'Input' },
          { id: 'select', title: 'Select' },
          { id: 'checkbox', title: 'Checkbox' },
        ]
      },
    ]
  },
  '/docs/hooks': {
    pageHeader: 'Hooks',
    subTitle: 'React Hooks',
    TabsTree: [
      {
        id: 'state-management',
        title: 'State Management',
        subTree: [
          { id: 'use-state', title: 'useState' },
          { id: 'use-reducer', title: 'useReducer' },
        ]
      },
    ]
  },
  '/docs/utilities': {
    pageHeader: 'Utilities',
    subTitle: 'Helper Functions',
    TabsTree: [
      {
        id: 'styling',
        title: 'Styling',
        subTree: [
          { id: 'cn', title: 'cn()' },
          { id: 'cva', title: 'cva()' },
        ]
      },
    ]
  },
}
```

### With Custom Header

Use HeaderPage component separately.

```tsx
import { HeaderPage } from '@/layouts/TreeSubLayout'

export function CustomHeader() {
  return (
    <HeaderPage
      title="Dashboard"
      subTitle="Analytics Overview"
      type="space-between"
    >
      <div className="flex gap-2">
        <Button size="S">Export</Button>
        <Button size="S" variant="PrimeStyle">
          Share
        </Button>
      </div>
    </HeaderPage>
  )
}
```

### Changelog Layout

Organized changelog with version sections.

```tsx
const changelogConfig = {
  '/changelog': {
    pageHeader: 'Changelog',
    subTitle: 'What\'s New',
    TabsTree: [
      {
        id: 'v2',
        title: 'Version 2.x',
        subTree: [
          { id: 'v2-2-0', title: 'v2.2.0 - Current' },
          { id: 'v2-1-0', title: 'v2.1.0' },
          { id: 'v2-0-0', title: 'v2.0.0' },
        ]
      },
      {
        id: 'v1',
        title: 'Version 1.x',
        subTree: [
          { id: 'v1-9-0', title: 'v1.9.0' },
          { id: 'v1-8-0', title: 'v1.8.0' },
          { id: 'v1-7-0', title: 'v1.7.0' },
        ]
      },
      {
        id: 'archive',
        title: 'Archive',
      }
    ]
  }
}
```

### Settings Pages

Hierarchical settings navigation.

```tsx
const settingsConfig = {
  '/settings': {
    pageHeader: 'Settings',
    subTitle: 'Manage your account',
    TabsTree: [
      {
        id: 'profile',
        title: 'Profile',
        subTree: [
          { id: 'personal-info', title: 'Personal Information' },
          { id: 'avatar', title: 'Avatar & Display' },
          { id: 'language', title: 'Language & Region' },
        ]
      },
      {
        id: 'security',
        title: 'Security',
        subTree: [
          { id: 'password', title: 'Change Password' },
          { id: 'two-factor', title: 'Two-Factor Auth' },
          { id: 'sessions', title: 'Active Sessions' },
          { id: 'api-keys', title: 'API Keys' },
        ]
      },
      {
        id: 'notifications',
        title: 'Notifications',
        subTree: [
          { id: 'email-prefs', title: 'Email Preferences' },
          { id: 'push-prefs', title: 'Push Notifications' },
          { id: 'digest', title: 'Daily Digest' },
        ]
      },
      {
        id: 'billing',
        title: 'Billing',
        subTree: [
          { id: 'subscription', title: 'Subscription' },
          { id: 'payment-methods', title: 'Payment Methods' },
          { id: 'invoices', title: 'Invoices' },
        ]
      },
    ]
  }
}
```

## API Reference

### TreeSubLayout Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | `ReactNode` | - | Page content |
| treeData | `PathConfig` | - | Navigation structure configuration |

### PathConfig Type

```typescript
type PathConfig = {
  [pathname: string]: {
    pageHeader: string
    subTitle?: string
    TabsTree: TreeItem[]
  }
}

interface TreeItem {
  id: string
  title: string
  subTree?: TreeItem[]
}
```

### HeaderPage Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | `string` | - | Page title |
| subTitle | `string` | - | Subtitle text |
| children | `ReactNode` | - | Additional header content |
| type | `'start' \| 'space-between'` | `'start'` | Header layout type |
| className | `string` | - | Additional CSS classes |

## Styling

### Layout Structure

- **Main Container**: Full height with overflow hidden
- **Content Area**: Scrollable with light blue background tint
- **Sidebar Width**: 300px on xl breakpoints
- **Responsive**: Sidebar hidden on mobile, visible on xl+

### Navigation Tree

- **Indentation**: 4px left padding for subtree items
- **Divider**: 1px line between parent and children
- **Active States**: Highlighted active items and parents
- **Vertical Line**: Visual hierarchy indicator for subtrees

### Header Styling

- **Gradient Background**: Blue sparkle gradient on mobile
- **Height**: 52px mobile, 60px desktop
- **Typography**: Display large on mobile, medium on desktop
- **Uppercase**: Desktop titles are uppercase

## TypeScript Types

```typescript
interface TreeItem {
  id: string
  title: string
  subTree?: TreeItem[]
}

type PathConfig = {
  [key: string]: {
    pageHeader: string
    subTitle?: string
    TabsTree: TreeItem[]
  }
}

interface TreeSubLayoutProps {
  children: React.ReactNode
  treeData: PathConfig
}

interface HeaderPageProps {
  title: string
  subTitle?: string
  children?: React.ReactNode
  type?: 'space-between' | 'start'
  className?: string
}
```

## Common Patterns

### Dynamic Tree Generation

```tsx
function generateTreeFromData(data) {
  return data.reduce((acc, category) => ({
    ...acc,
    [`/${category.slug}`]: {
      pageHeader: category.name,
      TabsTree: category.items.map(item => ({
        id: item.id,
        title: item.title,
        subTree: item.children?.map(child => ({
          id: child.id,
          title: child.title
        }))
      }))
    }
  }), {})
}
```

### With Search

```tsx
function SearchableTree({ treeData }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTree = useMemo(() => {
    if (!searchQuery) return treeData

    // Filter tree items based on search
    return filterTreeData(treeData, searchQuery)
  }, [treeData, searchQuery])

  return (
    <TreeSubLayout treeData={filteredTree}>
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search documentation..."
      />
      {/* Content */}
    </TreeSubLayout>
  )
}
```

## Testing

```typescript
import { render, screen } from '@testing-library/react'
import TreeSubLayout from '@/layouts/TreeSubLayout'

// Mock Next.js hooks
jest.mock('next/navigation', () => ({
  usePathname: () => '/docs'
}))

describe('TreeSubLayout', () => {
  const mockTreeData = {
    '/docs': {
      pageHeader: 'Documentation',
      TabsTree: [
        {
          id: 'intro',
          title: 'Introduction',
          subTree: [
            { id: 'overview', title: 'Overview' }
          ]
        }
      ]
    }
  }

  it('renders page header', () => {
    render(
      <TreeSubLayout treeData={mockTreeData}>
        Content
      </TreeSubLayout>
    )

    expect(screen.getByText('Documentation')).toBeInTheDocument()
  })

  it('renders tree navigation', () => {
    render(
      <TreeSubLayout treeData={mockTreeData}>
        Content
      </TreeSubLayout>
    )

    expect(screen.getByText('Introduction')).toBeInTheDocument()
    expect(screen.getByText('Overview')).toBeInTheDocument()
  })

  it('renders children content', () => {
    render(
      <TreeSubLayout treeData={mockTreeData}>
        <div>Page Content</div>
      </TreeSubLayout>
    )

    expect(screen.getByText('Page Content')).toBeInTheDocument()
  })
})
```

## Accessibility

- **Semantic HTML**: Uses nav elements for navigation
- **Hash Navigation**: Anchor links for smooth scrolling
- **Keyboard Navigation**: Full keyboard support via TabFormItem
- **Active State**: Clear visual indication of current location
- **Screen Reader Support**: Proper heading hierarchy
- **Focus Management**: Proper focus indicators

## Performance

- **Active State Hook**: Optimized with useActiveTreeItem hook
- **Scroll Performance**: Hardware-accelerated scrolling
- **Hidden Scrollbars**: Custom scrollbar styling
- **Responsive Loading**: Sidebar only renders on xl breakpoints

## Migration Guide

### From Custom Sidebar

```tsx
// Before: Custom sidebar implementation
<div className="flex">
  <nav>
    {/* Custom navigation */}
  </nav>
  <main>{children}</main>
</div>

// After: TreeSubLayout
<TreeSubLayout treeData={config}>
  {children}
</TreeSubLayout>
```

## Best Practices

1. **Consistent Structure**: Keep tree depth to 2 levels maximum
2. **Clear Titles**: Use descriptive, concise titles
3. **Logical Grouping**: Group related content under parent items
4. **Path Matching**: Ensure pathname keys match actual routes
5. **Mobile UX**: Consider mobile navigation alternatives
6. **Active States**: Let useActiveTreeItem handle active states
7. **Performance**: Avoid deeply nested trees (max 2-3 levels)
8. **Accessibility**: Ensure all links are keyboard accessible