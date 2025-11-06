---
title: Hooks Reference
description: Custom React hooks for common UI patterns including intersection observation, click outside detection, resizing, and tag selection.
component: Hooks
category: Reference
tags: [hooks, utilities, intersection-observer, click-outside, resize, tag-selection]
related:
  - TreeView
  - Popover
  - TagSelector
---

# Hooks

Custom React hooks that provide reusable functionality for common UI patterns. All hooks follow React best practices and include TypeScript support.

## Available Hooks

- **useActiveTreeItem** - Track the most visible tree item using IntersectionObserver
- **useClickOutside** - Detect clicks outside a referenced element
- **useResize** - Handle element resizing with RTL support
- **useTagSelection** - Manage tag selection state with keyboard navigation

---

## useActiveTreeItem

Tracks which tree item is most visible in the viewport using the IntersectionObserver API. Useful for table of contents, navigation menus, or any scrollable list where you need to highlight the active item.

### Basic Usage

```tsx
import { useActiveTreeItem } from '@torch-ai/torch-glare';

function TableOfContents() {
  const sectionIds = ['intro', 'features', 'api', 'examples'];
  const { activeId } = useActiveTreeItem(sectionIds);

  return (
    <nav>
      {sectionIds.map((id) => (
        <a
          key={id}
          href={`#${id}`}
          className={activeId === id ? 'active' : ''}
        >
          {id}
        </a>
      ))}
    </nav>
  );
}
```

### Documentation Navigation

```tsx
function DocsSidebar() {
  const headingIds = [
    'getting-started',
    'installation',
    'configuration',
    'components',
    'api-reference'
  ];

  const { activeId } = useActiveTreeItem(headingIds);

  return (
    <aside className="sidebar">
      <ul>
        {headingIds.map((id) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={cn(
                'nav-link',
                activeId === id && 'font-semibold text-primary'
              )}
            >
              {id.replace(/-/g, ' ')}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
```

### Multi-Level Navigation

```tsx
interface Section {
  id: string;
  title: string;
  subsections: { id: string; title: string }[];
}

function NestedNavigation({ sections }: { sections: Section[] }) {
  const allIds = sections.flatMap((s) => [
    s.id,
    ...s.subsections.map((sub) => sub.id)
  ]);

  const { activeId } = useActiveTreeItem(allIds);

  return (
    <nav>
      {sections.map((section) => (
        <div key={section.id}>
          <a
            href={`#${section.id}`}
            className={activeId === section.id ? 'active' : ''}
          >
            {section.title}
          </a>
          <ul>
            {section.subsections.map((sub) => (
              <li key={sub.id}>
                <a
                  href={`#${sub.id}`}
                  className={activeId === sub.id ? 'active' : ''}
                >
                  {sub.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
```

### With Smooth Scrolling

```tsx
function SmoothScrollNav() {
  const sectionIds = ['hero', 'about', 'services', 'contact'];
  const { activeId } = useActiveTreeItem(sectionIds);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="sticky top-0">
      {sectionIds.map((id) => (
        <button
          key={id}
          onClick={() => scrollToSection(id)}
          className={cn(
            'nav-button',
            activeId === id && 'active'
          )}
        >
          {id}
        </button>
      ))}
    </nav>
  );
}
```

### API Reference

```typescript
function useActiveTreeItem(itemIds: string[]): {
  activeId: string | null;
}
```

#### Parameters

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `itemIds` | `string[]` | Required | Array of element IDs to observe |

#### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `activeId` | `string \| null` | ID of the most visible element, or null if none are visible |

#### IntersectionObserver Configuration

The hook uses the following configuration:

```typescript
{
  rootMargin: '-10% 0% -5% 0%',
  threshold: [0, 0.25, 0.5, 0.75, 1]
}
```

- **rootMargin**: Creates a detection zone excluding the top 10% and bottom 5% of the viewport
- **threshold**: Tracks visibility at 0%, 25%, 50%, 75%, and 100% intersection points

---

## useClickOutside

Detects clicks outside a referenced element and executes a callback. Perfect for closing dropdowns, modals, popovers, and menus when clicking outside.

### Basic Usage

```tsx
import { useClickOutside } from '@torch-ai/torch-glare';
import { useState } from 'react';

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  return (
    <div ref={ref}>
      <button onClick={() => setIsOpen(!isOpen)}>
        Toggle Menu
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      )}
    </div>
  );
}
```

### Modal Dialog

```tsx
function Modal({ isOpen, onClose, children }: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const modalRef = useClickOutside<HTMLDivElement>(onClose);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div ref={modalRef} className="modal-content">
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
```

### Context Menu

```tsx
function ContextMenu() {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const menuRef = useClickOutside<HTMLDivElement>(() => setPosition(null));

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div onContextMenu={handleContextMenu}>
      <p>Right-click me</p>

      {position && (
        <div
          ref={menuRef}
          className="context-menu"
          style={{ top: position.y, left: position.x }}
        >
          <button>Copy</button>
          <button>Paste</button>
          <button>Delete</button>
        </div>
      )}
    </div>
  );
}
```

### With Click Inside Callback

```tsx
function TooltipWithTracking() {
  const [isOpen, setIsOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const ref = useClickOutside<HTMLDivElement>(
    () => {
      setIsOpen(false);
      console.log('Clicked outside');
    },
    () => {
      setClickCount((prev) => prev + 1);
      console.log('Clicked inside');
    }
  );

  return (
    <div ref={ref}>
      <button onClick={() => setIsOpen(!isOpen)}>
        Show Tooltip ({clickCount} clicks)
      </button>
      {isOpen && (
        <div className="tooltip">
          This is a tooltip
        </div>
      )}
    </div>
  );
}
```

### Custom Popover

```tsx
function Popover({ trigger, content }: {
  trigger: React.ReactNode;
  content: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useClickOutside<HTMLDivElement>(
    () => setIsOpen(false)
  );

  return (
    <div ref={popoverRef} className="relative">
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-10">
          {content}
        </div>
      )}
    </div>
  );
}
```

### API Reference

```typescript
function useClickOutside<T extends HTMLElement>(
  callback: (event?: MouseEvent | PointerEvent) => void,
  otherwise?: (event?: MouseEvent | PointerEvent) => void
): React.RefObject<T>
```

#### Parameters

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `callback` | `(event?: MouseEvent \| PointerEvent) => void` | Required | Function to call when clicking outside the element |
| `otherwise` | `(event?: MouseEvent \| PointerEvent) => void` | `undefined` | Optional function to call when clicking inside the element |

#### Return Value

Returns a `React.RefObject<T>` that should be attached to the element you want to monitor.

#### Events Monitored

- `mousedown` - Standard mouse click
- `pointerdown` - Touch and stylus events

---

## useResize

Handles element resizing with support for both mouse and touch events, including RTL (right-to-left) layout support. Perfect for resizable panels, sidebars, and split views.

### Basic Usage

```tsx
import { useResize } from '@torch-ai/torch-glare';
import { useRef } from 'react';

function ResizablePanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const { width, isResizing, handleStartResize } = useResize(panelRef);

  return (
    <div className="flex">
      <div
        ref={panelRef}
        style={{ width: width ? `${width}px` : '300px' }}
        className={cn('panel', isResizing && 'resizing')}
      >
        <p>Resizable Panel</p>
      </div>

      <div
        onMouseDown={handleStartResize}
        onTouchStart={handleStartResize}
        className="resize-handle"
      >
        <div className="resize-bar" />
      </div>

      <div className="flex-1">
        <p>Main Content</p>
      </div>
    </div>
  );
}
```

### Split View

```tsx
function SplitView({ left, right }: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  const leftRef = useRef<HTMLDivElement>(null);
  const { width, isResizing, handleStartResize } = useResize(leftRef);

  return (
    <div className="flex h-screen">
      <div
        ref={leftRef}
        style={{ width: width ? `${width}px` : '50%' }}
        className="overflow-auto"
      >
        {left}
      </div>

      <div
        onMouseDown={handleStartResize}
        onTouchStart={handleStartResize}
        className={cn(
          'w-1 bg-gray-300 cursor-col-resize hover:bg-blue-500',
          isResizing && 'bg-blue-500'
        )}
      />

      <div className="flex-1 overflow-auto">
        {right}
      </div>
    </div>
  );
}
```

### Resizable Sidebar

```tsx
function ResizableSidebar() {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { width, isResizing, handleStartResize } = useResize(sidebarRef);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const effectiveWidth = isCollapsed ? 0 : (width || 250);

  return (
    <div className="flex">
      <aside
        ref={sidebarRef}
        style={{ width: `${effectiveWidth}px` }}
        className={cn(
          'sidebar transition-all',
          isResizing && 'transition-none'
        )}
      >
        <nav>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </aside>

      {!isCollapsed && (
        <div
          onMouseDown={handleStartResize}
          onTouchStart={handleStartResize}
          className="resize-handle"
        >
          <svg className="resize-icon" />
        </div>
      )}

      <div className="flex-1">
        <button onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? '→' : '←'}
        </button>
        <main>Content</main>
      </div>
    </div>
  );
}
```

### Code Editor Layout

```tsx
function CodeEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);

  const editorResize = useResize(editorRef);
  const consoleResize = useResize(consoleRef);

  return (
    <div className="flex flex-col h-screen">
      {/* Top: Code Editor */}
      <div
        ref={editorRef}
        style={{ height: editorResize.width ? `${editorResize.width}px` : '60%' }}
      >
        <textarea className="w-full h-full" placeholder="Write code..." />
      </div>

      {/* Horizontal Resize Handle */}
      <div
        onMouseDown={editorResize.handleStartResize}
        className={cn(
          'h-1 bg-gray-300 cursor-row-resize',
          editorResize.isResizing && 'bg-blue-500'
        )}
      />

      {/* Bottom: Split Console */}
      <div className="flex flex-1">
        <div
          ref={consoleRef}
          style={{ width: consoleResize.width ? `${consoleResize.width}px` : '50%' }}
        >
          <div className="console">Output</div>
        </div>

        <div
          onMouseDown={consoleResize.handleStartResize}
          className="w-1 bg-gray-300 cursor-col-resize"
        />

        <div className="flex-1">
          <div className="console">Errors</div>
        </div>
      </div>
    </div>
  );
}
```

### With Min/Max Constraints

```tsx
function ConstrainedResize() {
  const panelRef = useRef<HTMLDivElement>(null);
  const { width, isResizing, handleStartResize } = useResize(panelRef);

  const MIN_WIDTH = 200;
  const MAX_WIDTH = 600;
  const constrainedWidth = width
    ? Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, width))
    : 300;

  return (
    <div className="flex">
      <div
        ref={panelRef}
        style={{ width: `${constrainedWidth}px` }}
        className="panel"
      >
        <p>Width: {constrainedWidth}px</p>
        <p>Min: {MIN_WIDTH}px, Max: {MAX_WIDTH}px</p>
      </div>

      <div
        onMouseDown={handleStartResize}
        onTouchStart={handleStartResize}
        className="resize-handle"
      />

      <div className="flex-1">
        Main Content
      </div>
    </div>
  );
}
```

### API Reference

```typescript
function useResize(
  resizableRef: MutableRefObject<HTMLElement> | RefObject<HTMLElement>
): {
  width: number | undefined;
  isResizing: boolean;
  handleStartResize: (e: React.MouseEvent | React.TouchEvent) => void;
}
```

#### Parameters

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `resizableRef` | `MutableRefObject<HTMLElement> \| RefObject<HTMLElement>` | Required | Ref to the element being resized |

#### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `width` | `number \| undefined` | Current width of the element in pixels |
| `isResizing` | `boolean` | Whether the element is currently being resized |
| `handleStartResize` | `(e: React.MouseEvent \| React.TouchEvent) => void` | Function to call on resize handle mousedown/touchstart |

#### RTL Support

The hook automatically detects RTL layout from `document.documentElement.dir` and adjusts resize calculations accordingly.

---

## useTagSelection

Manages tag selection state with comprehensive keyboard navigation support. Supports both single and multi-select modes, search filtering, and accessible keyboard interactions.

### Basic Multi-Select

```tsx
import { useTagSelection } from '@torch-ai/torch-glare';
import { useRef } from 'react';

function TagSelector() {
  const inputRef = useRef<HTMLInputElement>(null);

  const initialTags = [
    { id: '1', name: 'React', isSelected: false },
    { id: '2', name: 'TypeScript', isSelected: false },
    { id: '3', name: 'JavaScript', isSelected: false },
    { id: '4', name: 'Node.js', isSelected: false }
  ];

  const {
    tags,
    selectedTagsStack,
    handleSelectTag,
    handleUnselectTag,
    handleKeyDown,
    isPopoverOpen,
    setIsPopoverOpen,
    filteredTags
  } = useTagSelection({
    Tags: initialTags,
    inputRef,
    singleSelect: false
  });

  return (
    <div>
      <div className="selected-tags">
        {selectedTagsStack.map((tag) => (
          <span key={tag.id} className="tag">
            {tag.name}
            <button onClick={() => handleUnselectTag(tag.id)}>×</button>
          </span>
        ))}
      </div>

      <input
        ref={inputRef}
        onFocus={() => setIsPopoverOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Select tags..."
      />

      {isPopoverOpen && (
        <div className="tag-popover">
          {filteredTags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleSelectTag(tag.id)}
              className={tag.isSelected ? 'selected' : ''}
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Single Select Mode

```tsx
function SingleTagSelector() {
  const inputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { id: '1', name: 'Technology', isSelected: false },
    { id: '2', name: 'Design', isSelected: false },
    { id: '3', name: 'Marketing', isSelected: false }
  ];

  const {
    selectedTagsStack,
    handleSelectTag,
    handleKeyDown,
    isPopoverOpen,
    setIsPopoverOpen,
    filteredTags
  } = useTagSelection({
    Tags: categories,
    inputRef,
    singleSelect: true // Only one tag can be selected
  });

  return (
    <div>
      <label>Category:</label>
      <div className="selected-category">
        {selectedTagsStack[0]?.name || 'None'}
      </div>

      <input
        ref={inputRef}
        onFocus={() => setIsPopoverOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Choose category..."
      />

      {isPopoverOpen && (
        <div className="category-list">
          {filteredTags.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                handleSelectTag(category.id);
                setIsPopoverOpen(false);
              }}
              className={category.isSelected ? 'active' : ''}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

### With Search Filter

```tsx
function SearchableTags() {
  const inputRef = useRef<HTMLInputElement>(null);

  const skills = [
    { id: '1', name: 'JavaScript', isSelected: false },
    { id: '2', name: 'TypeScript', isSelected: false },
    { id: '3', name: 'Python', isSelected: false },
    { id: '4', name: 'Java', isSelected: false },
    { id: '5', name: 'C++', isSelected: false }
  ];

  const {
    selectedTagsStack,
    handleSelectTag,
    handleUnselectTag,
    handleKeyDown,
    isPopoverOpen,
    setIsPopoverOpen,
    filteredTags,
    searchTags,
    filterTagsBySearch
  } = useTagSelection({
    Tags: skills,
    inputRef
  });

  return (
    <div>
      <div className="selected-skills">
        {selectedTagsStack.map((skill) => (
          <span key={skill.id} className="skill-tag">
            {skill.name}
            <button onClick={() => handleUnselectTag(skill.id)}>×</button>
          </span>
        ))}
      </div>

      <input
        ref={inputRef}
        value={searchTags}
        onChange={(e) => filterTagsBySearch(e.target.value)}
        onFocus={() => setIsPopoverOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search skills..."
      />

      {isPopoverOpen && (
        <div className="skills-popover">
          {filteredTags.length > 0 ? (
            filteredTags.map((skill) => (
              <button
                key={skill.id}
                onClick={() => handleSelectTag(skill.id)}
              >
                {skill.name}
              </button>
            ))
          ) : (
            <p>No skills found</p>
          )}
        </div>
      )}
    </div>
  );
}
```

### With Custom Tag Rendering

```tsx
interface CustomTag {
  id: string;
  name: string;
  color: string;
  icon: string;
  isSelected: boolean;
}

function ColoredTags() {
  const inputRef = useRef<HTMLInputElement>(null);

  const labels: CustomTag[] = [
    { id: '1', name: 'Bug', color: 'red', icon: '🐛', isSelected: false },
    { id: '2', name: 'Feature', color: 'green', icon: '✨', isSelected: false },
    { id: '3', name: 'Docs', color: 'blue', icon: '📚', isSelected: false }
  ];

  const {
    selectedTagsStack,
    handleSelectTag,
    handleUnselectTag,
    handleKeyDown,
    isPopoverOpen,
    setIsPopoverOpen,
    filteredTags
  } = useTagSelection({
    Tags: labels,
    inputRef
  });

  return (
    <div>
      <div className="flex gap-2">
        {selectedTagsStack.map((label) => (
          <span
            key={label.id}
            className="tag"
            style={{ backgroundColor: label.color }}
          >
            <span>{label.icon}</span>
            <span>{label.name}</span>
            <button onClick={() => handleUnselectTag(label.id)}>×</button>
          </span>
        ))}
      </div>

      <input
        ref={inputRef}
        onFocus={() => setIsPopoverOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Add labels..."
      />

      {isPopoverOpen && (
        <div className="labels-popover">
          {filteredTags.map((label) => (
            <button
              key={label.id}
              onClick={() => handleSelectTag(label.id)}
              style={{ borderLeft: `4px solid ${label.color}` }}
            >
              <span>{label.icon}</span>
              <span>{label.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

### With Change Callback

```tsx
function TagsWithCallback() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [submittedTags, setSubmittedTags] = useState<string[]>([]);

  const topics = [
    { id: '1', name: 'React', isSelected: false },
    { id: '2', name: 'Vue', isSelected: false },
    { id: '3', name: 'Angular', isSelected: false }
  ];

  const {
    selectedTagsStack,
    handleSelectTag,
    handleUnselectTag,
    handleKeyDown,
    isPopoverOpen,
    setIsPopoverOpen,
    filteredTags
  } = useTagSelection({
    Tags: topics,
    inputRef,
    onTagsChange: (selectedTags) => {
      console.log('Tags changed:', selectedTags);
      // Update external state, make API calls, etc.
      setSubmittedTags(selectedTags.map(t => t.name));
    }
  });

  return (
    <div>
      <div className="selected-topics">
        {selectedTagsStack.map((topic) => (
          <span key={topic.id} className="topic-tag">
            {topic.name}
            <button onClick={() => handleUnselectTag(topic.id)}>×</button>
          </span>
        ))}
      </div>

      <input
        ref={inputRef}
        onFocus={() => setIsPopoverOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Select topics..."
      />

      {isPopoverOpen && (
        <div className="topics-popover">
          {filteredTags.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleSelectTag(topic.id)}
            >
              {topic.name}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4">
        <p>Submitted: {submittedTags.join(', ')}</p>
      </div>
    </div>
  );
}
```

### With Keyboard Navigation

The hook provides comprehensive keyboard support:

```tsx
function KeyboardNavigationExample() {
  const inputRef = useRef<HTMLInputElement>(null);

  const tags = [
    { id: '1', name: 'JavaScript', isSelected: false },
    { id: '2', name: 'TypeScript', isSelected: false },
    { id: '3', name: 'Python', isSelected: false }
  ];

  const {
    selectedTagsStack,
    handleSelectTag,
    handleUnselectTag,
    handleKeyDown,
    isPopoverOpen,
    setIsPopoverOpen,
    filteredTags,
    focusedTagIndex,
    focusedPopoverIndex
  } = useTagSelection({
    Tags: tags,
    inputRef
  });

  return (
    <div>
      <div className="help-text">
        <p>Keyboard shortcuts:</p>
        <ul>
          <li>← → : Navigate selected tags</li>
          <li>↑ ↓ : Navigate popover options</li>
          <li>Enter: Select/unselect tag</li>
          <li>Delete/Backspace: Remove focused tag</li>
          <li>Escape: Close popover</li>
        </ul>
      </div>

      <div className="selected-tags">
        {selectedTagsStack.map((tag, index) => (
          <span
            key={tag.id}
            className={cn(
              'tag',
              focusedTagIndex === index && 'focused'
            )}
          >
            {tag.name}
            <button onClick={() => handleUnselectTag(tag.id)}>×</button>
          </span>
        ))}
      </div>

      <input
        ref={inputRef}
        onFocus={() => setIsPopoverOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Use arrow keys to navigate..."
      />

      {isPopoverOpen && (
        <div className="tag-popover">
          {filteredTags.map((tag, index) => (
            <button
              key={tag.id}
              onClick={() => handleSelectTag(tag.id)}
              className={cn(
                'tag-option',
                focusedPopoverIndex === index && 'focused'
              )}
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

### API Reference

```typescript
interface Tag {
  id: string;
  name: string;
  variant?: string;
  value?: string;
  isSelected: boolean;
  [key: string]: any;
}

function useTagSelection(params: {
  Tags: Tag[];
  onTagsChange?: (selectedTags: Tag[]) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  singleSelect?: boolean;
}): {
  tags: Tag[];
  selectedTagsStack: Tag[];
  searchTags: string;
  filteredTags: Tag[];
  focusedTagIndex: number | null;
  focusedPopoverIndex: number | null;
  isPopoverOpen: boolean;
  handleSelectTag: (id: string) => void;
  handleUnselectTag: (id: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
  setIsPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filterTagsBySearch: React.Dispatch<React.SetStateAction<string>>;
  setFocusedTagIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setFocusedPopoverIndex: React.Dispatch<React.SetStateAction<number | null>>;
}
```

#### Parameters

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `Tags` | `Tag[]` | Required | Array of tag objects with at least `id`, `name`, and `isSelected` |
| `onTagsChange` | `(selectedTags: Tag[]) => void` | `undefined` | Callback fired when selection changes |
| `inputRef` | `React.RefObject<HTMLInputElement>` | `undefined` | Ref to input element for focus management |
| `singleSelect` | `boolean` | `false` | If true, only one tag can be selected at a time |

#### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `tags` | `Tag[]` | All tags with current selection state |
| `selectedTagsStack` | `Tag[]` | Currently selected tags in order |
| `searchTags` | `string` | Current search query |
| `filteredTags` | `Tag[]` | Tags filtered by search query |
| `focusedTagIndex` | `number \| null` | Index of focused selected tag |
| `focusedPopoverIndex` | `number \| null` | Index of focused popover option |
| `isPopoverOpen` | `boolean` | Whether popover is open |
| `handleSelectTag` | `(id: string) => void` | Select a tag by ID |
| `handleUnselectTag` | `(id: string) => void` | Unselect a tag by ID |
| `handleKeyDown` | `(e: React.KeyboardEvent) => void` | Keyboard event handler |
| `setIsPopoverOpen` | `Dispatch<SetStateAction<boolean>>` | Control popover open state |
| `filterTagsBySearch` | `Dispatch<SetStateAction<string>>` | Set search query |
| `setFocusedTagIndex` | `Dispatch<SetStateAction<number \| null>>` | Set focused selected tag |
| `setFocusedPopoverIndex` | `Dispatch<SetStateAction<number \| null>>` | Set focused popover option |

#### Keyboard Interactions

| Key | Action | Context |
|-----|--------|---------|
| `ArrowLeft` | Focus previous selected tag | When selected tags exist |
| `ArrowRight` | Focus next selected tag | When selected tags exist |
| `ArrowDown` | Focus next popover option | When popover is open |
| `ArrowUp` | Focus previous popover option | When popover is open |
| `Enter` | Select focused popover option OR unselect focused tag | When popover open or tag focused |
| `Delete` / `Backspace` | Remove focused selected tag | When tag is focused |
| `Escape` | Close popover | When popover is open |

---

## TypeScript Support

All hooks are fully typed with TypeScript:

```typescript
// useActiveTreeItem
const { activeId }: { activeId: string | null } = useActiveTreeItem(ids);

// useClickOutside - Generic type parameter
const ref: React.RefObject<HTMLDivElement> = useClickOutside<HTMLDivElement>(
  callback,
  otherwise
);

// useResize
const {
  width,
  isResizing,
  handleStartResize
}: {
  width: number | undefined;
  isResizing: boolean;
  handleStartResize: (e: React.MouseEvent | React.TouchEvent) => void;
} = useResize(ref);

// useTagSelection - Custom Tag interface
interface CustomTag extends Tag {
  color: string;
  priority: number;
}

const result = useTagSelection({
  Tags: customTags as CustomTag[],
  // ...
});
```

---

## Testing

### Testing useActiveTreeItem

```tsx
import { renderHook } from '@testing-library/react';
import { useActiveTreeItem } from '@torch-ai/torch-glare';

describe('useActiveTreeItem', () => {
  it('should track active item', () => {
    const { result } = renderHook(() =>
      useActiveTreeItem(['item1', 'item2', 'item3'])
    );

    expect(result.current.activeId).toBeNull();

    // Mock IntersectionObserver would trigger here
    // and update activeId
  });

  it('should update when items change', () => {
    const { result, rerender } = renderHook(
      ({ ids }) => useActiveTreeItem(ids),
      { initialProps: { ids: ['a', 'b'] } }
    );

    rerender({ ids: ['a', 'b', 'c'] });

    // Verify observer was updated with new IDs
  });
});
```

### Testing useClickOutside

```tsx
import { render, fireEvent } from '@testing-library/react';
import { useClickOutside } from '@torch-ai/torch-glare';

describe('useClickOutside', () => {
  it('should call callback on outside click', () => {
    const callback = vi.fn();

    function TestComponent() {
      const ref = useClickOutside<HTMLDivElement>(callback);
      return <div ref={ref}>Content</div>;
    }

    const { container } = render(<TestComponent />);

    fireEvent.mouseDown(document.body);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not call callback on inside click', () => {
    const callback = vi.fn();

    function TestComponent() {
      const ref = useClickOutside<HTMLDivElement>(callback);
      return <div ref={ref}>Content</div>;
    }

    const { getByText } = render(<TestComponent />);

    fireEvent.mouseDown(getByText('Content'));
    expect(callback).not.toHaveBeenCalled();
  });
});
```

### Testing useResize

```tsx
import { renderHook, act } from '@testing-library/react';
import { useResize } from '@torch-ai/torch-glare';

describe('useResize', () => {
  it('should handle resize', () => {
    const ref = { current: document.createElement('div') };
    const { result } = renderHook(() => useResize(ref));

    expect(result.current.isResizing).toBe(false);

    act(() => {
      result.current.handleStartResize({} as React.MouseEvent);
    });

    expect(result.current.isResizing).toBe(true);
  });

  it('should detect RTL layout', () => {
    document.documentElement.setAttribute('dir', 'rtl');

    const ref = { current: document.createElement('div') };
    const { result } = renderHook(() => useResize(ref));

    // Internal RTL state should be true
    // Width calculations should be reversed

    document.documentElement.removeAttribute('dir');
  });
});
```

### Testing useTagSelection

```tsx
import { renderHook, act } from '@testing-library/react';
import { useTagSelection } from '@torch-ai/torch-glare';

describe('useTagSelection', () => {
  const mockTags = [
    { id: '1', name: 'Tag 1', isSelected: false },
    { id: '2', name: 'Tag 2', isSelected: false }
  ];

  it('should select tag', () => {
    const { result } = renderHook(() =>
      useTagSelection({ Tags: mockTags })
    );

    act(() => {
      result.current.handleSelectTag('1');
    });

    expect(result.current.selectedTagsStack).toHaveLength(1);
    expect(result.current.selectedTagsStack[0].id).toBe('1');
  });

  it('should respect single select mode', () => {
    const { result } = renderHook(() =>
      useTagSelection({ Tags: mockTags, singleSelect: true })
    );

    act(() => {
      result.current.handleSelectTag('1');
      result.current.handleSelectTag('2');
    });

    expect(result.current.selectedTagsStack).toHaveLength(1);
    expect(result.current.selectedTagsStack[0].id).toBe('2');
  });

  it('should filter tags by search', () => {
    const { result } = renderHook(() =>
      useTagSelection({ Tags: mockTags })
    );

    act(() => {
      result.current.filterTagsBySearch('Tag 1');
    });

    expect(result.current.filteredTags).toHaveLength(1);
    expect(result.current.filteredTags[0].name).toBe('Tag 1');
  });
});
```

---

## Performance Considerations

### useActiveTreeItem

- **Cleanup**: Automatically unobserves all elements on unmount
- **Re-observation**: Updates observers when `itemIds` array changes
- **Optimization**: Use stable `itemIds` array (useMemo) to avoid re-creating observers

```tsx
const itemIds = useMemo(() =>
  sections.map(s => s.id),
  [sections]
);

const { activeId } = useActiveTreeItem(itemIds);
```

### useClickOutside

- **Event listeners**: Automatically cleaned up on unmount
- **Re-creation**: Callback is re-attached when it changes - use `useCallback` for stable callbacks

```tsx
const handleClose = useCallback(() => {
  setIsOpen(false);
}, []);

const ref = useClickOutside(handleClose);
```

### useResize

- **Event listeners**: Conditionally attached only during resize
- **High-frequency updates**: Consider throttling or debouncing width updates for better performance

```tsx
const [width, setWidth] = useState<number>();
const resize = useResize(panelRef);

useEffect(() => {
  if (resize.width !== undefined) {
    const timeoutId = setTimeout(() => {
      setWidth(resize.width);
    }, 16); // ~60fps

    return () => clearTimeout(timeoutId);
  }
}, [resize.width]);
```

### useTagSelection

- **Large tag lists**: Filter results are computed on every search - consider virtualizing long lists
- **Memoization**: Use `useMemo` for derived values if you have complex tag transformations

```tsx
const heavyTags = useMemo(() =>
  rawTags.map(tag => ({
    ...tag,
    computedValue: expensiveComputation(tag)
  })),
  [rawTags]
);

const { selectedTagsStack } = useTagSelection({ Tags: heavyTags });
```

---

## Best Practices

### useActiveTreeItem

1. **Stable IDs**: Ensure element IDs don't change between renders
2. **Performance**: Don't observe too many elements (< 50 recommended)
3. **Accessibility**: Update aria-current when activeId changes

```tsx
<a
  href={`#${id}`}
  aria-current={activeId === id ? 'location' : undefined}
>
  {title}
</a>
```

### useClickOutside

1. **Cleanup**: Always clean up when unmounting conditional content
2. **Portal compatibility**: Works with React portals
3. **Multiple instances**: Can use multiple instances on same page

```tsx
{isOpen && createPortal(
  <div ref={useClickOutside(() => setIsOpen(false))}>
    Modal content
  </div>,
  document.body
)}
```

### useResize

1. **Touch support**: Always include both mouse and touch handlers
2. **Visual feedback**: Show visual indicator during resize
3. **Constraints**: Implement min/max width constraints

```tsx
<div
  onMouseDown={handleStartResize}
  onTouchStart={handleStartResize}
  className={cn(
    'resize-handle',
    isResizing && 'active'
  )}
/>
```

### useTagSelection

1. **Accessibility**: Provide keyboard navigation instructions
2. **Validation**: Validate tag selection before form submission
3. **Performance**: Virtualize long tag lists (100+ items)

```tsx
const { selectedTagsStack, handleKeyDown } = useTagSelection({
  Tags: tags,
  onTagsChange: (selected) => {
    if (selected.length < 3) {
      setError('Please select at least 3 tags');
    }
  }
});
```

---

## Related Components

- **TreeView**: Uses `useActiveTreeItem` for navigation highlighting
- **Popover**: Uses `useClickOutside` for closing on outside clicks
- **TagSelector**: Built on top of `useTagSelection`
- **ResizablePanel**: Uses `useResize` for panel sizing

---

## Accessibility

All hooks follow accessibility best practices:

- **useActiveTreeItem**: Updates ARIA current location
- **useClickOutside**: Preserves focus management
- **useResize**: Supports keyboard-only resize (implement separately)
- **useTagSelection**: Full keyboard navigation with ARIA roles

---

## Browser Support

All hooks support:

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**IntersectionObserver** (useActiveTreeItem): Requires polyfill for older browsers.
