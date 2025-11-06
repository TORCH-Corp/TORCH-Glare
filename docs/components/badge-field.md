---
title: BadgeField
description: Interactive input field with tag selection, search filtering, and keyboard navigation for multi-select scenarios.
component: true
group: Data Display
keywords: [badge, field, tags, multi-select, input, chips, tokens, autocomplete]
---

# BadgeField

An advanced tag selection input component that combines badges with search functionality. Features keyboard navigation, filtering, and multi-select capabilities with a popover dropdown.

## Installation

```bash
npx torch-cli add badge-field
```

**Dependencies**: Requires Popover, Tooltip, Badge, and Input components.

## Imports

```typescript
import { BadgeField } from '@/components/BadgeField'
import type { Tag } from '@/hooks/useTagSelection'
```

## Basic Usage

```tsx
import { BadgeField } from '@/components/BadgeField'
import { useState } from 'react'

export function BasicBadgeField() {
  const [tags] = useState([
    { id: '1', name: 'React', variant: 'blue' },
    { id: '2', name: 'TypeScript', variant: 'bluePurple' },
    { id: '3', name: 'Next.js', variant: 'navy' },
  ])

  return (
    <BadgeField
      tags={tags}
      placeholder="Select technologies..."
      size="M"
    />
  )
}
```

## Examples

### Technology Stack Selector

Select multiple technologies with search.

```tsx
export function TechnologySelector() {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])

  const allTags: Tag[] = [
    { id: '1', name: 'React', variant: 'blue' },
    { id: '2', name: 'TypeScript', variant: 'bluePurple' },
    { id: '3', name: 'Next.js', variant: 'navy' },
    { id: '4', name: 'Tailwind CSS', variant: 'cocktailGreen' },
    { id: '5', name: 'Node.js', variant: 'green' },
    { id: '6', name: 'PostgreSQL', variant: 'blue' },
    { id: '7', name: 'MongoDB', variant: 'greenLight' },
    { id: '8', name: 'GraphQL', variant: 'purple' },
    { id: '9', name: 'REST API', variant: 'gray' },
    { id: '10', name: 'Docker', variant: 'blue' },
  ]

  return (
    <div className="max-w-2xl">
      <label className="block mb-2 font-medium">
        Select Your Tech Stack
      </label>

      <BadgeField
        tags={allTags}
        placeholder="Search technologies..."
        size="M"
        onValueChange={setSelectedTags}
      />

      <div className="mt-4">
        <p className="text-sm text-content-presentation-global-secondary">
          Selected: {selectedTags.length} technologies
        </p>
      </div>
    </div>
  )
}
```

### Category Filter

Filter content by multiple categories.

```tsx
export function CategoryFilter() {
  const categories: Tag[] = [
    { id: 'design', name: 'Design', variant: 'purple' },
    { id: 'development', name: 'Development', variant: 'blue' },
    { id: 'marketing', name: 'Marketing', variant: 'yellow' },
    { id: 'sales', name: 'Sales', variant: 'green' },
    { id: 'support', name: 'Support', variant: 'redOrange' },
    { id: 'hr', name: 'Human Resources', variant: 'rose' },
    { id: 'finance', name: 'Finance', variant: 'navy' },
  ]

  const [selectedCategories, setSelectedCategories] = useState<Tag[]>([])

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-2">Filter by Category</h3>
        <BadgeField
          tags={categories}
          placeholder="Select categories to filter..."
          size="M"
          onValueChange={setSelectedCategories}
        />
      </div>

      <div className="p-4 border rounded-lg">
        <h4 className="font-medium mb-2">Filtered Results</h4>
        {selectedCategories.length === 0 ? (
          <p className="text-sm text-content-presentation-global-secondary">
            Select categories to filter results
          </p>
        ) : (
          <p className="text-sm">
            Showing results for: {selectedCategories.map(c => c.name).join(', ')}
          </p>
        )}
      </div>
    </div>
  )
}
```

### Skills Selector

Multi-select skills for job applications or profiles.

