---
name: Table
version: 1.1.15
status: stable
category: components/data-display
tags: [table, data, grid, sortable, resizable, accessible, compound]
last-reviewed: 2024-11-05
bundle-size: 4.2kb
dependencies:
  - "class-variance-authority": "^0.7.0"
  - "@/components/Button": "internal"
  - "@/components/Checkbox": "internal"
  - "@/hooks/useResize": "internal"
---

# Table

> A comprehensive data table component with resizable columns, sortable headers, row states, and compound architecture. Built for complex data presentation with accessibility and performance in mind.

## Installation

```bash
npm install torch-glare
```

## Import

```typescript
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableCheckbox,
  TableFooterButton,
  SubTableButton
} from 'torch-glare/lib/components/Table'
```

## Quick Examples

### Basic Table

```typescript
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from 'torch-glare/lib/components/Table'

function BasicTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>John Doe</TableCell>
          <TableCell>john@example.com</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Jane Smith</TableCell>
          <TableCell>jane@example.com</TableCell>
          <TableCell>Pending</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
```

### Sortable Table

```typescript
function SortableTable() {
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortType, setSortType] = useState<'asc' | 'desc' | undefined>()
  const [data, setData] = useState(initialData)

  const handleSort = (field: string) => {
    const newSortType = sortType === 'asc' ? 'desc' : 'asc'
    setSortType(newSortType)
    setSortField(field)

    // Sort data
    const sorted = [...data].sort((a, b) => {
      if (newSortType === 'asc') {
        return a[field] > b[field] ? 1 : -1
      }
      return a[field] < b[field] ? 1 : -1
    })
    setData(sorted)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            sortType={sortField === 'name' ? sortType : undefined}
            onSort={() => handleSort('name')}
          >
            Name
          </TableHead>
          <TableHead
            sortType={sortField === 'date' ? sortType : undefined}
            onSort={() => handleSort('date')}
          >
            Date
          </TableHead>
          <TableHead
            sortType={sortField === 'amount' ? sortType : undefined}
            onSort={() => handleSort('amount')}
          >
            Amount
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.date}</TableCell>
            <TableCell>${item.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

### Table with Row States

```typescript
function TableWithStates() {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow state="add">
          <TableCell>New Item</TableCell>
          <TableCell>Added</TableCell>
          <TableCell>Review</TableCell>
        </TableRow>
        <TableRow state="update">
          <TableCell>Updated Item</TableCell>
          <TableCell>Modified</TableCell>
          <TableCell>Confirm</TableCell>
        </TableRow>
        <TableRow state="delete">
          <TableCell>Deleted Item</TableCell>
          <TableCell>Removed</TableCell>
          <TableCell>Undo</TableCell>
        </TableRow>
        <TableRow state="selected">
          <TableCell>Selected Item</TableCell>
          <TableCell>Active</TableCell>
          <TableCell>Edit</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
```

### Table with Checkbox Selection

```typescript
function SelectableTable() {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [data] = useState(items)

  const toggleRow = (id: string) => {
    const newSet = new Set(selectedRows)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedRows(newSet)
  }

  const toggleAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(data.map(d => d.id)))
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead size="S">
            <TableCheckbox
              id="select-all"
              checked={selectedRows.size === data.length}
              indeterminate={selectedRows.size > 0 && selectedRows.size < data.length}
              onChange={toggleAll}
            />
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow
            key={item.id}
            state={selectedRows.has(item.id) ? 'selected' : undefined}
          >
            <TableCell>
              <TableCheckbox
                id={`select-${item.id}`}
                checked={selectedRows.has(item.id)}
                onChange={() => toggleRow(item.id)}
              />
            </TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.email}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

### Table with Themed Styles

```typescript
function ThemedTable() {
  return (
    <>
      <Table theme="light">
        <TableCaption>Light Theme Table</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Column 1</TableHead>
            <TableHead>Column 2</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Data 1</TableCell>
            <TableCell>Data 2</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Table theme="dark">
        <TableCaption>Dark Theme Table</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Column 1</TableHead>
            <TableHead>Column 2</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Data 1</TableCell>
            <TableCell>Data 2</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  )
}
```

### Table with Footer Actions

```typescript
function TableWithFooter() {
  const [showMore, setShowMore] = useState(false)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.slice(0, showMore ? undefined : 5).map((product) => (
          <TableRow key={product.id}>
            <TableCell>{product.name}</TableCell>
            <TableCell>${product.price}</TableCell>
            <TableCell>{product.stock}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableFooterButton onClick={() => setShowMore(!showMore)}>
          <i className="ri-add-line" />
          {showMore ? 'Show Less' : 'Show More Items'}
        </TableFooterButton>
      </TableFooter>
    </Table>
  )
}
```

### Resizable Columns

