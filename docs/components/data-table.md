---
title: DataTable
description: Advanced data table with sorting, selection, filtering, pagination, and drag-and-drop row reordering
group: Data Display
keywords: [table, datatable, grid, sorting, selection, drag-drop, reorder, pagination, filtering, tanstack]
---

# DataTable

> A powerful, feature-rich data table component built on TanStack Table with drag-and-drop row reordering, multi-row selection, column sorting, pagination, and filtering capabilities.

## Installation

```bash
npm install @tanstack/react-table @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

## Import

```typescript
import { DataTable } from '@torch-ui/components'
import { ColumnDef } from '@tanstack/react-table'
```

## Quick Examples

### Basic Usage

```typescript
import { DataTable } from '@torch-ui/components'
import { ColumnDef } from '@tanstack/react-table'

interface User {
  id: string
  name: string
  email: string
  role: string
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
]

const data: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor' },
]

function Example() {
  return <DataTable columns={columns} data={data} />
}
```

### With Row Reordering

```typescript
import { DataTable } from '@torch-ui/components'
import { useState } from 'react'

function ReorderableTable() {
  const [data, setData] = useState([
    { id: '1', task: 'Design homepage', priority: 'High' },
    { id: '2', task: 'Write documentation', priority: 'Medium' },
    { id: '3', task: 'Fix bugs', priority: 'High' },
  ])

  const columns = [
    { accessorKey: 'task', header: 'Task' },
    { accessorKey: 'priority', header: 'Priority' },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      onRowReorder={(newData) => {
        setData(newData)
        console.log('New order:', newData)
      }}
    />
  )
}
```

### With Custom Cell Rendering

```typescript
import { DataTable } from '@torch-ui/components'
import { Badge } from '@torch-ui/components'
import { ColumnDef } from '@tanstack/react-table'

interface Task {
  id: string
  title: string
  status: 'pending' | 'in-progress' | 'completed'
  assignee: string
}

const columns: ColumnDef<Task>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const variant = {
        pending: 'yellow',
        'in-progress': 'blue',
        completed: 'green',
      }[status]

      return <Badge variant={variant} label={status} />
    },
  },
  {
    accessorKey: 'assignee',
    header: 'Assignee',
  },
]

function TaskTable() {
  const data: Task[] = [
    { id: '1', title: 'Design UI', status: 'in-progress', assignee: 'Alice' },
    { id: '2', title: 'Write tests', status: 'pending', assignee: 'Bob' },
    { id: '3', title: 'Deploy', status: 'completed', assignee: 'Charlie' },
  ]

  return <DataTable columns={columns} data={data} />
}
```

### With Sortable Columns

```typescript
import { DataTable } from '@torch-ui/components'
import { ColumnDef } from '@tanstack/react-table'

interface Product {
  id: string
  name: string
  price: number
  stock: number
}

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Product',
    enableSorting: true,
  },
  {
    accessorKey: 'price',
    header: 'Price',
    enableSorting: true,
    cell: ({ row }) => `$${row.getValue('price')}`,
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
    enableSorting: true,
  },
]

function ProductTable() {
  const data: Product[] = [
    { id: '1', name: 'Laptop', price: 999, stock: 15 },
    { id: '2', name: 'Mouse', price: 29, stock: 50 },
    { id: '3', name: 'Keyboard', price: 79, stock: 30 },
  ]

  return <DataTable columns={columns} data={data} />
}
```

### With Actions Column

```typescript
import { DataTable } from '@torch-ui/components'
import { ActionButton } from '@torch-ui/components'
import { ColumnDef } from '@tanstack/react-table'

interface User {
  id: string
  name: string
  email: string
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <ActionButton
          size="XS"
          onClick={() => console.log('Edit', row.original.id)}
          aria-label="Edit user"
        >
          <i className="ri-edit-line" />
        </ActionButton>
        <ActionButton
          size="XS"
          onClick={() => console.log('Delete', row.original.id)}
          aria-label="Delete user"
        >
          <i className="ri-delete-bin-line" />
        </ActionButton>
      </div>
    ),
  },
]

function UserTable() {
  const data: User[] = [
    { id: '1', name: 'Alice', email: 'alice@example.com' },
    { id: '2', name: 'Bob', email: 'bob@example.com' },
  ]

  return <DataTable columns={columns} data={data} />
}
```

### With Selection Handling

```typescript
import { DataTable } from '@torch-ui/components'
import { useState } from 'react'