```tsx
export function SkillsSelector() {
  const skills: Tag[] = [
    { id: 'js', name: 'JavaScript', variant: 'yellow' },
    { id: 'ts', name: 'TypeScript', variant: 'blue' },
    { id: 'react', name: 'React', variant: 'blue' },
    { id: 'vue', name: 'Vue.js', variant: 'green' },
    { id: 'angular', name: 'Angular', variant: 'redLight' },
    { id: 'node', name: 'Node.js', variant: 'greenLight' },
    { id: 'python', name: 'Python', variant: 'blue' },
    { id: 'java', name: 'Java', variant: 'redOrange' },
    { id: 'go', name: 'Go', variant: 'cocktailGreen' },
    { id: 'rust', name: 'Rust', variant: 'redOrange' },
    { id: 'sql', name: 'SQL', variant: 'navy' },
    { id: 'nosql', name: 'NoSQL', variant: 'green' },
    { id: 'aws', name: 'AWS', variant: 'yellow' },
    { id: 'azure', name: 'Azure', variant: 'blue' },
    { id: 'gcp', name: 'Google Cloud', variant: 'blue' },
  ]

  const [selectedSkills, setSelectedSkills] = useState<Tag[]>([])

  return (
    <form className="max-w-2xl space-y-4">
      <div>
        <label className="block mb-2 font-medium">
          Your Skills
          <span className="text-content-presentation-global-secondary text-sm ml-2">
            (Select all that apply)
          </span>
        </label>

        <BadgeField
          tags={skills}
          placeholder="Type to search skills..."
          size="M"
          onValueChange={setSelectedSkills}
        />
      </div>

      <div className="p-4 bg-background-presentation-global-secondary rounded-lg">
        <h4 className="font-medium mb-2">Selected Skills ({selectedSkills.length})</h4>
        {selectedSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map(skill => (
              <span key={skill.id} className="text-sm">
                {skill.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-content-presentation-global-secondary">
            No skills selected yet
          </p>
        )}
      </div>
    </form>
  )
}
```

### Project Tags

Tag management for projects with custom variants.

```tsx
export function ProjectTags() {
  const projectTags: Tag[] = [
    { id: '1', name: 'High Priority', variant: 'redLight' },
    { id: '2', name: 'In Progress', variant: 'blue' },
    { id: '3', name: 'Completed', variant: 'green' },
    { id: '4', name: 'On Hold', variant: 'yellow' },
    { id: '5', name: 'Needs Review', variant: 'purple' },
    { id: '6', name: 'Client Approval', variant: 'bluePurple' },
    { id: '7', name: 'Internal', variant: 'gray' },
    { id: '8', name: 'External', variant: 'navy' },
    { id: '9', name: 'Urgent', variant: 'redOrange' },
    { id: '10', name: 'Can Wait', variant: 'greenLight' },
  ]

  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    tags: [] as Tag[]
  })

  return (
    <form className="max-w-2xl space-y-4">
      <div>
        <label className="block mb-2">Project Name</label>
        <InputField
          value={projectData.name}
          onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
          placeholder="Enter project name"
        />
      </div>

      <div>
        <label className="block mb-2">Description</label>
        <TextAreaInput
          value={projectData.description}
          onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
          placeholder="Enter project description"
          rows={3}
        />
      </div>

      <div>
        <label className="block mb-2">Tags</label>
        <BadgeField
          tags={projectTags}
          placeholder="Add project tags..."
          size="M"
          onValueChange={(tags) => setProjectData({ ...projectData, tags })}
        />
      </div>

      <Button variant="PrimeStyle">Create Project</Button>
    </form>
  )
}
```

### Different Sizes

BadgeField in various sizes.

```tsx
export function BadgeFieldSizes() {
  const tags: Tag[] = [
    { id: '1', name: 'Small', variant: 'blue' },
    { id: '2', name: 'Medium', variant: 'green' },
    { id: '3', name: 'Large', variant: 'purple' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <label className="block mb-2 text-sm">Extra Small (XS)</label>
        <BadgeField tags={tags} size="XS" placeholder="XS size..." />
      </div>

      <div>
        <label className="block mb-2">Small (S)</label>
        <BadgeField tags={tags} size="S" placeholder="S size..." />
      </div>

      <div>
        <label className="block mb-2">Medium (M)</label>
        <BadgeField tags={tags} size="M" placeholder="M size..." />
      </div>
    </div>
  )
}
```

### With Icons and Actions

Badge field with custom icons and action buttons.

```tsx
export function BadgeFieldWithIcon() {
  const tags: Tag[] = [
    { id: '1', name: 'JavaScript', variant: 'yellow' },
    { id: '2', name: 'Python', variant: 'blue' },
    { id: '3', name: 'Ruby', variant: 'redLight' },
  ]

  return (
    <BadgeField
      tags={tags}
      size="M"
      placeholder="Select programming languages..."
      icon={<i className="ri-code-line"></i>}
      actionButton={
        <ActionButton size="S" title="Clear all">
          <i className="ri-close-line"></i>
        </ActionButton>
      }
    />
  )
}
```

### With Error State

Display validation errors with tooltip.

