---
title: Component Composition
description: Learn how to compose TORCH Glare components to build complex, production-ready user interfaces.
category: Tutorial
difficulty: Advanced
duration: 40 minutes
tags: [composition, patterns, architecture, complex-ui, best-practices]
related:
  - Getting Started
  - Building Your First Form
  - Theming Basics
---

# Component Composition

Master the art of composing TORCH Glare components to build sophisticated, maintainable user interfaces.

## What You'll Learn

- Component composition patterns
- Building complex layouts
- Creating reusable composite components
- Managing component state across compositions
- Best practices for scalable architecture

## Prerequisites

- Completed previous tutorials
- Understanding of React composition patterns
- Experience with component props and state

---

## Understanding Composition

Composition is combining simple components to create more complex ones. Think of it as building with LEGO blocks.

### Basic Composition Pattern

```tsx
// Simple components
<Button />
<Input />
<Badge />

// Composed into a complex component
<SearchBar>
  <Input />
  <Button />
  <Badge />
</SearchBar>
```

---

## Pattern 1: Form Composition

### Basic Contact Form

```tsx
'use client';

import {
  LabelField,
  TextArea,
  Button,
  FieldHint,
  toast,
} from '@torch-ai/torch-glare';
import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <LabelField
        theme="light"
        label="Name"
        requiredLabel="*"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />

      <LabelField
        theme="light"
        label="Email"
        requiredLabel="*"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
      />

      <LabelField
        theme="light"
        label="Subject"
        value={formData.subject}
        onChange={(e) => setFormData({...formData, subject: e.target.value})}
      />

      <div>
        <label className="typography-body-medium-semibold text-content-presentation-global-primary block mb-2">
          Message *
        </label>
        <TextArea
          theme="light"
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          placeholder="Your message..."
          rows={5}
        />
      </div>

      <Button theme="light" variant="PrimeStyle" type="submit" className="w-full">
        Send Message
      </Button>
    </form>
  );
}
```

---

## Pattern 2: Card with Actions

### Feature Card Component

```tsx
import { Button, Badge } from '@torch-ai/torch-glare';

interface FeatureCardProps {
  title: string;
  description: string;
  badge?: string;
  onLearnMore?: () => void;
  onGetStarted?: () => void;
}

export default function FeatureCard({
  title,
  description,
  badge,
  onLearnMore,
  onGetStarted,
}: FeatureCardProps) {
  return (
    <div className="
      bg-background-presentation-form-base
      border border-border-presentation-global-primary
      rounded-lg p-6
      hover:border-border-presentation-action-hover
      transition-all duration-200
    ">
      {/* Header with Badge */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="typography-headers-large-bold text-content-presentation-global-primary">
          {title}
        </h3>
        {badge && (
          <Badge theme="light" variant="SecondStyle">
            {badge}
          </Badge>
        )}
      </div>

      {/* Description */}
      <p className="typography-body-medium-regular text-content-presentation-global-secondary mb-6">
        {description}
      </p>

      {/* Actions */}
      <div className="flex gap-2">
        {onLearnMore && (
          <Button
            theme="light"
            variant="BorderStyle"
            size="S"
            onClick={onLearnMore}
          >
            Learn More
          </Button>
        )}
        {onGetStarted && (
          <Button
            theme="light"
            variant="PrimeStyle"
            size="S"
            onClick={onGetStarted}
          >
            Get Started
          </Button>
        )}
      </div>
    </div>
  );
}
```

### Usage

```tsx
<FeatureCard
  title="Advanced Analytics"
  description="Get insights into your data with real-time analytics and reporting."
  badge="Pro"
  onLearnMore={() => console.log('Learn more')}
  onGetStarted={() => console.log('Get started')}
/>
```

---

## Pattern 3: List with Actions

### User List Component