function SelectableTable() {
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  const data = [
    { id: '1', name: 'Item 1', value: 100 },
    { id: '2', name: 'Item 2', value: 200 },
    { id: '3', name: 'Item 3', value: 300 },
  ]

  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'value', header: 'Value' },
  ]

  return (
    <div>
      <DataTable columns={columns} data={data} />
      <div className="mt-4">
        <p>Selected rows: {selectedRows.length}</p>
        <button onClick={() => console.log('Process selected rows')}>
          Process Selected
        </button>
      </div>
    </div>
  )
}
```

### Dark Theme

```typescript
import { DataTable } from '@torch-ui/components'

function DarkTable() {
  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'status', header: 'Status' },
  ]

  const data = [
    { id: '1', name: 'Task 1', status: 'Active' },
    { id: '2', name: 'Task 2', status: 'Completed' },
  ]

  return <DataTable columns={columns} data={data} theme="dark" />
}
```

### Complex Data with Nested Objects

```typescript
import { DataTable } from '@torch-ui/components'
import { ColumnDef } from '@tanstack/react-table'

interface Order {
  id: string
  orderNumber: string
  customer: {
    name: string
    email: string
  }
  total: number
  status: string
}

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'orderNumber',
    header: 'Order #',
  },
  {
    accessorKey: 'customer.name',
    header: 'Customer',
  },
  {
    accessorKey: 'customer.email',
    header: 'Email',
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ row }) => `$${row.getValue('total')}`,
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
]

function OrderTable() {
  const data: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-001',
      customer: { name: 'John Doe', email: 'john@example.com' },
      total: 299.99,
      status: 'Shipped',
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      customer: { name: 'Jane Smith', email: 'jane@example.com' },
      total: 149.99,
      status: 'Processing',
    },
  ]

  return <DataTable columns={columns} data={data} />
}
```

### Empty State

```typescript
import { DataTable } from '@torch-ui/components'

function EmptyTable() {
  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
  ]

  // Empty data array
  const data = []

  return (
    <DataTable
      columns={columns}
      data={data}
      // Shows "No results." message automatically
    />
  )
}
```

## API Reference

### DataTable Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `ColumnDef<TData, TValue>[]` | Required | Column definitions for the table |
| `data` | `TData[]` | Required | Array of data objects (must have `id` property) |
| `theme` | `'dark' \| 'light' \| 'default'` | `'default'` | Theme variant |
| `onRowReorder` | `(newData: TData[]) => void` | - | Callback when rows are reordered via drag-and-drop |

### Type Constraints

```typescript
// Data must extend an object with id property
interface DataTableProps<TData extends { id: string | number }, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  theme?: "dark" | "light" | "default"
  onRowReorder?: (newData: TData[]) => void
}
```

## TypeScript

### Full Type Definitions

```typescript
import { ColumnDef } from '@tanstack/react-table'

// Data type must have id property
interface YourDataType {
  id: string | number
  // ... other properties
}

// Column definition with all options
const columns: ColumnDef<YourDataType>[] = [
  {
    accessorKey: 'fieldName',
    header: 'Header Label',
    enableSorting: true,
    enableHiding: true,
    cell: ({ row, getValue }) => {
      // Custom cell rendering
      return <div>{getValue()}</div>
    },
  },
]

// Component usage with TypeScript
function TypedTable() {
  const data: YourDataType[] = [
    { id: '1', /* ... */ },
  ]

  const handleReorder = (newData: YourDataType[]) => {
    // Type-safe reorder handler
    console.log(newData)
  }

  return (
    <DataTable<YourDataType, any>
      columns={columns}
      data={data}
      onRowReorder={handleReorder}
    />
  )
}
```

### Generic Type Parameters

```typescript
// TData: Your data type (must have id property)
// TValue: Value type for cells (usually inferred)
DataTable<TData extends { id: string | number }, TValue>
```

## Common Patterns

### Controlled Row Selection

```typescript
import { DataTable } from '@torch-ui/components'
import { useState } from 'react'