```typescript
function ResizableTable() {
  // Column resizing is automatic with the useResize hook
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Resizable Column 1</TableHead>
          <TableHead>Resizable Column 2</TableHead>
          <TableHead isDummy>Fixed Width</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Drag the resize handle</TableCell>
          <TableCell>On column borders</TableCell>
          <TableCell isDummy>Cannot resize</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
```

## API Reference

### Table Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `'dark' \| 'light' \| 'default'` | `'default'` | Theme variant |
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Table content |

### TableHeader Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Header rows |

### TableBody Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Body rows |

### TableRow Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `state` | `'delete' \| 'update' \| 'add' \| 'selected' \| 'open'` | - | Row state styling |
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Row cells |

### TableHead Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'S' \| 'M'` | `'M'` | Header cell size |
| `disabled` | `boolean` | `false` | Disables interactions |
| `sortType` | `'asc' \| 'desc' \| undefined` | - | Sort indicator |
| `onSort` | `() => void` | - | Sort handler |
| `isDummy` | `boolean` | `false` | Non-interactive header |
| `className` | `string` | - | Additional CSS classes |

### TableCell Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isDummy` | `boolean` | `false` | Non-interactive cell |
| `childrenClassName` | `string` | - | Classes for content wrapper |
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Cell content |

### TableCheckbox Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | Required checkbox ID |
| `checked` | `boolean` | - | Checked state |
| `indeterminate` | `boolean` | - | Indeterminate state |
| `onChange` | `() => void` | - | Change handler |

### TableFooterButton Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onClick` | `() => void` | - | Click handler |
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Button content |

### TypeScript

```typescript
// Table types
interface TableProps extends HTMLAttributes<HTMLTableElement> {
  theme?: 'dark' | 'light' | 'default'
  className?: string
}

// TableRow types
interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  state?: 'delete' | 'update' | 'add' | 'selected' | 'open'
}

// TableHead types
interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  size?: 'S' | 'M'
  disabled?: boolean
  sortType?: 'asc' | 'desc' | undefined
  onSort?: () => void
  isDummy?: boolean
}

// TableCell types
interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  isDummy?: boolean
  childrenClassName?: string
}

// TableCheckbox types
interface TableCheckboxProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  id: string
  checked?: boolean
  indeterminate?: boolean
}

// Export structure
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableCheckbox,
  SubTableButton,
  TableFooterButton
}
```

## Common Patterns

### Data Table with Pagination

```typescript
function PaginatedTable() {
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const totalPages = Math.ceil(data.length / rowsPerPage)

  const paginatedData = data.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  )

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <select
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
        >
          <option value={10}>10 rows</option>
          <option value={25}>25 rows</option>
          <option value={50}>50 rows</option>
        </select>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </>
  )
}
```

### Expandable Rows

```typescript
function ExpandableTable() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleRow = (id: string) => {
    const newSet = new Set(expandedRows)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setExpandedRows(newSet)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead size="S"></TableHead>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <React.Fragment key={order.id}>
            <TableRow state={expandedRows.has(order.id) ? 'open' : undefined}>
              <TableCell>
                <SubTableButton
                  isActive={expandedRows.has(order.id)}
                  onClick={() => toggleRow(order.id)}
                />
              </TableCell>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>${order.total}</TableCell>
            </TableRow>
            {expandedRows.has(order.id) && (
              <TableRow>
                <TableCell colSpan={4}>
                  <div className="p-4">
                    <h4>Order Details</h4>
                    {order.items.map((item) => (
                      <div key={item.id}>
                        {item.name} - ${item.price} x {item.quantity}
                      </div>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  )
}
```

### Editable Table

```typescript
function EditableTable() {
  const [data, setData] = useState(initialData)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleEdit = (id: string, field: string, value: string) => {
    setData(data.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              {editingId === item.id ? (
                <Input
                  value={item.name}
                  onChange={(e) => handleEdit(item.id, 'name', e.target.value)}
                  onBlur={() => setEditingId(null)}
                />
              ) : (
                item.name
              )}
            </TableCell>
            <TableCell>
              {editingId === item.id ? (
                <Input
                  value={item.email}
                  onChange={(e) => handleEdit(item.id, 'email', e.target.value)}
                  onBlur={() => setEditingId(null)}
                />
              ) : (
                item.email
              )}
            </TableCell>
            <TableCell>
              <button onClick={() => setEditingId(item.id)}>
                Edit
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

## Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from 'torch-glare/lib/components/Table'

describe('Table', () => {
  it('renders table with data', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Header 1</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Cell 1</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    expect(screen.getByText('Header 1')).toBeInTheDocument()
    expect(screen.getByText('Cell 1')).toBeInTheDocument()
  })

  it('handles sorting', () => {
    const handleSort = jest.fn()
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onSort={handleSort} sortType="asc">
              Sortable
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    )

    const sortButton = screen.getByRole('button')
    fireEvent.pointerDown(sortButton)
    expect(handleSort).toHaveBeenCalled()
  })

  it('applies row states correctly', () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow state="selected">
            <TableCell>Selected</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    const row = container.querySelector('tr')
    expect(row).toHaveClass('bg-background-presentation-table-row-selected')
  })
})
```

