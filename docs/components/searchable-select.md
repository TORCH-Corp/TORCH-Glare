---
title: SearchableSelect
description: Searchable single-select combobox with focus-to-open, client or server-side filtering, and infinite-scroll pagination
group: Inputs
keywords: [searchable-select, combobox, select, search, async, infinite-scroll, pagination]
---

# SearchableSelect

> A searchable single-select combobox that opens on focus and filters options as you type. Renders DropdownMenu-style rows on a Popover surface so the input keeps focus while filtering. Supports static options with local filtering, or server-side search with debounced queries and infinite-scroll pagination.

## Installation

```bash
npm install @radix-ui/react-popover
```

SearchableSelect is built on the TORCH `Popover` component (which wraps `@radix-ui/react-popover`) and reuses the `Input`, `Button`, and `DropdownMenu` item styles. All imports come from `@torch-ui/components`.

## Import

```typescript
import { SearchableSelect } from '@torch-ui/components'
import type { SearchableSelectOption } from '@torch-ui/components'
```

## Quick Examples

### Basic (static options)

Pass a static `options` array and control the selection with `value` / `onValueChange`. Options may include an `icon`. Filtering happens locally by default.

```typescript
import { SearchableSelect } from '@torch-ui/components'
import type { SearchableSelectOption } from '@torch-ui/components'
import { useState } from 'react'

const options: SearchableSelectOption[] = [
  { value: 'react', label: 'React', icon: <i className="ri-reactjs-line" /> },
  { value: 'vue', label: 'Vue', icon: <i className="ri-vuejs-line" /> },
  { value: 'svelte', label: 'Svelte', icon: <i className="ri-svelte-line" /> },
  { value: 'angular', label: 'Angular', icon: <i className="ri-angularjs-line" /> },
]

function FrameworkPicker() {
  const [value, setValue] = useState<string | null>(null)

  return (
    <SearchableSelect
      options={options}
      value={value}
      onValueChange={(next) => setValue(next)}
      placeholder="Search frameworks…"
      icon={<i className="ri-search-line" />}
    />
  )
}
```

### Async server search + infinite scroll

For large or remote datasets, set `filterClientSide={false}` and drive everything from controlled props: refetch in `onSearchChange` (debounced), append pages in `onLoadMore`, and report `hasMore` / `loading`. Options are rendered as-is — the component does not filter them locally in this mode.

```typescript
import { SearchableSelect } from '@torch-ui/components'
import type { SearchableSelectOption } from '@torch-ui/components'
import { useEffect, useState } from 'react'

const PAGE_SIZE = 20

function UserPicker() {
  const [value, setValue] = useState<string | null>(null)
  const [options, setOptions] = useState<SearchableSelectOption[]>([])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  // Fetch whenever the query or page changes.
  useEffect(() => {
    let cancelled = false
    setLoading(true)

    fetch(`/api/users?q=${encodeURIComponent(query)}&page=${page}&size=${PAGE_SIZE}`)
      .then((res) => res.json())
      .then((data: { id: string; name: string }[]) => {
        if (cancelled) return
        const next = data.map((u) => ({ value: u.id, label: u.name }))
        // Replace on a fresh query (page 1), append on subsequent pages.
        setOptions((prev) => (page === 1 ? next : [...prev, ...next]))
        setHasMore(data.length === PAGE_SIZE)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [query, page])

  return (
    <SearchableSelect
      options={options}
      value={value}
      onValueChange={(next) => setValue(next)}
      placeholder="Search users…"
      filterClientSide={false}
      onSearchChange={(q) => {
        // New search: reset to the first page.
        setQuery(q)
        setPage(1)
      }}
      hasMore={hasMore}
      loading={loading}
      onLoadMore={() => setPage((p) => p + 1)}
      searchDebounceMs={300}
    />
  )
}
```

### Capping visible rows (`maxVisibleItems`)

The list shows up to `maxVisibleItems` rows (default `5`) before it scrolls internally.

```typescript
import { SearchableSelect } from '@torch-ui/components'

function CompactList({ options, value, onValueChange }) {
  return (
    <SearchableSelect
      options={options}
      value={value}
      onValueChange={onValueChange}
      maxVisibleItems={3}
    />
  )
}
```

### RTL support