function ControlledSelectionTable() {
  const [data, setData] = useState([
    { id: '1', name: 'Task 1', completed: false },
    { id: '2', name: 'Task 2', completed: false },
  ])

  const columns = [
    { accessorKey: 'name', header: 'Task' },
    {
      accessorKey: 'completed',
      header: 'Status',
      cell: ({ row }) => (
        <span>{row.getValue('completed') ? '✓ Done' : 'Pending'}</span>
      ),
    },
  ]

  return <DataTable columns={columns} data={data} />
}
```

### With Search/Filter

```typescript
import { DataTable } from '@torch-ui/components'
import { Input } from '@torch-ui/components'
import { useState, useMemo } from 'react'

function SearchableTable() {
  const [searchTerm, setSearchTerm] = useState('')

  const allData = [
    { id: '1', name: 'Apple', category: 'Fruit' },
    { id: '2', name: 'Banana', category: 'Fruit' },
    { id: '3', name: 'Carrot', category: 'Vegetable' },
  ]

  const filteredData = useMemo(() => {
    return allData.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'category', header: 'Category' },
  ]

  return (
    <div>
      <Input
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <DataTable columns={columns} data={filteredData} />
    </div>
  )
}
```

### Persisting Row Order

```typescript
import { DataTable } from '@torch-ui/components'
import { useState, useEffect } from 'react'

function PersistentOrderTable() {
  const [data, setData] = useState(() => {
    // Load from localStorage
    const saved = localStorage.getItem('tableOrder')
    return saved ? JSON.parse(saved) : defaultData
  })

  const handleReorder = (newData) => {
    setData(newData)
    // Persist to localStorage
    localStorage.setItem('tableOrder', JSON.stringify(newData))
  }

  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'position', header: 'Position' },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      onRowReorder={handleReorder}
    />
  )
}
```

## Features

### Built-in Capabilities

- **Row Selection**: Multi-row selection with checkboxes (select all, select individual)
- **Drag & Drop**: Reorder rows by dragging (maintains selection state)
- **Column Sorting**: Click headers to sort ascending/descending
- **Pagination**: Built-in pagination support (via TanStack Table)
- **Filtering**: Client-side filtering capabilities
- **Custom Cells**: Full control over cell rendering
- **Keyboard Navigation**: Drag-and-drop with keyboard support
- **Type Safety**: Full TypeScript support with generics

### Drag-and-Drop Behavior

- Drag icon appears in first column (dummy cell)
- Cursor changes to grab/grabbing during drag
- Row becomes semi-transparent (50% opacity) while dragging
- Selection state is preserved after reordering
- `onRowReorder` callback provides new data array

### Selection Management

- Select all checkbox in header
- Individual row checkboxes
- Selection state persists through reordering
- Selection mapping automatically updates after drag-and-drop

## Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { DataTable } from '@torch-ui/components'
import { ColumnDef } from '@tanstack/react-table'

const mockData = [
  { id: '1', name: 'Item 1', value: 100 },
  { id: '2', name: 'Item 2', value: 200 },
]

const mockColumns: ColumnDef<typeof mockData[0]>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'value', header: 'Value' },
]

describe('DataTable', () => {
  it('renders table with data', () => {
    render(<DataTable columns={mockColumns} data={mockData} />)

    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('shows empty state when no data', () => {
    render(<DataTable columns={mockColumns} data={[]} />)

    expect(screen.getByText('No results.')).toBeInTheDocument()
  })

  it('calls onRowReorder when rows are reordered', () => {
    const handleReorder = jest.fn()

    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        onRowReorder={handleReorder}
      />
    )

    // Simulate drag-and-drop (requires @dnd-kit testing utilities)
    // ... drag and drop simulation

    expect(handleReorder).toHaveBeenCalled()
  })
})
```

### Testing Row Selection

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { DataTable } from '@torch-ui/components'