```tsx
export function BadgeFieldWithError() {
  const [tags, setTags] = useState<Tag[]>([])
  const [error, setError] = useState('')

  const availableTags: Tag[] = [
    { id: '1', name: 'Option 1', variant: 'blue' },
    { id: '2', name: 'Option 2', variant: 'green' },
    { id: '3', name: 'Option 3', variant: 'purple' },
  ]

  const handleChange = (newTags: Tag[]) => {
    setTags(newTags)
    if (newTags.length === 0) {
      setError('Please select at least one option')
    } else if (newTags.length > 3) {
      setError('Maximum 3 options allowed')
    } else {
      setError('')
    }
  }

  return (
    <div>
      <label className="block mb-2">
        Required Selection
        <span className="text-red-500 ml-1">*</span>
      </label>

      <BadgeField
        tags={availableTags}
        size="M"
        placeholder="Select options (1-3)..."
        onValueChange={handleChange}
        errorMessage={error}
        toolTipSide="right"
      />
    </div>
  )
}
```

### Email Recipients

Tag-style email recipient selector.

```tsx
export function EmailRecipients() {
  const contacts: Tag[] = [
    { id: '1', name: 'john@example.com', variant: 'blue' },
    { id: '2', name: 'jane@example.com', variant: 'green' },
    { id: '3', name: 'team@example.com', variant: 'purple' },
    { id: '4', name: 'support@example.com', variant: 'navy' },
  ]

  const [recipients, setRecipients] = useState<Tag[]>([])

  return (
    <form className="max-w-2xl space-y-4">
      <div>
        <label className="block mb-2">To:</label>
        <BadgeField
          tags={contacts}
          placeholder="Add recipients..."
          size="M"
          onValueChange={setRecipients}
          icon={<i className="ri-user-add-line"></i>}
        />
      </div>

      <div>
        <label className="block mb-2">Subject:</label>
        <InputField placeholder="Email subject" />
      </div>

      <div>
        <label className="block mb-2">Message:</label>
        <TextAreaInput placeholder="Type your message..." rows={6} />
      </div>

      <Button variant="PrimeStyle" disabled={recipients.length === 0}>
        <i className="ri-send-plane-line mr-2"></i>
        Send to {recipients.length} recipient{recipients.length !== 1 ? 's' : ''}
      </Button>
    </form>
  )
}
```

### Variants

System and Presentation style variants.

```tsx
export function BadgeFieldVariants() {
  const tags: Tag[] = [
    { id: '1', name: 'Tag 1', variant: 'blue' },
    { id: '2', name: 'Tag 2', variant: 'green' },
    { id: '3', name: 'Tag 3', variant: 'purple' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2">System Style</h3>
        <BadgeField
          tags={tags}
          variant="SystemStyle"
          placeholder="System style variant..."
        />
      </div>

      <div>
        <h3 className="font-semibold mb-2">Presentation Style</h3>
        <BadgeField
          tags={tags}
          variant="PresentationStyle"
          placeholder="Presentation style variant..."
        />
      </div>
    </div>
  )
}
```

## API Reference

### BadgeField Props

Extends all Input element props (except size and variant).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| tags | `Tag[]` | **Required** | Available tags to select from |
| onValueChange | `(tags: Tag[]) => void` | - | Callback when selection changes |
| size | `'XS' \| 'S' \| 'M'` | `'M'` | Field size |
| variant | `'SystemStyle' \| 'PresentationStyle'` | `'PresentationStyle'` | Visual variant |
| icon | `ReactNode` | - | Leading icon |
| errorMessage | `string` | - | Error message (shows tooltip) |
| onTable | `boolean` | `false` | Table-specific styling |
| toolTipSide | `ToolTipSide` | - | Tooltip position |
| label | `string` | - | Field label |
| required | `boolean` | `false` | Required indicator |
| theme | `Themes` | - | Theme override |
| actionButton | `ReactNode` | - | Trailing action button |
| placeholder | `string` | - | Input placeholder text |

### Tag Type

```typescript
interface Tag {
  id: string
  name: string
  variant?: BadgeVariant
}
```

## Keyboard Navigation

BadgeField includes comprehensive keyboard support:

| Key | Action |
|-----|--------|
| `ArrowDown` | Move focus to next tag in dropdown |
| `ArrowUp` | Move focus to previous tag in dropdown |
| `ArrowLeft` | Move focus to previous selected tag |
| `ArrowRight` | Move focus to next selected tag |
| `Enter` | Select focused tag / Remove focused selected tag |
| `Backspace` | Remove last selected tag when input is empty |
| `Escape` | Close dropdown |
| `Tab` | Close dropdown and move to next field |

## Styling

### Default Styles

