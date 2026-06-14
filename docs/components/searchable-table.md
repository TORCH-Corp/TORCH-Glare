---
title: SearchableTable
description: A searchable combobox whose dropdown renders a real Table, with single-select, client- or server-side search, and infinite-scroll pagination
group: Inputs
keywords: [searchable-table, combobox, table, search, async, infinite-scroll, pagination, select]
---

# SearchableTable

> A searchable combobox that renders its options as a real, multi-column `Table` inside a `Popover`. Type to filter rows (client-side) or refetch them from a backend (server-side), click a row to single-select it, and scroll to the bottom to lazy-load more pages. Generic over your row type `T`.

## Installation

`SearchableTable` is part of the TORCH Glare component library. It composes the [Popover](./popover.md) (built on Radix Popover) and the [Table](./table.md) component internally, so both must be available — they ship with the library.

```bash
npm install @torch-ui/components @radix-ui/react-popover
```

## Import

```typescript
import { SearchableTable } from '@torch-ui/components'
import type { SearchableTableColumn } from '@torch-ui/components'
```

## Quick Examples

### Basic (static rows)

Provide a `columns` config and a `rows` array. Single-select is controlled via `value` / `onSelect`. Use `getLabel` to control the text shown in the input after selection, and `getRowId` to give each row a stable key.

```typescript
import { SearchableTable } from '@torch-ui/components'
import type { SearchableTableColumn } from '@torch-ui/components'
import { useState } from 'react'

type User = { id: string; name: string; role: string; email: string }

const users: User[] = [
  { id: '1', name: 'Ada Lovelace', role: 'Engineer', email: 'ada@torch.dev' },
  { id: '2', name: 'Alan Turing', role: 'Researcher', email: 'alan@torch.dev' },
  { id: '3', name: 'Grace Hopper', role: 'Admiral', email: 'grace@torch.dev' },
]

const columns: SearchableTableColumn<User>[] = [
  { key: 'name', header: 'Name' },
  { key: 'role', header: 'Role' },
  { key: 'email', header: 'Email' },
]

function Example() {
  const [selected, setSelected] = useState<User | null>(null)

  return (
    <SearchableTable<User>
      columns={columns}
      rows={users}
      value={selected}
      onSelect={setSelected}
      getLabel={(row) => row.name}
      getRowId={(row) => row.id}
      placeholder="Search users…"
    />
  )
}
```

The input opens its dropdown on focus. As you type, rows are filtered locally by every column key. Clicking a row selects it (single-select), closes the dropdown, and shows `getLabel(row)` in the input.

### Custom cell rendering

Use a column's `render` to control how a cell is displayed. When omitted, the cell falls back to `String(row[key])`.

```typescript
const columns: SearchableTableColumn<User>[] = [
  { key: 'name', header: 'Name' },
  {
    key: 'role',
    header: 'Role',
    render: (row) => (
      <span className="rounded bg-white-alpha-20 px-2 py-0.5">{row.role}</span>
    ),
  },
  {
    key: 'email',
    header: 'Contact',
    render: (row) => <a href={`mailto:${row.email}`}>{row.email}</a>,
  },
]
```

### Async server search + infinite scroll

Set `filterClientSide={false}` and treat `rows` as already-filtered server data. `onSearchChange` fires (debounced by `searchDebounceMs`, default 300ms) whenever the query settles — refetch there. As the list nears the bottom, `onLoadMore` fires while `hasMore && !loading`; a loading row renders whenever `loading` is true.

```typescript
import { SearchableTable } from '@torch-ui/components'
import type { SearchableTableColumn } from '@torch-ui/components'
import { useEffect, useState } from 'react'

type User = { id: string; name: string; role: string; email: string }

const columns: SearchableTableColumn<User>[] = [
  { key: 'name', header: 'Name' },
  { key: 'role', header: 'Role' },
  { key: 'email', header: 'Email' },
]

async function fetchUsers(query: string, page: number) {
  const res = await fetch(`/api/users?q=${encodeURIComponent(query)}&page=${page}`)
  return res.json() as Promise<{ items: User[]; hasMore: boolean }>
}

function AsyncExample() {
  const [rows, setRows] = useState<User[]>([])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<User | null>(null)

  // Refetch from page 1 whenever the debounced query changes.
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchUsers(query, 1).then(({ items, hasMore }) => {
      if (cancelled) return
      setRows(items)
      setHasMore(hasMore)
      setPage(1)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [query])

  const loadMore = async () => {
    const next = page + 1
    setLoading(true)
    const { items, hasMore } = await fetchUsers(query, next)
    setRows((prev) => [...prev, ...items])
    setHasMore(hasMore)
    setPage(next)
    setLoading(false)
  }

  return (
    <SearchableTable<User>
      columns={columns}
      rows={rows}
      value={selected}
      onSelect={setSelected}
      getRowId={(row) => row.id}
      getLabel={(row) => row.name}
      filterClientSide={false}
      onSearchChange={setQuery}
      hasMore={hasMore}
      loading={loading}
      onLoadMore={loadMore}
      placeholder="Search users…"
    />
  )
}
```

