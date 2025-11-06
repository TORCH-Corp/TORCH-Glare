---
title: Component API Index
description: Complete index of all TORCH Glare components with quick links to their documentation.
category: Reference
tags: [components, api, reference, index]
---

# Component API Index

Complete reference index of all 53 components in the TORCH Glare Components Library.

## Quick Navigation

- [Forms & Inputs (17)](#forms--inputs)
- [Buttons & Actions (3)](#buttons--actions)
- [Layout & Containers (7)](#layout--containers)
- [Data Display (8)](#data-display)
- [Overlays & Dialogs (7)](#overlays--dialogs)
- [Date & Time (3)](#date--time)
- [Feedback & Status (4)](#feedback--status)
- [Labels & Text (4)](#labels--text)
- [Advanced Components (1)](#advanced-components)

---

## Forms & Inputs

### Button
Interactive button component with multiple variants and sizes.

- **File**: [button.md](../components/button.md)
- **Props**: `variant`, `size`, `theme`, `buttonType`, `disabled`
- **Variants**: `PrimeStyle`, `ContStyle`, `SecondStyle`, `BorderStyle`, `ErrorStyle`, `SuccessStyle`, `PrimeContStyle`
- **Use Cases**: Primary actions, secondary actions, icon buttons, loading states

### Input
Basic text input component with error handling.

- **File**: [input.md](../components/input.md)
- **Props**: `type`, `placeholder`, `disabled`, `errorMessage`, `theme`
- **Types**: `text`, `email`, `password`, `number`, `tel`, `url`
- **Use Cases**: Form fields, search inputs, text entry

### InputField
Enhanced input with built-in label, hints, and icons.

- **File**: [input-field.md](../components/input-field.md)
- **Props**: `label`, `helperText`, `errorMessage`, `leftIcon`, `rightIcon`
- **Features**: Floating labels, error states, helper text
- **Use Cases**: Complete form fields, validated inputs

### Textarea
Multi-line text input component.

- **File**: [textarea.md](../components/textarea.md)
- **Props**: `rows`, `maxLength`, `resize`, `placeholder`
- **Features**: Auto-resize, character count, error states
- **Use Cases**: Long text entry, comments, descriptions

### Checkbox
Selectable checkbox component with multiple states.

- **File**: [checkbox.md](../components/checkbox.md)
- **Props**: `checked`, `indeterminate`, `disabled`, `theme`
- **States**: Checked, unchecked, indeterminate
- **Use Cases**: Selection, agreement, filters

### LabeledCheckBox
Checkbox with integrated label and description.

- **File**: [labeled-checkbox.md](../components/labeled-checkbox.md)
- **Props**: `label`, `description`, `checked`, `onChange`
- **Features**: Built-in label, optional description
- **Use Cases**: Terms acceptance, preferences, options

### Radio
Radio button for single selection from options.

- **File**: [radio.md](../components/radio.md)
- **Props**: `name`, `value`, `checked`, `disabled`
- **Features**: Group support, keyboard navigation
- **Use Cases**: Single choice, options, settings

### LabeledRadio
Radio button with label and description.

- **File**: [labeled-radio.md](../components/labeled-radio.md)
- **Props**: `label`, `description`, `value`, `checked`
- **Features**: Built-in label, optional description
- **Use Cases**: Payment methods, shipping options

### RadioCard
Card-style radio button with rich content.

- **File**: [radio-card.md](../components/radio-card.md)
- **Props**: `title`, `description`, `icon`, `value`
- **Features**: Visual selection, card layout
- **Use Cases**: Plan selection, feature choices

### Select
Dropdown select component with search.

- **File**: [select.md](../components/select.md)
- **Props**: `options`, `value`, `onValueChange`, `searchable`
- **Features**: Search, multi-select, keyboard navigation
- **Use Cases**: Dropdowns, filters, option selection

### SimpleSelect
Lightweight select without search.

- **File**: [simple-select.md](../components/simple-select.md)
- **Props**: `options`, `value`, `onChange`, `placeholder`
- **Features**: Simple dropdown, minimal styling
- **Use Cases**: Basic dropdowns, settings

### Switch
Toggle switch for binary choices.

- **File**: [switch.md](../components/switch.md)
- **Props**: `checked`, `onCheckedChange`, `disabled`
- **Features**: Animated toggle, accessible
- **Use Cases**: Settings, on/off states, features

### Toggle
Alternative toggle component.

- **File**: [toggle.md](../components/toggle.md)
- **Props**: `pressed`, `onPressedChange`, `variant`
- **Features**: Multiple variants, icon support
- **Use Cases**: Toolbar buttons, filters

### SearchField
Dedicated search input with clear button.

- **File**: [search-field.md](../components/search-field.md)
- **Props**: `placeholder`, `onSearch`, `debounce`
- **Features**: Clear button, search icon, debounced input
- **Use Cases**: Search bars, filters, queries

### InputOTP
One-time password input component.

- **File**: [input-otp.md](../components/input-otp.md)
- **Props**: `length`, `value`, `onChange`, `type`
- **Features**: Auto-focus, paste support, numeric/alphanumeric
- **Use Cases**: 2FA, verification codes, OTP

### TabFormItem
Form field with tabbed navigation.

- **File**: [tab-form-item.md](../components/tab-form-item.md)
- **Props**: `tabs`, `value`, `onChange`
- **Features**: Tabbed interface, form integration
- **Use Cases**: Multi-step forms, categorized inputs

### Form
Complete form wrapper with validation.

- **File**: [form.md](../components/form.md)
- **Props**: `onSubmit`, `validation`, `children`
- **Features**: Built-in validation, error handling
- **Use Cases**: Complete forms, user input

---

## Buttons & Actions

### ActionButton
Button with loading and success states.

- **File**: [action-button.md](../components/action-button.md)
- **Props**: `isLoading`, `isSuccess`, `onClick`
- **Features**: Loading spinner, success feedback
- **Use Cases**: Async actions, API calls, submissions

### LinkButton
Button styled as a link.

- **File**: [link-button.md](../components/link-button.md)
- **Props**: `href`, `target`, `variant`
- **Features**: Link behavior, button styling
- **Use Cases**: Navigation, external links

### LoginButton
Pre-styled button for login actions.

- **File**: [login-button.md](../components/login-button.md)
- **Props**: `provider`, `onLogin`, `isLoading`
- **Features**: Provider icons, loading states
- **Use Cases**: Authentication, social login

---

## Layout & Containers

### Card
Flexible card container component.

- **File**: [card.md](../components/card.md)
- **Props**: `variant`, `padding`, `shadow`
- **Features**: Multiple variants, customizable
- **Use Cases**: Content containers, dashboards

### CNLayout
Conditional navigation layout.

- **File**: [cn-layout.md](../components/cn-layout.md)
- **Props**: `sidebar`, `header`, `footer`, `children`
- **Features**: Responsive layout, collapsible sidebar
- **Use Cases**: Application layouts, dashboards

### FieldSection
Section wrapper for form fields.

- **File**: [field-section.md](../components/field-section.md)
- **Props**: `title`, `description`, `children`
- **Features**: Section headers, grouping
- **Use Cases**: Form organization, settings

### TreeSubLayout
Tree-based navigation layout.

- **File**: [tree-sub-layout.md](../components/tree-sub-layout.md)
- **Props**: `tree`, `activeItem`, `children`
- **Features**: Hierarchical navigation, collapsible
- **Use Cases**: Documentation, file explorers

### Divider
Visual separator component.

- **File**: [divider.md](../components/divider.md)
- **Props**: `orientation`, `label`, `spacing`
- **Features**: Horizontal/vertical, labeled
- **Use Cases**: Content separation, sections

### ScrollArea
Custom scrollable container.

- **File**: [scroll-area.md](../components/scroll-area.md)
- **Props**: `maxHeight`, `scrollbars`, `children`
- **Features**: Custom scrollbars, smooth scrolling
- **Use Cases**: Long content, fixed containers

### ActionsGroup
Grouped action buttons.

- **File**: [actions-group.md](../components/actions-group.md)
- **Props**: `actions`, `alignment`, `spacing`
- **Features**: Button grouping, spacing
- **Use Cases**: Form actions, toolbars

---

## Data Display

### Badge
Small status or label indicator.

- **File**: [badge.md](../components/badge.md)
- **Props**: `variant`, `size`, `theme`
- **Variants**: 12 color variants (green, blue, red, purple, etc.)
- **Use Cases**: Status indicators, labels, tags

### BadgeField
Badge with label field.

- **File**: [badge-field.md](../components/badge-field.md)
- **Props**: `label`, `value`, `variant`
- **Features**: Label + badge combination
- **Use Cases**: Status fields, labeled indicators

### CountBadge
Badge displaying a count.

- **File**: [count-badge.md](../components/count-badge.md)
- **Props**: `count`, `max`, `showZero`
- **Features**: Overflow handling (99+), animations
- **Use Cases**: Notifications, unread counts

### Avatar
User avatar component.

- **File**: [avatar.md](../components/avatar.md)
- **Props**: `src`, `alt`, `size`, `fallback`
- **Sizes**: XS, S, M, L, XL
- **Use Cases**: User profiles, comments, lists

### Table
Simple table component.

- **File**: [table.md](../components/table.md)
- **Props**: `columns`, `data`, `sortable`
- **Features**: Sortable columns, hover states
- **Use Cases**: Data display, lists

### DataTable
Advanced table with features.

- **File**: [data-table.md](../components/data-table.md)
- **Props**: `columns`, `data`, `pagination`, `sorting`, `filtering`
- **Features**: Pagination, sorting, filtering, selection
- **Use Cases**: Complex data, admin panels

### TreeDropDown
Hierarchical dropdown menu.

- **File**: [tree-dropdown.md](../components/tree-dropdown.md)
- **Props**: `tree`, `value`, `onChange`
- **Features**: Nested items, expand/collapse
- **Use Cases**: Category selection, file trees

### Skeleton
Loading placeholder component.

- **File**: [skeleton.md](../components/skeleton.md)
- **Props**: `variant`, `width`, `height`, `animation`
- **Variants**: Text, circle, rectangle
- **Use Cases**: Loading states, placeholders

---

## Overlays & Dialogs

### Dialog
Modal dialog component.

- **File**: [dialog.md](../components/dialog.md)
- **Props**: `open`, `onOpenChange`, `title`, `description`
- **Features**: Backdrop, focus trap, animations
- **Use Cases**: Modals, confirmations, forms

### AlertDialog
Alert and confirmation dialog.

- **File**: [alert-dialog.md](../components/alert-dialog.md)
- **Props**: `title`, `description`, `action`, `cancel`
- **Features**: Destructive actions, keyboard support
- **Use Cases**: Confirmations, warnings, deletions

### Drawer
Slide-out panel component.

- **File**: [drawer.md](../components/drawer.md)
- **Props**: `side`, `open`, `onOpenChange`
- **Sides**: Left, right, top, bottom
- **Use Cases**: Side menus, filters, details

### Popover
Floating popover component.

- **File**: [popover.md](../components/popover.md)
- **Props**: `trigger`, `content`, `placement`
- **Features**: Auto-positioning, click outside
- **Use Cases**: Tooltips, menus, help text

### Tooltip
Hover tooltip component.

- **File**: [tooltip.md](../components/tooltip.md)
- **Props**: `content`, `placement`, `delay`
- **Features**: Auto-positioning, keyboard accessible
- **Use Cases**: Help text, additional info

### DropdownMenu
Dropdown menu component.

- **File**: [dropdown-menu.md](../components/dropdown-menu.md)
- **Props**: `items`, `trigger`, `placement`
- **Features**: Keyboard navigation, submenus
- **Use Cases**: Context menus, actions

### ProfileMenu
User profile dropdown menu.

- **File**: [profile-menu.md](../components/profile-menu.md)
- **Props**: `user`, `menuItems`, `onAction`
- **Features**: User info display, actions
- **Use Cases**: User menus, profile actions

---

## Date & Time

### Calendar
Calendar picker component.

- **File**: [calendar.md](../components/calendar.md)
- **Props**: `mode`, `selected`, `onSelect`, `disabled`
- **Modes**: Single, multiple, range
- **Use Cases**: Date selection, booking

### DatePicker
Complete date and time picker.

- **File**: [date-picker.md](../components/date-picker.md)
- **Props**: `value`, `onChange`, `timePicker`, `dateFormat`
- **Features**: Calendar + time picker, formatting
- **Use Cases**: Date/time input, scheduling

### SlideDatePicker
Mobile-optimized date picker.

- **File**: [slide-date-picker.md](../components/slide-date-picker.md)
- **Props**: `value`, `onChange`, `dateFormat`
- **Features**: Wheel/slide interface, touch-friendly
- **Use Cases**: Mobile apps, touch interfaces

---

## Feedback & Status

### Toast
Toast notification system.

- **File**: [toast.md](../components/toast.md)
- **Props**: `message`, `type`, `duration`
- **Types**: Success, error, warning, info, loading
- **Use Cases**: Notifications, feedback, alerts

### SpinLoading
Animated loading spinner.

- **File**: [spin-loading.md](../components/spin-loading.md)
- **Props**: `size`, `theme`, `children`
- **Features**: Center content, themed colors
- **Use Cases**: Loading states, async operations

### PasswordLevel
Password strength indicator.

- **File**: [password-level.md](../components/password-level.md)
- **Props**: `value`, `theme`
- **Features**: Real-time strength, visual feedback
- **Use Cases**: Password fields, security

### FieldHint
Inline field hints and alerts.

- **File**: [field-hint.md](../components/field-hint.md)
- **Props**: `label`, `state`, `icon`
- **States**: Info, warning, error, success
- **Use Cases**: Field guidance, validation feedback

---

## Labels & Text

### Label
Flexible label component.

- **File**: [label.md](../components/label.md)
- **Props**: `label`, `requiredLabel`, `secondaryLabel`, `as`
- **Features**: Polymorphic, multiple label types
- **Use Cases**: Form labels, field headers

### LabelField
Combined label and input.

- **File**: [label-field.md](../components/label-field.md)
- **Props**: `label`, `requiredLabel`, plus InputField props
- **Features**: Integrated label + input
- **Use Cases**: Complete form fields

### InnerLabelField
Floating label input field.

- **File**: [inner-label-field.md](../components/inner-label-field.md)
- **Props**: `label`, `required`, plus input props
- **Features**: Material Design floating label
- **Use Cases**: Modern forms, space-saving

### TransparentLabel
Text with gradient fade effect.

- **File**: [transparent-label.md](../components/transparent-label.md)
- **Props**: `size`, `children`
- **Features**: 48 typography sizes, gradient fade
- **Use Cases**: Truncated text, overflow handling

---

## Advanced Components

### ImageAttachment
File upload and image preview suite.

- **File**: [image-attachment.md](../components/image-attachment.md)
- **Components**: ImageAttachment, ExpandableImage, AttachmentImagePreview
- **Features**: Drag-and-drop, preview, modal view
- **Use Cases**: File uploads, image handling, previews

---

## Component Props Reference

### Common Props

Most components share these common props:

| Prop | Type | Description |
|------|------|-------------|
| `theme` | `"light" \| "dark"` | Theme variant |
| `className` | `string` | Additional CSS classes |
| `disabled` | `boolean` | Disabled state |
| `children` | `ReactNode` | Child elements |

### Size Props

Components with size variants typically support:

| Size | Description |
|------|-------------|
| `XS` | Extra small (16px) |
| `S` | Small (24px) |
| `M` | Medium (32px) |
| `L` | Large (40px) |
| `XL` | Extra large (48px) |

### Variant Props

Button variants:
- `PrimeStyle` - Primary action
- `ContStyle` - Contrast style
- `SecondStyle` - Secondary action
- `BorderStyle` - Outlined
- `ErrorStyle` - Destructive action
- `SuccessStyle` - Success action
- `PrimeContStyle` - Primary contrast

---

## TypeScript Support

All components are fully typed with TypeScript. Import types from the library:

```typescript
import type {
  ButtonProps,
  InputProps,
  SelectProps,
  // ... other types
} from '@torch-ai/torch-glare';
```

---

## Related Documentation

- [Hooks Reference](./hooks.md) - Custom React hooks
- [Providers Reference](./providers.md) - Context providers
- [Tailwind Plugins](./tailwind-plugins.md) - CSS plugins
- [Tutorials](../tutorials/) - Getting started guides
- [How-to Guides](../how-to/) - Common tasks

---

## Need Help?

- Browse [individual component docs](../components/)
- Check [tutorials](../tutorials/) for step-by-step guides
- Read [how-to guides](../how-to/) for specific tasks
- Report issues on [GitHub](https://github.com/torch-ai/torch-glare/issues)