- **Container**: Flex wrap with gap
- **Input**: Grows to fill available space
- **Badges**: Displayed inline with remove capability
- **Dropdown**: Popover with filtered tags
- **Focus**: Ring indicator on focused badges

### Customization

```tsx
// Custom width
<BadgeField className="w-full max-w-md" />

// Custom dropdown styling
<PopoverContent className="max-h-64 overflow-y-auto" />
```

## TypeScript Types

```typescript
interface BadgeFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'variant'> {
  size?: 'XS' | 'S' | 'M'
  variant?: 'SystemStyle' | 'PresentationStyle'
  icon?: ReactNode
  errorMessage?: string
  onTable?: boolean
  toolTipSide?: ToolTipSide
  label?: string
  required?: boolean
  theme?: Themes
  actionButton?: ReactNode
  tags: Tag[]
  onValueChange?: (tags: Tag[]) => void
}

interface Tag {
  id: string
  name: string
  variant?: BadgeVariant
}
```

## Common Patterns

### Controlled Component

```tsx
function ControlledBadgeField() {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])

  return (
    <BadgeField
      tags={allTags}
      onValueChange={setSelectedTags}
      placeholder="Select tags..."
    />
  )
}
```

### Form Integration

```tsx
function FormWithBadgeField() {
  const { register, setValue, watch } = useForm()
  const selectedTags = watch('tags', [])

  return (
    <form>
      <BadgeField
        tags={availableTags}
        onValueChange={(tags) => setValue('tags', tags)}
        {...register('tags', { required: true })}
      />
    </form>
  )
}
```

## Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { BadgeField } from '@/components/BadgeField'

describe('BadgeField', () => {
  const mockTags = [
    { id: '1', name: 'Tag 1', variant: 'blue' },
    { id: '2', name: 'Tag 2', variant: 'green' },
  ]

  it('renders placeholder', () => {
    render(
      <BadgeField tags={mockTags} placeholder="Select tags" />
    )

    expect(screen.getByPlaceholderText('Select tags')).toBeInTheDocument()
  })

  it('shows dropdown on focus', () => {
    render(<BadgeField tags={mockTags} />)

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)

    expect(screen.getByText('Tag 1')).toBeInTheDocument()
    expect(screen.getByText('Tag 2')).toBeInTheDocument()
  })

  it('filters tags on search', () => {
    render(<BadgeField tags={mockTags} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Tag 1' } })

    expect(screen.getByText('Tag 1')).toBeInTheDocument()
    expect(screen.queryByText('Tag 2')).not.toBeInTheDocument()
  })

  it('calls onValueChange when tag selected', () => {
    const handleChange = jest.fn()
    render(
      <BadgeField tags={mockTags} onValueChange={handleChange} />
    )

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    fireEvent.click(screen.getByText('Tag 1'))

    expect(handleChange).toHaveBeenCalledWith([mockTags[0]])
  })

  it('removes tag on unselect', () => {
    const handleChange = jest.fn()
    render(
      <BadgeField tags={mockTags} onValueChange={handleChange} />
    )

    // Select tag
    fireEvent.focus(screen.getByRole('textbox'))
    fireEvent.click(screen.getByText('Tag 1'))

    // Remove tag
    const removeButton = screen.getByRole('button', { name: 'Remove badge' })
    fireEvent.click(removeButton)

    expect(handleChange).toHaveBeenLastCalledWith([])
  })
})
```

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **ARIA Labels**: Proper labels for screen readers
- **Focus Management**: Clear focus indicators
- **Screen Reader**: Announces selected/removed tags
- **Error Messages**: Accessible error tooltips
- **Tab Order**: Logical tab navigation

## Performance

- **Filtered Search**: Efficient tag filtering
- **Click Outside**: Optimized outside click detection
- **Memoization**: Selected tags memoized
- **Virtual Scrolling**: Consider for 100+ tags
- **Bundle Size**: ~4 KB gzipped (with dependencies)

## Migration Guide

### From Multi-Select

```tsx
// Before: Standard multi-select
<select multiple>
  <option value="1">Tag 1</option>
  <option value="2">Tag 2</option>
</select>

// After: BadgeField
<BadgeField tags={tags} onValueChange={handleChange} />
```

## Best Practices

1. **Tag Limits**: Consider max selected tags for UX
2. **Search Placeholder**: Provide helpful search hints
3. **Error Handling**: Show clear validation errors
4. **Loading States**: Handle async tag loading
5. **Empty States**: Show message when no tags available
6. **Mobile UX**: Ensure touch-friendly targets
7. **Performance**: Virtualize for large tag lists (100+)
8. **Accessibility**: Always provide clear labels