### Capping the visible height

`maxVisibleRows` (default `6`) caps how many rows are visible before the dropdown scrolls vertically. The remaining rows stay reachable via scroll, which is also what drives infinite-scroll loading.

```typescript
<SearchableTable<User>
  columns={columns}
  rows={users}
  onSelect={setSelected}
  getRowId={(row) => row.id}
  maxVisibleRows={4}
/>
```

## API Reference

### SearchableTable&lt;T&gt;

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `SearchableTableColumn<T>[]` | Required | Column config — header, the row key to read, and an optional cell renderer. |
| `rows` | `T[]` | Required | The data rows. In server mode these are rendered as-is (already filtered upstream). |
| `value` | `T \| null` | - | Controlled selected row. The matching row is highlighted in the table. |
| `onSelect` | `(row: T) => void` | - | Called when a row is clicked. The dropdown closes and the input shows the row's label. |
| `getLabel` | `(row: T) => string` | First column's value | Text shown in the input after selection. |
| `getRowId` | `(row: T) => string` | `JSON.stringify(row)` | Stable id/key per row, used for keys and selection matching. |
| `searchKeys` | `(keyof T & string)[]` | Every column `key` | Which fields client-side search matches against. |
| `placeholder` | `string` | `'Search…'` | Input placeholder text. |
| `size` | `'XS' \| 'S' \| 'M'` | `'M'` | Input size. (`XS` maps the underlying Group to `S` with a tighter input height.) |
| `variant` | `'PresentationStyle'` | `'PresentationStyle'` | Visual style of the input and dropdown surface. |
| `icon` | `ReactNode` | - | Optional leading icon rendered inside the input. |
| `theme` | `'dark' \| 'light' \| 'default'` | - | Theme variant, applied via `data-theme`. |
| `dir` | `string` | - | Text direction (e.g. `'rtl'`), applied to the input group and dropdown. |
| `className` | `string` | - | Additional classes merged onto the input group. |
| `filterClientSide` | `boolean` | `true` | When `true`, filter `rows` locally by `searchKeys`. Set `false` for server-side search. |
| `onSearchChange` | `(query: string) => void` | - | Debounced query callback — refetch your data here in server mode. |
| `searchDebounceMs` | `number` | `300` | Debounce delay (ms) for `onSearchChange`. |
| `hasMore` | `boolean` | `false` | Whether more pages are available; gates the infinite-scroll loader. |
| `loading` | `boolean` | `false` | Whether a fetch is in flight; renders a loading row and blocks `onLoadMore`. |
| `onLoadMore` | `() => void` | - | Called when the list nears the bottom and `hasMore && !loading`. |
| `maxVisibleRows` | `number` | `6` | Max rows visible before the list scrolls vertically. |

### SearchableTableColumn&lt;T&gt;

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `key` | `keyof T & string` | Required | Property on the row used for default rendering and search. |
| `header` | `ReactNode` | Required | Column header content. |
| `render` | `(row: T) => ReactNode` | `String(row[key])` | Custom cell renderer. |

## TypeScript

### SearchableTableColumn

```typescript
export interface SearchableTableColumn<T> {
  /** Property on the row used for default rendering and search. */
  key: keyof T & string
  header: React.ReactNode
  /** Custom cell renderer; defaults to String(row[key]). */
  render?: (row: T) => React.ReactNode
}
```

### Component signature

```typescript
import { Themes } from '@torch-ui/components'

interface SearchableTableProps<T> {
  columns: SearchableTableColumn<T>[]
  rows: T[]
  value?: T | null
  onSelect?: (row: T) => void
  getLabel?: (row: T) => string
  getRowId?: (row: T) => string
  searchKeys?: (keyof T & string)[]
  placeholder?: string
  size?: 'XS' | 'S' | 'M'
  variant?: 'PresentationStyle'
  icon?: React.ReactNode
  theme?: Themes
  dir?: string
  className?: string
  // Async / backend pagination
  filterClientSide?: boolean
  onSearchChange?: (query: string) => void
  searchDebounceMs?: number
  hasMore?: boolean
  loading?: boolean
  onLoadMore?: () => void
  maxVisibleRows?: number
}

// Generic function component, constrained so rows are object-shaped:
export function SearchableTable<T extends Record<string, unknown>>(
  props: SearchableTableProps<T>
): JSX.Element
```

Always pass the type argument explicitly (`<SearchableTable<User> … />`) so `columns`, `value`, and the callbacks are fully type-checked against your row shape.

## Common Patterns

### React Query — `useInfiniteQuery`

Wire pagination through `useInfiniteQuery`, flatten the pages into `rows`, and map the query's state onto `hasMore` / `loading` / `onLoadMore`.

