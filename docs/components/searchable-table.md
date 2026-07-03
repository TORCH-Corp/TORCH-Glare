---
title: SearchableTable
description: A field that opens a modal dialog to pick a row from a real Table, with single-select, client- or server-side search, and infinite-scroll pagination
group: Inputs
keywords: [searchable-table, dialog, table, search, async, infinite-scroll, pagination, select, picker]
---

# SearchableTable

> A field that opens a modal `Dialog` to pick a row from a real, multi-column `Table`. The trigger shows a placeholder until something is selected, then the selected row's label. Click it to open the dialog (a search input + the data table); type to filter rows (client-side) or refetch them from a backend (server-side), click a row to single-select it and close the dialog, and scroll to the bottom to lazy-load more pages. Generic over your row type `T`.

## Installation

`SearchableTable` is part of the TORCH Glare component library. It composes the [Dialog](./dialog.md) (built on Radix Dialog) and the [Table](./table.md) component internally, so both must be available — they ship with the library.

```bash
npm install @torch-ui/components @radix-ui/react-dialog
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
      icon={<i className="ri-user-line" />}
      placeholder="Select a user…"
      title="Select a user"
    />
  )
}
```

Clicking the field opens a modal dialog with a search input and the data table. As you type, rows are filtered locally by every column key. Clicking a row selects it (single-select), closes the dialog, and shows `getLabel(row)` on the trigger. Use `placeholder` for the trigger text, `searchPlaceholder` for the in-dialog search input, and `title` for the dialog's search-field label (also the accessible dialog title).

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
      icon={<i className="ri-user-line" />}
      placeholder="Select a user…"
      title="Select a user"
      searchPlaceholder="Search users… (scroll to load more)"
    />
  )
}
```

### Dialog labels (trigger, title, search)

Three props control the dialog's text. `placeholder` is the trigger text shown until a row is selected; `title` labels the dialog's search field (and is the accessible dialog title); `searchPlaceholder` is the placeholder of the in-dialog search input.

```typescript
<SearchableTable<User>
  columns={columns}
  rows={users}
  value={selected}
  onSelect={setSelected}
  getRowId={(row) => row.id}
  icon={<i className="ri-user-line" />}
  placeholder="Select a user…"
  title="Select a user"
  searchPlaceholder="Search by name or role…"
/>
```

The data table inside the dialog scrolls vertically once it exceeds `~55vh`; the remaining rows stay reachable via scroll, which is also what drives infinite-scroll loading.

## API Reference

### SearchableTable&lt;T&gt;

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `SearchableTableColumn<T>[]` | Required | Column config — header, the row key to read, and an optional cell renderer. |
| `rows` | `T[]` | Required | The data rows. In server mode these are rendered as-is (already filtered upstream). |
| `value` | `T \| null` | - | Controlled selected row. The matching row is highlighted in the table. |
| `onSelect` | `(row: T) => void` | - | Called when a row is clicked. The dialog closes and the trigger shows the row's label. |
| `getLabel` | `(row: T) => string` | First column's value | Text shown on the trigger after selection. |
| `getRowId` | `(row: T) => string` | `JSON.stringify(row)` | Stable id/key per row, used for keys and selection matching. |
| `searchKeys` | `(keyof T & string)[]` | Every column `key` | Which fields client-side search matches against. |
| `placeholder` | `string` | `'Select…'` | Trigger placeholder shown until a row is selected. |
| `searchPlaceholder` | `string` | `'Search…'` | Placeholder for the search input inside the dialog. |
| `title` | `string` | `'Select an item'` | Label shown on the dialog's search field (also used as the accessible dialog title). |
| `size` | `'XS' \| 'S' \| 'M'` | `'M'` | Trigger size. (`XS` maps the underlying Group to `S` with a tighter input height.) |
| `variant` | `'PresentationStyle'` | `'PresentationStyle'` | Visual style of the trigger field. |
| `icon` | `ReactNode` | - | Optional leading icon rendered inside the trigger. |
| `theme` | `'dark' \| 'light' \| 'default'` | - | Theme variant, applied via `data-theme`. |
| `dir` | `string` | - | Text direction (e.g. `'rtl'`), applied to the trigger and dialog. |
| `className` | `string` | - | Additional classes merged onto the trigger group. |
| `filterClientSide` | `boolean` | `true` | When `true`, filter `rows` locally by `searchKeys`. Set `false` for server-side search. |
| `onSearchChange` | `(query: string) => void` | - | Debounced query callback — refetch your data here in server mode. |
| `searchDebounceMs` | `number` | `300` | Debounce delay (ms) for `onSearchChange`. |
| `hasMore` | `boolean` | `false` | Whether more pages are available; gates the infinite-scroll loader. |
| `loading` | `boolean` | `false` | Whether a fetch is in flight; renders a loading row and blocks `onLoadMore`. |
| `onLoadMore` | `() => void` | - | Called when the list nears the bottom and `hasMore && !loading`. |

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
  placeholder?: string       // trigger text until selection (default 'Select…')
  searchPlaceholder?: string // in-dialog search input (default 'Search…')
  title?: string             // dialog search-field label / a11y title (default 'Select an item')
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

- The trigger is a focusable group with `role="button"` and `tabIndex={0}`; activating it opens a modal dialog (Radix Dialog), which traps focus and closes on `Esc` or outside click.
- On open, focus moves to the in-dialog search input (`onOpenAutoFocus` is intercepted to focus the search field rather than the first row), so users can type to filter immediately.
- The dialog always renders a `DialogTitle` (visually hidden, sourced from `title`) so the modal has an accessible name even though the heading is not shown.
- Clicking a row selects it and closes the dialog; the selected row is marked with the Table's `state="selected"`.
- Provide a descriptive `placeholder`, a meaningful `title`, and a `getLabel` so screen-reader users hear a clear value after selection. Prefer human-readable headers in `columns`.

## Best Practices

1. **Always supply `getRowId`.** The default key is `JSON.stringify(row)`, which is slow and brittle for large or nested rows. A stable id keeps keys and selection matching cheap.
2. **Set `getLabel` for the selected display.** Otherwise the trigger shows the first column's raw value, which may not be the most descriptive field.
3. **Pick the right search mode.** Keep `filterClientSide` (default) for small, in-memory datasets. Switch to `filterClientSide={false}` + `onSearchChange` for backend-driven search so you never filter a partial page.
4. **Gate pagination correctly.** `onLoadMore` only fires while `hasMore && !loading` — keep `loading` accurate so a single scroll doesn't trigger duplicate fetches, and flip `hasMore` to `false` on the last page.
5. **The table scrolls in both directions.** Columns keep their natural width, so wide tables scroll horizontally inside the dialog, while the table caps its vertical height (~`55vh`) and the rest scrolls vertically (which is what drives infinite scroll). Keep column count and content reasonable so horizontal scroll stays usable.
6. **Tune `searchDebounceMs` to your backend.** The 300ms default suits most APIs; raise it for slow or rate-limited endpoints.
7. **Match `searchKeys` to visible columns.** In client mode, search defaults to every column key — narrow `searchKeys` if some columns hold non-searchable data (ids, formatted dates).

## Related Components

- [SearchableSelect](./searchable-select.md) - Single-column searchable combobox
- [Table](./table.md) - The table primitive rendered inside the dialog
- [Dialog](./dialog.md) - The modal surface the picker opens in
- [DataTable](./data-table.md) - Full-featured data grid for page-level tables
- [Select](./select.md) - Standard form select field