Pass `dir="rtl"` to lay out the input, chevron, and dropdown right-to-left.

```typescript
import { SearchableSelect } from '@torch-ui/components'

function ArabicPicker({ options, value, onValueChange }) {
  return (
    <SearchableSelect
      dir="rtl"
      options={options}
      value={value}
      onValueChange={onValueChange}
      placeholder="ابحث…"
    />
  )
}
```

## API Reference

### SearchableSelect

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `SearchableSelectOption[]` | Required | The list of selectable options. In server mode (`filterClientSide={false}`) these are rendered as-is. |
| `value` | `string \| null` | - | Controlled selected value. The matching option's label is shown as solid text in the input. |
| `onValueChange` | `(value: string, option: SearchableSelectOption) => void` | - | Called when an option is selected. Receives the value and the full option object. |
| `placeholder` | `string` | `'Search…'` | Placeholder text for the search input. |
| `size` | `'XS' \| 'S' \| 'M'` | `'M'` | Field size. |
| `variant` | `'PresentationStyle'` | `'PresentationStyle'` | Visual style variant for the field and dropdown surface. |
| `icon` | `ReactNode` | - | Optional leading icon rendered inside the field. |
| `theme` | `'dark' \| 'light' \| 'default'` | - | Theme variant, applied via `data-theme`. |
| `dir` | `string` | - | Text direction (e.g. `'rtl'`) for the field and dropdown. |
| `className` | `string` | - | Additional CSS classes for the field group. |
| `filterClientSide` | `boolean` | `true` | When `true`, filters `options` locally by label. Set `false` for server-side search — `options` are rendered as-is and refetched via `onSearchChange`. |
| `onSearchChange` | `(query: string) => void` | - | Called (debounced) with the trimmed query as the user types. Refetch your data here for server-side search. |
| `searchDebounceMs` | `number` | `300` | Debounce delay (ms) before `onSearchChange` fires. |
| `hasMore` | `boolean` | `false` | Whether more pages are available; gates the infinite-scroll loader. |
| `loading` | `boolean` | `false` | Whether a fetch is in flight; shows a loading row and blocks `onLoadMore`. |
| `onLoadMore` | `() => void` | - | Called when the scroll viewport nears the bottom and `hasMore && !loading`. |
| `maxVisibleItems` | `number` | `5` | Maximum rows visible before the list scrolls internally. |

### SearchableSelectOption

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | Required | Unique value for the option; matched against the `value` prop. |
| `label` | `string` | Required | Display text; also used for client-side label filtering. |
| `icon` | `ReactNode` | - | Optional leading icon rendered in the row. |

## TypeScript

### Type Definitions

```typescript
import { ReactNode } from 'react'

export interface SearchableSelectOption {
  value: string
  label: string
  icon?: ReactNode
}

interface SearchableSelectProps {
  options: SearchableSelectOption[]
  value?: string | null
  onValueChange?: (value: string, option: SearchableSelectOption) => void
  placeholder?: string
  size?: 'XS' | 'S' | 'M'
  variant?: 'PresentationStyle'
  icon?: ReactNode
  theme?: 'dark' | 'light' | 'default'
  dir?: string
  className?: string

  // Async / backend pagination (all optional; static `options` still work)
  filterClientSide?: boolean
  onSearchChange?: (query: string) => void
  searchDebounceMs?: number
  hasMore?: boolean
  loading?: boolean
  onLoadMore?: () => void
  maxVisibleItems?: number
}

export function SearchableSelect(props: SearchableSelectProps): JSX.Element
```

## Common Patterns

### With React Query (`useInfiniteQuery`)

React Query's `useInfiniteQuery` maps cleanly onto the controlled async props. Track the debounced query in state, flatten pages into `options`, and wire `fetchNextPage`/`hasNextPage`/`isFetching` to `onLoadMore`/`hasMore`/`loading`.

