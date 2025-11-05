---
name: SearchField
version: 1.1.15
status: stable
category: components/forms
tags: [form, search, input, field, system-style, glassmorphism]
last-reviewed: 2024-11-05
bundle-size: 3.2kb
dependencies:
  - "@/components/InputField": "internal"
---

# SearchField

> A specialized search input component with glassmorphic styling, system theme, and custom placeholder behavior. Built on InputField with search-specific enhancements and visual effects.

## Installation

```bash
npm install torch-glare
```

## Import

```typescript
import { SearchField } from 'torch-glare/lib/components/SearchField'
```

## Quick Examples

### Basic Usage

```typescript
import { SearchField } from 'torch-glare/lib/components/SearchField'

function Example() {
  const [search, setSearch] = useState('')

  return (
    <SearchField
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      Searchplaceholder="Search"
      secondaryPlaceholder="Type to search..."
    />
  )
}
```

### With Clear Button

```typescript
function SearchWithClear() {
  const [search, setSearch] = useState('')

  const handleClear = () => {
    setSearch('')
  }

  return (
    <SearchField
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      Searchplaceholder="Search products"
      secondaryPlaceholder="by name, category..."
      childrenSide={
        search && (
          <button
            onClick={handleClear}
            className="p-2 text-gray-400 hover:text-white"
          >
            <i className="ri-close-line text-lg" />
          </button>
        )
      }
    />
  )
}
```

### Global Search

```typescript
function GlobalSearch() {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!search) {
      setResults([])
      return
    }

    setLoading(true)
    const timer = setTimeout(() => {
      // Simulate search
      setResults([
        { type: 'page', title: 'Dashboard', path: '/dashboard' },
        { type: 'user', title: 'John Doe', path: '/users/john' },
        { type: 'setting', title: 'Profile Settings', path: '/settings' }
      ])
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  return (
    <SearchField
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      Searchplaceholder="Search everywhere"
      secondaryPlaceholder="Pages, users, settings..."
      childrenSide={
        loading && (
          <div className="p-2">
            <i className="ri-loader-4-line animate-spin text-gray-400" />
          </div>
        )
      }
      popoverChildren={
        results.length > 0 && (
          <div className="py-2">
            {results.map((result, i) => (
              <a
                key={i}
                href={result.path}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800"
              >
                <i className={`ri-${result.type}-line text-gray-400`} />
                <span>{result.title}</span>
              </a>
            ))}
          </div>
        )
      }
    />
  )
}
```

### Command Palette

```typescript
function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [command, setCommand] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50">
      <div className="w-full max-w-2xl">
        <SearchField
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          Searchplaceholder="Run command"
          secondaryPlaceholder="or search..."
          autoFocus
          childrenSide={
            <span className="text-xs text-gray-500 px-2">ESC</span>
          }
        />
      </div>
    </div>
  )
}
```

### Live Search

```typescript
function LiveSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [debounced] = useDebounce(query, 300)

  useEffect(() => {
    if (debounced) {
      fetchResults(debounced).then(setResults)
    } else {
      setResults([])
    }
  }, [debounced])

  return (
    <div>
      <SearchField
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        Searchplaceholder="Live search"
        secondaryPlaceholder="Results update as you type"
      />

      {results.length > 0 && (
        <div className="mt-4 space-y-2">
          {results.map((result, i) => (
            <div key={i} className="p-3 bg-gray-800 rounded">
              {result.title}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

### Filter Search

```typescript
function FilteredSearch() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  return (
    <div className="space-y-4">
      <SearchField
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        Searchplaceholder={`Search ${filter}`}
        secondaryPlaceholder="Start typing..."
        childrenSide={
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent text-sm text-gray-400"
          >
            <option value="all">All</option>
            <option value="users">Users</option>
            <option value="posts">Posts</option>
            <option value="files">Files</option>
          </select>
        }
      />
    </div>
  )
}
```

## API Reference

### SearchField Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `Searchplaceholder` | `ReactNode` | - | Primary placeholder content |
| `secondaryPlaceholder` | `ReactNode` | - | Secondary placeholder text |
| `childrenSide` | `ReactNode` | - | Trailing content (buttons, icons) |
| `value` | `string \| number` | - | Input value |
| `onChange` | `(e: ChangeEvent) => void` | - | Change handler |
| `popoverChildren` | `ReactNode` | - | Dropdown content |
| `errorMessage` | `string` | - | Error message |
| `disabled` | `boolean` | `false` | Disables the input |

Plus all props from InputField component.

### TypeScript

```typescript
interface SearchFieldProps extends InputFieldProps {
  Searchplaceholder?: ReactNode
  secondaryPlaceholder?: ReactNode
  childrenSide?: ReactNode
}