```tsx
'use client';

import {
  Avatar,
  Button,
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@torch-ai/torch-glare';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive';
}

interface UserListProps {
  users: User[];
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

export default function UserList({ users, onEdit, onDelete }: UserListProps) {
  const getRoleBadgeVariant = (role: User['role']) => {
    const variants = {
      admin: 'PrimeStyle',
      user: 'SecondStyle',
      guest: 'ContStyle',
    };
    return variants[role];
  };

  return (
    <div className="
      bg-background-presentation-form-base
      border border-border-presentation-global-primary
      rounded-lg overflow-hidden
    ">
      {/* Header */}
      <div className="bg-background-presentation-form-header p-4 border-b border-border-presentation-global-primary">
        <h3 className="typography-headers-medium-bold text-content-presentation-global-primary">
          Team Members
        </h3>
      </div>

      {/* User List */}
      <div className="divide-y divide-border-presentation-global-primary">
        {users.map((user) => (
          <div
            key={user.id}
            className="
              p-4 flex items-center justify-between
              hover:bg-background-presentation-table-row-hover
              transition-colors
            "
          >
            {/* User Info */}
            <div className="flex items-center gap-3">
              <Avatar
                theme="light"
                src={user.avatar}
                alt={user.name}
                size="M"
              />
              <div>
                <p className="typography-body-medium-semibold text-content-presentation-global-primary">
                  {user.name}
                </p>
                <p className="typography-body-small-regular text-content-presentation-global-secondary">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Badges and Actions */}
            <div className="flex items-center gap-2">
              <Badge
                theme="light"
                variant={getRoleBadgeVariant(user.role) as any}
              >
                {user.role}
              </Badge>

              {user.status === 'active' ? (
                <span className="
                  px-2 py-1 rounded
                  bg-background-presentation-badge-green
                  text-content-presentation-badge-green
                  typography-labels-small-semibold
                ">
                  Active
                </span>
              ) : (
                <span className="
                  px-2 py-1 rounded
                  bg-background-presentation-badge-gray
                  text-content-presentation-badge-gray
                  typography-labels-small-semibold
                ">
                  Inactive
                </span>
              )}

              {/* Actions Menu */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    theme="light"
                    variant="ContStyle"
                    buttonType="icon"
                    size="S"
                  >
                    <i className="ri-more-2-fill"></i>
                  </Button>
                </PopoverTrigger>
                <PopoverContent theme="light" align="end">
                  <div className="flex flex-col gap-1">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(user)}
                        className="
                          px-3 py-2 text-left rounded
                          hover:bg-background-presentation-action-hover
                          typography-body-small-regular
                        "
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(user)}
                        className="
                          px-3 py-2 text-left rounded
                          hover:bg-background-presentation-state-negative-primary
                          text-content-presentation-state-negative
                          typography-body-small-regular
                        "
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Pattern 4: Modal with Form

### Create Project Modal

```tsx
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  LabelField,
  TextArea,
  Select,
  SimpleOption,
  Button,
  toast,
} from '@torch-ai/torch-glare';

export default function CreateProjectModal() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Project created successfully!');
    setOpen(false);
    // Reset form
    setFormData({ name: '', description: '', category: '' });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button theme="light" variant="PrimeStyle">
          Create Project
        </Button>
      </DialogTrigger>

      <DialogContent theme="light">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new project
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <LabelField
            theme="light"
            label="Project Name"
            requiredLabel="*"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="My Awesome Project"
          />

          <div>
            <label className="typography-body-medium-semibold text-content-presentation-global-primary block mb-2">
              Description *
            </label>
            <TextArea
              theme="light"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe your project..."
              rows={4}
            />
          </div>

          <div>
            <label className="typography-body-medium-semibold text-content-presentation-global-primary block mb-2">
              Category *
            </label>
            <Select
              theme="light"
              value={formData.category}
              onValueChange={(value) => setFormData({...formData, category: value})}
            >
              <SimpleOption value="web">Web Development</SimpleOption>
              <SimpleOption value="mobile">Mobile App</SimpleOption>
              <SimpleOption value="design">Design</SimpleOption>
              <SimpleOption value="other">Other</SimpleOption>
            </Select>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              theme="light"
              variant="BorderStyle"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button theme="light" variant="PrimeStyle" type="submit">
              Create Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Pattern 5: Data Table with Filters