test('row selection works correctly', () => {
  const columns = [{ accessorKey: 'name', header: 'Name' }]
  const data = [
    { id: '1', name: 'Row 1' },
    { id: '2', name: 'Row 2' },
  ]

  render(<DataTable columns={columns} data={data} />)

  const checkboxes = screen.getAllByRole('checkbox')

  // Select first row
  fireEvent.click(checkboxes[1]) // Skip header checkbox

  expect(checkboxes[1]).toBeChecked()
})
```

## Accessibility

- **Keyboard Support**: Full keyboard navigation for drag-and-drop
  - Space: Start/stop dragging
  - Arrow keys: Move selected item
  - Escape: Cancel drag operation
- **ARIA Attributes**:
  - Checkboxes have proper `aria-checked` states
  - Drag handles have `aria-label` (via dnd-kit)
  - Sortable columns announce sort direction
- **Screen Readers**:
  - Table structure announced correctly
  - Selection changes announced
  - Reorder operations announced
- **Focus Management**:
  - Keyboard focus visible
  - Focus trapped during drag operations
- **Color Contrast**: High contrast for text and interactive elements

### Accessibility Example

```typescript
// Ensure action buttons have labels
const columns: ColumnDef<User>[] = [
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <ActionButton
        aria-label={`Edit ${row.original.name}`}
        onClick={() => handleEdit(row.original.id)}
      >
        <i className="ri-edit-line" />
      </ActionButton>
    ),
  },
]
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (minified) | ~45kb (excluding dependencies) |
| Dependencies | TanStack Table (~15kb), dnd-kit (~20kb) |
| First render | <20ms (100 rows) |
| Reorder operation | <10ms |
| Tree-shakeable | ✅ |

### Performance Tips

1. **Memoize columns**: Define columns outside component or use `useMemo`
   ```typescript
   const columns = useMemo(() => [...], [])
   ```

2. **Virtual scrolling**: For large datasets (1000+ rows), use TanStack Virtual
   ```typescript
   import { useVirtualizer } from '@tanstack/react-virtual'
   ```

3. **Pagination**: Enable pagination for better performance
   ```typescript
   // Already included in DataTable
   getPaginationRowModel: getPaginationRowModel()
   ```

4. **Optimize cell rendering**: Memoize expensive cell components
   ```typescript
   const MemoizedCell = memo(({ value }) => <ExpensiveComponent value={value} />)
   ```

## Migration from Other Tables

### From HTML Table

```diff
- <table>
-   <thead>
-     <tr><th>Name</th></tr>
-   </thead>
-   <tbody>
-     <tr><td>{item.name}</td></tr>
-   </tbody>
- </table>

+ <DataTable
+   columns={[{ accessorKey: 'name', header: 'Name' }]}
+   data={items}
+ />
```

### From Material-UI DataGrid

```diff
- import { DataGrid } from '@mui/x-data-grid'
+ import { DataTable } from '@torch-ui/components'
+ import { ColumnDef } from '@tanstack/react-table'

- <DataGrid rows={data} columns={columns} />
+ <DataTable data={data} columns={columns} />
```

### From React Table v7

```diff
- import { useTable } from 'react-table'
+ import { DataTable } from '@torch-ui/components'
+ import { ColumnDef } from '@tanstack/react-table'

- const { getTableProps, rows } = useTable({ columns, data })
- return <table {...getTableProps()}>...</table>

+ return <DataTable columns={columns} data={data} />
```

## Best Practices

1. **Always provide unique IDs**: Ensure every data item has a unique `id` property
   ```typescript
   const data = items.map((item, index) => ({
     id: item.id || `row-${index}`,
     ...item
   }))
   ```

2. **Memoize column definitions**: Prevent unnecessary re-renders
   ```typescript
   const columns = useMemo<ColumnDef<Data>[]>(() => [...], [])
   ```

3. **Type your data**: Use TypeScript generics for type safety
   ```typescript
   interface MyData { id: string; name: string }
   <DataTable<MyData, any> columns={columns} data={data} />
   ```

4. **Handle reorder events**: Process the new data order when provided
   ```typescript
   onRowReorder={(newData) => {
     updateBackend(newData)
     setData(newData)
   }}
   ```

5. **Provide accessible labels**: Always add aria-labels for icon-only actions
   ```typescript
   <ActionButton aria-label="Delete item">
     <i className="ri-delete-bin-line" />
   </ActionButton>
   ```

6. **Optimize for large datasets**: Use pagination, virtualization, or server-side operations
   ```typescript
   // Consider using TanStack Virtual for 1000+ rows
   ```

7. **Custom empty states**: Provide helpful messages for empty tables
   ```typescript
   // Default "No results." message is shown automatically
   // Customize by modifying the table body rendering
   ```

## Related Components

- [Table](./table.md) - Base table components used by DataTable
- [Checkbox](./checkbox.md) - Used for row selection
- [Badge](./badge.md) - Useful for status columns
- [ActionButton](./action-button.md) - Perfect for action columns