export const SearchField: React.ForwardRefExoticComponent<SearchFieldProps>
```

## Common Patterns

### File Explorer Search

```typescript
function FileExplorerSearch() {
  const [search, setSearch] = useState('')
  const [scope, setScope] = useState('current')

  const files = [
    { name: 'index.tsx', type: 'typescript', size: '2.4kb' },
    { name: 'styles.css', type: 'css', size: '1.2kb' },
    { name: 'README.md', type: 'markdown', size: '4.5kb' }
  ]

  const filtered = files.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <SearchField
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        Searchplaceholder="Find files"
        secondaryPlaceholder={`in ${scope} folder`}
        childrenSide={
          <div className="flex items-center gap-1">
            <button
              onClick={() => setScope('current')}
              className={`px-2 py-1 text-xs ${
                scope === 'current' ? 'text-blue-400' : 'text-gray-500'
              }`}
            >
              Current
            </button>
            <button
              onClick={() => setScope('all')}
              className={`px-2 py-1 text-xs ${
                scope === 'all' ? 'text-blue-400' : 'text-gray-500'
              }`}
            >
              All
            </button>
          </div>
        }
      />

      <div className="mt-4">
        {filtered.map((file, i) => (
          <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-800">
            <i className={`ri-file-${file.type}-line`} />
            <span>{file.name}</span>
            <span className="text-xs text-gray-500 ml-auto">{file.size}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### User Search

```typescript
function UserSearch() {
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState([])
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    if (search) {
      // Fetch users based on search
      fetchUsers(search).then(setUsers)
    }
  }, [search])

  return (
    <div>
      <SearchField
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        Searchplaceholder="Find team members"
        secondaryPlaceholder="by name or email"
        popoverChildren={
          users.length > 0 && (
            <div className="py-2">
              {users.map(user => (
                <button
                  key={user.id}
                  onClick={() => {
                    if (selected.includes(user.id)) {
                      setSelected(selected.filter(id => id !== user.id))
                    } else {
                      setSelected([...selected, user.id])
                    }
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-800"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1 text-left">
                    <div>{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                  {selected.includes(user.id) && (
                    <i className="ri-check-line text-green-500" />
                  )}
                </button>
              ))}
            </div>
          )
        }
      />

      {selected.length > 0 && (
        <div className="mt-4">
          Selected: {selected.length} users
        </div>
      )}
    </div>
  )
}
```

### Navigation Search

```typescript
function NavigationSearch() {
  const [search, setSearch] = useState('')
  const router = useRouter()

  const pages = [
    { title: 'Dashboard', path: '/', icon: 'dashboard' },
    { title: 'Profile', path: '/profile', icon: 'user' },
    { title: 'Settings', path: '/settings', icon: 'settings' },
    { title: 'Analytics', path: '/analytics', icon: 'bar-chart' },
    { title: 'Reports', path: '/reports', icon: 'file-text' }
  ]

  const filtered = pages.filter(page =>
    page.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (path: string) => {
    router.push(path)
    setSearch('')
  }

  return (
    <SearchField
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      Searchplaceholder="Go to"
      secondaryPlaceholder="⌘K"
      popoverChildren={
        filtered.length > 0 && (
          <div className="py-2">
            {filtered.map(page => (
              <button
                key={page.path}
                onClick={() => handleSelect(page.path)}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-800"
              >
                <i className={`ri-${page.icon}-line text-gray-400`} />
                <span>{page.title}</span>
                <span className="ml-auto text-xs text-gray-500">
                  {page.path}
                </span>
              </button>
            ))}
          </div>
        )
      }
    />
  )
}
```

## Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { SearchField } from 'torch-glare/lib/components/SearchField'

describe('SearchField', () => {
  it('displays placeholder text when empty', () => {
    render(
      <SearchField
        value=""
        Searchplaceholder="Search"
        secondaryPlaceholder="Type here"
      />
    )

    expect(screen.getByText('Search')).toBeInTheDocument()
    expect(screen.getByText('Type here')).toBeInTheDocument()
  })

  it('hides placeholder when value exists', () => {
    render(
      <SearchField
        value="test"
        Searchplaceholder="Search"
      />
    )

    expect(screen.queryByText('Search')).not.toBeInTheDocument()
  })

  it('shows search icon', () => {
    const { container } = render(<SearchField value="" />)

    const icon = container.querySelector('.ri-search-2-line')
    expect(icon).toBeInTheDocument()
  })

  it('handles input changes', () => {
    const handleChange = jest.fn()
    render(
      <SearchField
        value=""
        onChange={handleChange}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })

    expect(handleChange).toHaveBeenCalled()
  })
})
```

### Accessibility Test

```typescript
import { axe } from '@axe-core/react'

test('SearchField meets WCAG standards', async () => {
  const { container } = render(
    <SearchField
      value=""
      Searchplaceholder="Search"
      aria-label="Search input"
    />
  )

  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## Accessibility

### Features

- Search icon clearly indicates purpose
- Custom placeholder behavior for better UX
- Inherits InputField accessibility features
- Keyboard navigation support

### Keyboard Support

- **Tab**: Focus search field
- **Escape**: Clear search (with implementation)
- **Enter**: Submit search
- **Cmd/Ctrl + K**: Common shortcut for search

### Screen Reader Support

```typescript
<SearchField
  aria-label="Search"
  aria-describedby="search-help"
  role="searchbox"
/>
<span id="search-help" className="sr-only">
  Press Enter to search
</span>
```

## Styling

### Glassmorphic Design

The component features a glassmorphic design with:

```css
/* Default glassmorphic styles */
.search-wrapper {
  background: rgba(106, 112, 144, 0.60);
  backdrop-filter: blur(21px);
  box-shadow: 0px 0px 18px 0px rgba(0, 0, 0, 0.75);
}

.search-input {
  background: rgba(0, 0, 0, 0.60);
  border-radius: 9px;
}
```

### Custom Theming

```typescript
// The component uses SystemStyle variant by default
// Customize via className prop
<SearchField
  className="custom-search-styles"
  // Glassmorphic wrapper is built-in
/>
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (gzip) | 3.2kb |
| First render | <8ms |
| Re-render | <3ms |
| Tree-shakeable | ✅ |

### Optimization Tips

1. Debounce search queries
2. Use React.memo for result lists
3. Implement virtual scrolling for large result sets
4. Cache search results
5. Use loading states for async operations

## Migration

### From InputField

```diff
// From InputField with search icon
- <InputField
-   icon={<i className="ri-search-line" />}
-   placeholder="Search..."
- />

// To SearchField
+ <SearchField
+   Searchplaceholder="Search"
+   secondaryPlaceholder="..."
+ />
```

## Troubleshooting

### Placeholder not showing

**Solution:** Check value is empty string, not undefined

```typescript
// ✅ Correct
<SearchField value="" />

// ❌ Wrong - placeholder won't show correctly
<SearchField value={undefined} />
```

### Glassmorphic effect not visible

**Solution:** Ensure parent has appropriate background

```typescript
// Parent needs content behind for blur effect
<div className="relative">
  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500" />
  <SearchField />
</div>
```

## Related Components

- [InputField](/docs/components/input-field.md) - Base component
- [Input](/docs/components/input.md) - Basic input
- [Select](/docs/components/select.md) - Dropdown selection
- [Command](/docs/components/command.md) - Command palette

## Browser Support

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile browsers ✅

Note: Backdrop filter has limited support in older browsers.

## Changelog

### v1.1.15
- Added glassmorphic styling
- Enhanced placeholder behavior
- System theme integration

### v1.1.14
- Initial SearchField implementation
- Based on InputField

### v1.1.0
- Component planning phase