```typescript
import { SearchableSelect } from '@torch-ui/components'
import type { SearchableSelectOption } from '@torch-ui/components'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

function UserPicker() {
  const [value, setValue] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['users', query],
    queryFn: ({ pageParam = 1 }) =>
      fetch(`/api/users?q=${query}&page=${pageParam}`).then((r) => r.json()),
    getNextPageParam: (lastPage, pages) =>
      lastPage.length ? pages.length + 1 : undefined,
    initialPageParam: 1,
  })

  const options: SearchableSelectOption[] = useMemo(
    () =>
      (data?.pages.flat() ?? []).map((u: { id: string; name: string }) => ({
        value: u.id,
        label: u.name,
      })),
    [data]
  )

  return (
    <SearchableSelect
      options={options}
      value={value}
      onValueChange={setValue}
      filterClientSide={false}
      onSearchChange={setQuery}
      hasMore={Boolean(hasNextPage)}
      loading={isFetching}
      onLoadMore={() => fetchNextPage()}
    />
  )
}
```

### With SWR (`useSWRInfinite`)

The same shape works with SWR's `useSWRInfinite` — increment `size` in `onLoadMore`, flatten the page array into `options`, and derive `hasMore` from the last page length.

```typescript
import { SearchableSelect } from '@torch-ui/components'
import useSWRInfinite from 'swr/infinite'
import { useState } from 'react'

const PAGE_SIZE = 20

function UserPicker() {
  const [value, setValue] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const { data, size, setSize, isValidating } = useSWRInfinite(
    (index) => `/api/users?q=${query}&page=${index + 1}&size=${PAGE_SIZE}`,
    (url) => fetch(url).then((r) => r.json())
  )

  const pages = data ?? []
  const options = pages
    .flat()
    .map((u: { id: string; name: string }) => ({ value: u.id, label: u.name }))
  const hasMore = pages.length > 0 && pages[pages.length - 1].length === PAGE_SIZE

  return (
    <SearchableSelect
      options={options}
      value={value}
      onValueChange={setValue}
      filterClientSide={false}
      onSearchChange={(q) => {
        setQuery(q)
        setSize(1)
      }}
      hasMore={hasMore}
      loading={isValidating}
      onLoadMore={() => setSize(size + 1)}
    />
  )
}
```

## Accessibility

- **Focus opens the dropdown**: focusing the input opens the list and clears any in-progress search so the user can type freely.
- **Type to filter**: typing updates the query. With `filterClientSide={true}` (default) options filter locally by label; otherwise the debounced `onSearchChange` drives a server refetch.
- **Chevron toggle**: a boxed icon `Button` toggles the dropdown open/closed and flips (rotates 180°) to reflect state. It is `tabIndex={-1}` and exposes a dynamic `aria-label` of `"Open"` / `"Close"`.
- **Single-select**: clicking a row selects it, closes the dropdown, and shows the option's label as solid text in the input. The selected row is marked with a check icon and `data-highlighted`.
- **Infinite scroll**: the scroll viewport calls `onLoadMore` when it nears the bottom (within ~80px) and `hasMore && !loading`. A `LoadingIcon` row is shown while `loading` is true.
- **Empty state**: when no options match and nothing is loading, a "No results found" message is shown.
- **Rows match DropdownMenu items**: option rows reuse `MenuItemStyles`, so they look and behave like `DropdownMenuItem` entries.

## Best Practices

1. **Always control `value`** — pass `value` and `onValueChange` so the input can display the selected label.
   ```typescript
   <SearchableSelect value={value} onValueChange={setValue} options={options} />
   ```

2. **Disable client filtering for server search** — set `filterClientSide={false}` whenever you refetch in `onSearchChange`, otherwise local filtering will hide server results.

3. **Reset to the first page on a new query** — in `onSearchChange`, set your page back to `1` (or `setSize(1)`) before refetching so paginated results don't mix searches.

4. **Report `loading` accurately** — `onLoadMore` is blocked while `loading` is `true`, which prevents duplicate page fetches during scroll.

5. **Gate pagination with `hasMore`** — only set `hasMore` when the backend confirms another page exists, so the loader stops at the end of the list.

6. **Tune `searchDebounceMs`** — increase it for expensive endpoints to reduce request volume; lower it for snappy local-backed APIs.

7. **Cap the visible list with `maxVisibleItems`** — keep the dropdown compact for long lists; the rest scrolls internally.

## Related Components

- [Select](./select.md) - Standard form select field
- [SearchableTable](./searchable-table.md) - Searchable table with the same focus-to-open behavior
- [DropdownMenu](./dropdown-menu.md) - Menu surface and item styling reused by the rows
- [BadgeField](./badge-field.md) - Multi-value tag/badge input field