```typescript
import { SearchableTable } from '@torch-ui/components'
import type { SearchableTableColumn } from '@torch-ui/components'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useState } from 'react'

type User = { id: string; name: string; role: string; email: string }

const columns: SearchableTableColumn<User>[] = [
  { key: 'name', header: 'Name' },
  { key: 'role', header: 'Role' },
  { key: 'email', header: 'Email' },
]

function UserPicker() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<User | null>(null)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ['users', query],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(`/api/users?q=${query}&page=${pageParam}`)
      // API row -> T mapping happens here.
      const json = await res.json()
      return {
        items: json.results.map(
          (r: any): User => ({
            id: String(r.user_id),
            name: r.full_name,
            role: r.role_title,
            email: r.email_address,
          })
        ),
        nextPage: json.has_more ? pageParam + 1 : undefined,
      }
    },
    initialPageParam: 1,
    getNextPageParam: (last) => last.nextPage,
  })

  const rows = data?.pages.flatMap((p) => p.items) ?? []

  return (
    <SearchableTable<User>
      columns={columns}
      rows={rows}
      value={selected}
      onSelect={setSelected}
      getRowId={(row) => row.id}
      getLabel={(row) => row.name}
      filterClientSide={false}
      onSearchChange={setQuery}
      hasMore={hasNextPage}
      loading={isFetching}
      onLoadMore={() => fetchNextPage()}
    />
  )
}
```

### SWR — `useSWRInfinite`

```typescript
import { SearchableTable } from '@torch-ui/components'
import useSWRInfinite from 'swr/infinite'
import { useState } from 'react'

const PAGE_SIZE = 20

function UserPicker() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<User | null>(null)

  const getKey = (index: number, prev: { items: User[] } | null) => {
    if (prev && prev.items.length < PAGE_SIZE) return null // reached the end
    return `/api/users?q=${query}&page=${index + 1}`
  }

  const { data, size, setSize, isValidating } = useSWRInfinite(getKey, fetcher)

  const rows = data?.flatMap((p) => p.items) ?? []
  const hasMore = !!data && data[data.length - 1]?.items.length === PAGE_SIZE

  return (
    <SearchableTable<User>
      columns={columns}
      rows={rows}
      value={selected}
      onSelect={setSelected}
      getRowId={(row) => row.id}
      filterClientSide={false}
      onSearchChange={setQuery}
      hasMore={hasMore}
      loading={isValidating}
      onLoadMore={() => setSize(size + 1)}
    />
  )
}
```

### Mapping API rows to `T`

Normalize the backend shape into your row type at the fetch boundary so that `columns`, `getLabel`, `getRowId`, and `searchKeys` all operate on consistent, typed fields:

```typescript
function toUser(api: ApiUser): User {
  return {
    id: String(api.user_id),
    name: `${api.first_name} ${api.last_name}`,
    role: api.role ?? '—',
    email: api.email,
  }
}
```

## Accessibility

- The trigger is a standard text `<input>`, so it is focusable and typeable by keyboard. Focusing it opens the dropdown and starts a fresh search.
- The chevron is a boxed icon button with `aria-label` toggling between `"Open"` and `"Close"`; it is `tabIndex={-1}` so keyboard focus stays on the input, and it uses `onMouseDown` with `preventDefault` to avoid the input blur/focus race.
- Clicking outside the input group or the dropdown closes it (handled via `useClickOutside`).
- The dropdown surface does not steal focus on open (`onOpenAutoFocus` is prevented), keeping the caret in the input while results update.
- Provide a descriptive `placeholder` and a meaningful `getLabel` so screen-reader users hear a clear value after selection. Prefer human-readable headers in `columns`.

## Best Practices

1. **Always supply `getRowId`.** The default key is `JSON.stringify(row)`, which is slow and brittle for large or nested rows. A stable id keeps keys and selection matching cheap.
2. **Set `getLabel` for the selected display.** Otherwise the input shows the first column's raw value, which may not be the most descriptive field.
3. **Pick the right search mode.** Keep `filterClientSide` (default) for small, in-memory datasets. Switch to `filterClientSide={false}` + `onSearchChange` for backend-driven search so you never filter a partial page.
4. **Gate pagination correctly.** `onLoadMore` only fires while `hasMore && !loading` — keep `loading` accurate so a single scroll doesn't trigger duplicate fetches, and flip `hasMore` to `false` on the last page.
5. **The table scrolls in both directions.** Columns keep their natural width, so wide tables scroll horizontally inside the dropdown, while `maxVisibleRows` caps the vertical height and the rest scrolls vertically (which is what drives infinite scroll). Keep column count and content reasonable so horizontal scroll stays usable.
6. **Tune `searchDebounceMs` to your backend.** The 300ms default suits most APIs; raise it for slow or rate-limited endpoints.
7. **Match `searchKeys` to visible columns.** In client mode, search defaults to every column key — narrow `searchKeys` if some columns hold non-searchable data (ids, formatted dates).

## Related Components

- [SearchableSelect](./searchable-select.md) - Single-column searchable combobox
- [Table](./table.md) - The table primitive rendered inside the dropdown
- [DataTable](./data-table.md) - Full-featured data grid for page-level tables
- [Select](./select.md) - Standard form select field