### Advanced Table Component

```tsx
'use client';

import { useState } from 'react';
import {
  Table,
  InputField,
  Select,
  SimpleOption,
  Badge,
  Button,
} from '@torch-ai/torch-glare';

interface TableRow {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'inactive';
  date: string;
  revenue: number;
}

export default function DataTableWithFilters() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const data: TableRow[] = [
    { id: '1', name: 'Project Alpha', status: 'active', date: '2024-01-15', revenue: 15000 },
    { id: '2', name: 'Project Beta', status: 'pending', date: '2024-01-20', revenue: 8000 },
    { id: '3', name: 'Project Gamma', status: 'inactive', date: '2024-01-25', revenue: 0 },
  ];

  const filteredData = data.filter((row) => {
    const matchesSearch = row.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || row.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: TableRow['status']) => {
    const variants = {
      active: 'bg-background-presentation-badge-green text-content-presentation-badge-green',
      pending: 'bg-background-presentation-badge-yellow text-content-presentation-badge-yellow',
      inactive: 'bg-background-presentation-badge-gray text-content-presentation-badge-gray',
    };
    return variants[status];
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="
        bg-background-presentation-form-base
        border border-border-presentation-global-primary
        rounded-lg p-4
      ">
        <div className="flex gap-4">
          <div className="flex-1">
            <InputField
              theme="light"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-48">
            <Select
              theme="light"
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SimpleOption value="all">All Status</SimpleOption>
              <SimpleOption value="active">Active</SimpleOption>
              <SimpleOption value="pending">Pending</SimpleOption>
              <SimpleOption value="inactive">Inactive</SimpleOption>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="
        bg-background-presentation-form-base
        border border-border-presentation-global-primary
        rounded-lg overflow-hidden
      ">
        <table className="w-full">
          <thead className="bg-background-presentation-form-header">
            <tr>
              <th className="px-4 py-3 text-left typography-body-small-semibold text-content-presentation-global-primary">
                Project
              </th>
              <th className="px-4 py-3 text-left typography-body-small-semibold text-content-presentation-global-primary">
                Status
              </th>
              <th className="px-4 py-3 text-left typography-body-small-semibold text-content-presentation-global-primary">
                Date
              </th>
              <th className="px-4 py-3 text-right typography-body-small-semibold text-content-presentation-global-primary">
                Revenue
              </th>
              <th className="px-4 py-3 text-right typography-body-small-semibold text-content-presentation-global-primary">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-presentation-global-primary">
            {filteredData.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-background-presentation-table-row-hover"
              >
                <td className="px-4 py-3 typography-body-medium-regular text-content-presentation-global-primary">
                  {row.name}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded typography-labels-small-semibold ${getStatusBadge(row.status)}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3 typography-body-small-regular text-content-presentation-global-secondary">
                  {row.date}
                </td>
                <td className="px-4 py-3 text-right typography-body-medium-semibold text-content-presentation-global-primary">
                  ${row.revenue.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button theme="light" variant="ContStyle" size="S">
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="p-8 text-center">
            <p className="typography-body-medium-regular text-content-presentation-global-secondary">
              No projects found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## Pattern 6: Dashboard Layout

### Complete Dashboard

```tsx
'use client';

import {
  Button,
  Avatar,
  Badge,
  useTheme,
} from '@torch-ai/torch-glare';
import { useState } from 'react';