### Accessibility Test

```typescript
import { axe } from '@axe-core/react'

test('Table meets WCAG standards', async () => {
  const { container } = render(
    <Table>
      <TableCaption>User Data</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead scope="col">Name</TableHead>
          <TableHead scope="col">Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>John Doe</TableCell>
          <TableCell>john@example.com</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )

  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## Accessibility

### Keyboard Support

- **Tab**: Navigate through interactive elements
- **Space/Enter**: Activate buttons and checkboxes
- **Arrow Keys**: Navigate cells (with additional implementation)
- **Home/End**: Jump to first/last cell in row

### ARIA Attributes

```typescript
// Sortable headers
<TableHead
  role="columnheader"
  aria-sort={sortType === 'asc' ? 'ascending' : 'descending'}
>

// Row selection
<TableRow
  role="row"
  aria-selected={isSelected}
>

// Table caption for screen readers
<TableCaption>
  Showing {start} to {end} of {total} results
</TableCaption>
```

### Screen Reader Support

- Announces table structure and dimensions
- Reads column headers with cells
- Announces sort state changes
- Communicates row selection state

## Styling

### Custom Styles with className

```typescript
<Table className="border rounded-lg">
  <TableHeader className="bg-gray-100">
    <TableRow className="border-b-2">
      <TableHead className="font-bold">Custom Styled</TableHead>
    </TableRow>
  </TableHeader>
</Table>
```

### CSS Variables

```css
/* Custom theme variables */
[data-theme="custom"] {
  --table-border: #your-border;
  --table-header-bg: #your-header-bg;
  --table-row-hover: #your-hover;
  --table-row-selected: #your-selected;
  --table-sort-active: #your-sort-color;
}
```

### Row State Classes

```css
/* Row states */
.state-delete { background: var(--color-negative); }
.state-update { background: var(--color-information); }
.state-add { background: var(--color-success); }
.state-selected { background: var(--color-selected); }
.state-open { background: var(--color-hover); }
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (gzip) | 4.2kb |
| First render (100 rows) | <20ms |
| Re-render (100 rows) | <10ms |
| Column resize | <5ms |
| Tree-shakeable | ✅ |

### Optimization Tips

1. Use `React.memo()` for row components with large datasets
2. Implement virtual scrolling for tables with >100 rows
3. Debounce sort and filter operations
4. Use `useCallback` for event handlers
5. Consider pagination for large datasets

## Migration

### From v1.0.x

```diff
// Import path changed
- import Table from 'torch-glare/Table'
+ import { Table, TableHeader, TableBody } from 'torch-glare/lib/components/Table'

// Component structure
- <Table headers={headers} data={data} />
+ <Table>
+   <TableHeader>
+     <TableRow>
+       {headers.map(h => <TableHead key={h}>{h}</TableHead>)}
+     </TableRow>
+   </TableHeader>
+   <TableBody>
+     {data.map(row => (
+       <TableRow key={row.id}>
+         {row.cells.map(cell => <TableCell key={cell}>{cell}</TableCell>)}
+       </TableRow>
+     ))}
+   </TableBody>
+ </Table>
```

## Troubleshooting

### Common Issues

#### Columns not resizing

**Solution:** Ensure resize handles are not disabled

```typescript
// ❌ Wrong - disables resize
<TableHead isDummy>Column</TableHead>

// ✅ Correct - allows resize
<TableHead>Column</TableHead>
```

#### Sort not working

**Solution:** Implement sort handler properly

```typescript
// ❌ Wrong - no state update
<TableHead onSort={() => console.log('sort')}>

// ✅ Correct - updates data
<TableHead
  onSort={() => handleSort('field')}
  sortType={sortType}
>
```

#### Row selection not visible

**Solution:** Apply state prop to TableRow

```typescript
// ❌ Wrong - no visual feedback
<TableRow>

// ✅ Correct - shows selection
<TableRow state={isSelected ? 'selected' : undefined}>
```

## Related Components

- [DataTable](/docs/components/data-table.md) - Advanced table with built-in features
- [Card](/docs/components/card.md) - Alternative data display format
- [ScrollArea](/docs/components/scroll-area.md) - For scrollable tables
- [Checkbox](/docs/components/checkbox.md) - For row selection
- [Button](/docs/components/button.md) - For table actions

## Browser Support

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile browsers ✅

## Changelog

### v1.1.15
- Added column resizing functionality
- Improved sorting indicators
- Enhanced row state styling
- Better TypeScript types

### v1.1.14
- Table component refactor
- Added compound architecture
- Performance optimizations

### v1.1.0
- Initial stable release