export default function Dashboard() {
  const { theme, updateTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background-system-body-primary">
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full
          bg-background-presentation-form-base
          border-r border-border-presentation-global-primary
          transition-all duration-300
          ${sidebarOpen ? 'w-64' : 'w-0'}
          overflow-hidden
        `}
      >
        <div className="p-4">
          <h2 className="typography-headers-large-bold text-content-presentation-global-primary mb-6">
            Dashboard
          </h2>

          <nav className="space-y-2">
            {['Overview', 'Projects', 'Team', 'Settings'].map((item) => (
              <button
                key={item}
                className="
                  w-full px-4 py-2 text-left rounded-lg
                  hover:bg-background-presentation-action-hover
                  typography-body-medium-regular
                  text-content-presentation-global-primary
                "
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`
          transition-all duration-300
          ${sidebarOpen ? 'ml-64' : 'ml-0'}
        `}
      >
        {/* Header */}
        <header className="
          bg-background-presentation-form-base
          border-b border-border-presentation-global-primary
          p-4
        ">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                theme={theme as any}
                variant="ContStyle"
                buttonType="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <i className="ri-menu-line"></i>
              </Button>
              <h1 className="typography-display-medium-bold">
                Overview
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <Button
                theme={theme as any}
                variant="ContStyle"
                buttonType="icon"
                onClick={() => updateTheme(theme === 'light' ? 'dark' : 'light')}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </Button>

              <Avatar
                theme={theme as any}
                src="/avatar.jpg"
                alt="User"
                size="M"
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Revenue', value: '$45,678', change: '+12%' },
              { label: 'Active Users', value: '1,234', change: '+8%' },
              { label: 'Projects', value: '42', change: '+3%' },
            ].map((stat, index) => (
              <div
                key={index}
                className="
                  bg-background-presentation-form-base
                  border border-border-presentation-global-primary
                  rounded-lg p-6
                "
              >
                <p className="typography-labels-small-regular text-content-presentation-global-secondary mb-2">
                  {stat.label}
                </p>
                <p className="typography-display-small-bold text-content-presentation-global-primary mb-2">
                  {stat.value}
                </p>
                <Badge theme={theme as any} variant="SecondStyle">
                  {stat.change}
                </Badge>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="
            bg-background-presentation-form-base
            border border-border-presentation-global-primary
            rounded-lg p-6
          ">
            <h3 className="typography-headers-medium-bold mb-4">
              Recent Activity
            </h3>
            <p className="typography-body-medium-regular text-content-presentation-global-secondary">
              Activity feed would go here...
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
```

---

## Best Practices

### 1. Keep Components Focused

```tsx
// ✓ Good - Each component has one responsibility
function UserCard({ user }) { /* ... */ }
function UserActions({ user, onEdit, onDelete }) { /* ... */ }

// ✗ Bad - Too many responsibilities
function UserEverything({ user, onEdit, onDelete, onShare, onArchive }) { /* ... */ }
```

### 2. Use Composition Over Props

```tsx
// ✓ Good - Flexible composition
<Card>
  <CardHeader>
    <Title>Hello</Title>
    <Badge>New</Badge>
  </CardHeader>
  <CardContent>
    <p>Content</p>
  </CardContent>
</Card>

// ✗ Less flexible - Everything via props
<Card title="Hello" badge="New" content={<p>Content</p>} />
```

### 3. Extract Reusable Patterns

```tsx
// Extract common patterns into custom components
function FormSection({ title, children }) {
  return (
    <div className="space-y-4">
      <h3 className="typography-headers-medium-bold">{title}</h3>
      {children}
    </div>
  );
}
```

### 4. Use TypeScript for Props

```tsx
interface CardProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

function Card({ title, children, actions }: CardProps) {
  // ...
}
```

### 5. Keep State Close to Usage

```tsx
// ✓ Good - State in component that uses it
function SearchableList() {
  const [search, setSearch] = useState('');
  // Use search here
}

// ✗ Bad - State too high up
function App() {
  const [search, setSearch] = useState('');
  return <SearchableList search={search} />
}
```

---

## Next Steps

You now understand component composition! Continue learning:

1. **[Component Documentation](../components/)** - Explore all components
2. **[Hooks Reference](../reference/hooks.md)** - Custom hooks for common patterns
3. **[Best Practices Guide](../how-to/best-practices.md)** - Advanced patterns

## Additional Resources

- [React Composition Patterns](https://reactjs.org/docs/composition-vs-inheritance.html)
- [Component Design Patterns](https://www.patterns.dev/)
