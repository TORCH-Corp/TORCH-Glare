---
title: TypeScript Types Reference
description: Complete reference of TypeScript types and interfaces used in TORCH Glare Components Library.
category: Reference
tags: [typescript, types, interfaces, type-safety]
related:
  - Component API Index
  - Utilities Reference
---

# TypeScript Types Reference

Complete catalog of TypeScript types, interfaces, and type utilities used throughout TORCH Glare.

## Table of Contents

- [Core Types](#core-types)
- [Component Props Types](#component-props-types)
- [Theme Types](#theme-types)
- [Form Types](#form-types)
- [Layout Types](#layout-types)
- [Data Display Types](#data-display-types)
- [Utility Types](#utility-types)
- [Type Guards](#type-guards)

---

## Core Types

### Themes

Theme variant type used across all components.

```typescript
export type Themes = "dark" | "light" | "default";
```

**Usage:**
```typescript
import type { Themes } from '@torch-ai/torch-glare';

interface MyComponentProps {
  theme?: Themes;
}
```

**Values:**
- `"light"` - Light theme
- `"dark"` - Dark theme
- `"default"` - System default (follows `prefers-color-scheme`)

---

## Component Props Types

### Button Types

#### ButtonVariant

```typescript
export type ButtonVariant =
  | "PrimeStyle"      // Primary action
  | "BlueSecStyle"    // Blue secondary
  | "YelSecStyle"     // Yellow secondary
  | "RedSecStyle"     // Red secondary
  | "BorderStyle"     // Outlined
  | "PrimeContStyle"  // Primary contrast
  | "BlueContStyle"   // Blue contrast
  | "RedContStyle";   // Red contrast
```

#### ButtonSize

```typescript
type ButtonSize = "XS" | "S" | "M" | "L" | "XL";
```

#### ButtonType

```typescript
type ButtonType = "button" | "icon" | "text";
```

#### ButtonProps

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  theme?: Themes;
  buttonType?: ButtonType;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}
```

### Input Types

#### InputProps

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  theme?: Themes;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}
```

#### InputFieldProps

```typescript
interface InputFieldProps extends InputProps {
  label?: string;
  helperText?: string;
  requiredLabel?: string;
  secondaryLabel?: string;
}
```

#### TextareaProps

```typescript
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  theme?: Themes;
  errorMessage?: string;
  resize?: boolean;
  maxLength?: number;
}
```

### Select Types

#### SelectOption

```typescript
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}
```

#### SelectProps

```typescript
interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  options?: SelectOption[];
  placeholder?: string;
  searchable?: boolean;
  disabled?: boolean;
  theme?: Themes;
}
```

### Checkbox & Radio Types

#### CheckboxProps

```typescript
interface CheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  theme?: Themes;
  className?: string;
}
```

#### RadioProps

```typescript
interface RadioProps {
  value: string;
  checked?: boolean;
  name?: string;
  disabled?: boolean;
  theme?: Themes;
  onChange?: (value: string) => void;
}
```

#### LabeledCheckBoxProps

```typescript
interface LabeledCheckBoxProps extends CheckboxProps {
  label: string;
  description?: string;
}
```

### Switch Types

#### SwitchProps

```typescript
interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  theme?: Themes;
  className?: string;
}
```

---

## Theme Types

### ThemeProviderProps

```typescript
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: "light" | "dark" | "default";
  defaultThemeMode?: "CSS" | "TORCH";
}
```

### ThemeContext

```typescript
interface ThemeContext {
  theme: "light" | "dark" | "default";
  themeMode: "CSS" | "TORCH";
  updateTheme: (theme: "light" | "dark" | "default") => void;
  updateMode: (themeMode: "CSS" | "TORCH") => void;
}
```

### useTheme Return Type

```typescript
function useTheme(): {
  theme: "light" | "dark" | "default";
  themeMode: "CSS" | "TORCH";
  updateTheme: (theme: "light" | "dark" | "default") => void;
  updateMode: (themeMode: "CSS" | "TORCH") => void;
}
```

---

## Form Types

### Form Validation Types

#### ValidationRule

```typescript
type ValidationRule<T> = (value: T) => string | undefined;
```

#### ValidationRules

```typescript
type ValidationRules<T> = {
  [K in keyof T]?: Array<ValidationRule<T[K]>>;
};
```

#### FormErrors

```typescript
type FormErrors<T> = Partial<Record<keyof T, string>>;
```

#### FormTouched

```typescript
type FormTouched<T> = Partial<Record<keyof T, boolean>>;
```

### Form Hook Return Type

```typescript
interface UseFormValidation<T> {
  values: T;
  errors: FormErrors<T>;
  touched: FormTouched<T>;
  handleChange: (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (field: keyof T) => () => void;
  validateForm: () => boolean;
  reset: () => void;
}
```

### Field Types

#### FieldHintState

```typescript
type FieldHintState = "info" | "warning" | "error" | "success";
```

#### FieldHintProps

```typescript
interface FieldHintProps {
  label: string;
  state: FieldHintState;
  icon?: React.ReactNode;
  theme?: Themes;
  className?: string;
}
```

---

## Layout Types

### Layout Props

#### CardProps

```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined" | "elevated";
  padding?: "none" | "small" | "medium" | "large";
  shadow?: boolean;
  theme?: Themes;
}
```

#### DividerProps

```typescript
interface DividerProps {
  orientation?: "horizontal" | "vertical";
  label?: string;
  spacing?: "none" | "small" | "medium" | "large";
  theme?: Themes;
}
```

#### ScrollAreaProps

```typescript
interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: number | string;
  scrollbars?: "auto" | "always" | "never";
  theme?: Themes;
}
```

### Navigation Types

#### TreeItem

```typescript
interface TreeItem {
  id: string;
  label: string;
  children?: TreeItem[];
  icon?: React.ReactNode;
  href?: string;
}
```

#### TreeSubLayoutProps

```typescript
interface TreeSubLayoutProps {
  tree: TreeItem[];
  activeItem?: string;
  onItemClick?: (id: string) => void;
  children: React.ReactNode;
  theme?: Themes;
}
```

---

## Data Display Types

### Badge Types

#### BadgeVariant

```typescript
type BadgeVariant =
  | "PrimeStyle"
  | "SecondStyle"
  | "ContStyle"
  | "BorderStyle";
```

#### BadgeProps

```typescript
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  theme?: Themes;
  children: React.ReactNode;
}
```

#### BadgeColor

```typescript
type BadgeColor =
  | "green"
  | "green-light"
  | "cocktail-green"
  | "yellow"
  | "red-orange"
  | "red"
  | "rose"
  | "purple"
  | "blue-purple"
  | "blue"
  | "navy"
  | "gray";
```

### Avatar Types

#### AvatarSize

```typescript
type AvatarSize = "XS" | "S" | "M" | "L" | "XL";
```

#### AvatarProps

```typescript
interface AvatarProps {
  src?: string;
  alt: string;
  size?: AvatarSize;
  fallback?: string | React.ReactNode;
  theme?: Themes;
}
```

### Table Types

#### TableColumn

```typescript
interface TableColumn<T = any> {
  key: keyof T | string;
  header: string;
  accessor?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: number | string;
}
```

#### TableProps

```typescript
interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  sortable?: boolean;
  onRowClick?: (row: T) => void;
  theme?: Themes;
}
```

#### DataTableProps

```typescript
interface DataTableProps<T = any> extends TableProps<T> {
  pagination?: boolean;
  pageSize?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  filtering?: boolean;
  selection?: boolean;
  onSelectionChange?: (selected: T[]) => void;
}
```

### Skeleton Types

#### SkeletonVariant

```typescript
type SkeletonVariant = "text" | "circle" | "rectangle";
```

#### SkeletonProps

```typescript
interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number | string;
  animation?: boolean;
  theme?: Themes;
}
```

---

## Utility Types

### ClassValue

```typescript
import type { ClassValue } from "clsx";

// Used in cn utility function
function cn(...inputs: ClassValue[]): string;
```

### PolymorphicProps

```typescript
type PolymorphicProps<E extends React.ElementType> = {
  as?: E;
} & React.ComponentPropsWithoutRef<E>;
```

### ForwardRefComponent

```typescript
type ForwardRefComponent<T, P = {}> = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<P> & React.RefAttributes<T>
>;
```

### WithChildren

```typescript
type WithChildren<T = {}> = T & {
  children?: React.ReactNode;
};
```

### WithTheme

```typescript
type WithTheme<T = {}> = T & {
  theme?: Themes;
};
```

### WithClassName

```typescript
type WithClassName<T = {}> = T & {
  className?: string;
};
```

---

## Dialog & Overlay Types

### Dialog Types

#### DialogProps

```typescript
interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  theme?: Themes;
  children: React.ReactNode;
}
```

#### AlertDialogProps

```typescript
interface AlertDialogProps extends DialogProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  cancel?: React.ReactNode;
}
```

### Drawer Types

#### DrawerSide

```typescript
type DrawerSide = "left" | "right" | "top" | "bottom";
```

#### DrawerProps

```typescript
interface DrawerProps {
  side?: DrawerSide;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  theme?: Themes;
  children: React.ReactNode;
}
```

### Popover Types

#### PopoverPlacement

```typescript
type PopoverPlacement =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-start"
  | "top-end"
  | "bottom-start"
  | "bottom-end"
  | "left-start"
  | "left-end"
  | "right-start"
  | "right-end";
```

#### PopoverProps

```typescript
interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  placement?: PopoverPlacement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  theme?: Themes;
}
```

### Tooltip Types

#### TooltipProps

```typescript
interface TooltipProps {
  content: React.ReactNode;
  placement?: PopoverPlacement;
  delay?: number;
  theme?: Themes;
  children: React.ReactNode;
}
```

---

## Date & Time Types

### Calendar Types

#### CalendarMode

```typescript
type CalendarMode = "single" | "multiple" | "range";
```

#### DateRange

```typescript
interface DateRange {
  from: Date | undefined;
  to?: Date | undefined;
}
```

#### CalendarProps

```typescript
interface CalendarProps {
  mode?: CalendarMode;
  selected?: Date | Date[] | DateRange;
  onSelect?: (date: Date | Date[] | DateRange | undefined) => void;
  disabled?: Date[] | ((date: Date) => boolean);
  min?: number;
  max?: number;
  theme?: Themes;
}
```

### DatePicker Types

#### DatePickerProps

```typescript
interface DatePickerProps {
  value?: Date;
  onChange?: (e: { target: { value: Date } }) => void;
  timePicker?: boolean;
  dateFormat?: string;
  disabled?: boolean;
  theme?: Themes;
}
```

---

## Hook Types

### useActiveTreeItem

```typescript
function useActiveTreeItem(itemIds: string[]): {
  activeId: string | null;
}
```

### useClickOutside

```typescript
function useClickOutside<T extends HTMLElement>(
  callback: (event?: MouseEvent | PointerEvent) => void,
  otherwise?: (event?: MouseEvent | PointerEvent) => void
): React.RefObject<T>
```

### useResize

```typescript
function useResize(
  resizableRef: MutableRefObject<HTMLElement> | RefObject<HTMLElement>
): {
  width: number | undefined;
  isResizing: boolean;
  handleStartResize: (e: React.MouseEvent | React.TouchEvent) => void;
}
```

### useTagSelection

#### Tag Interface

```typescript
interface Tag {
  id: string;
  name: string;
  variant?: string;
  value?: string;
  isSelected: boolean;
  [key: string]: any;
}
```

#### useTagSelection Return Type

```typescript
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

---

## Type Guards

### isTheme

```typescript
function isTheme(value: unknown): value is Themes {
  return (
    typeof value === 'string' &&
    ['light', 'dark', 'default'].includes(value)
  );
}
```

### isValidEmail

```typescript
function isValidEmail(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
}
```

### isReactNode

```typescript
function isReactNode(value: unknown): value is React.ReactNode {
  return (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    React.isValidElement(value)
  );
}
```

---

## Generic Component Types

### Polymorphic Component Example

```typescript
type PolymorphicComponentProps<
  E extends React.ElementType,
  P = {}
> = P & {
  as?: E;
} & Omit<React.ComponentPropsWithoutRef<E>, keyof P | 'as'>;

// Usage
interface LabelOwnProps {
  label: string;
  theme?: Themes;
}

type LabelProps<E extends React.ElementType = 'label'> =
  PolymorphicComponentProps<E, LabelOwnProps>;

const Label = <E extends React.ElementType = 'label'>({
  as,
  ...props
}: LabelProps<E>) => {
  const Component = as || 'label';
  return <Component {...props} />;
};
```

### Forward Ref Component Example

```typescript
interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

type ButtonProps = ButtonOwnProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return <button ref={ref} {...props} />;
  }
);

Button.displayName = 'Button';
```

---

## Extending Component Types

### Extending Button Props

```typescript
import type { ButtonProps } from '@torch-ai/torch-glare';

interface CustomButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  isLoading,
  loadingText,
  icon,
  children,
  ...buttonProps
}) => {
  return (
    <Button {...buttonProps}>
      {isLoading ? loadingText : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </Button>
  );
};
```

### Creating Typed Form Component

```typescript
interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

type LoginFormProps = {
  onSubmit: (data: LoginFormData) => void;
  initialValues?: Partial<LoginFormData>;
};

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  initialValues
}) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: initialValues?.email || '',
    password: initialValues?.password || '',
    rememberMe: initialValues?.rememberMe || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
};
```

---

## Best Practices

### 1. Use Type Inference

```typescript
// ✓ Good - Type is inferred
const [count, setCount] = useState(0);

// ✗ Unnecessary - Type is obvious
const [count, setCount] = useState<number>(0);
```

### 2. Use Discriminated Unions

```typescript
// ✓ Good
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// Usage
function processResult<T>(result: Result<T>) {
  if (result.success) {
    console.log(result.data); // ✓ Type is T
  } else {
    console.log(result.error); // ✓ Type is string
  }
}
```

### 3. Use Generic Constraints

```typescript
// ✓ Good - Constrained generic
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Usage
const user = { name: 'John', age: 30 };
const name = getProperty(user, 'name'); // ✓ Type is string
```

### 4. Prefer Union Types Over Enums

```typescript
// ✓ Good - Union type
type Status = 'pending' | 'approved' | 'rejected';

// ✗ Avoid - Enum (adds runtime overhead)
enum Status {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}
```

---

## Related Documentation

- [Component API Index](./components.md) - All component props
- [Hooks Reference](./hooks.md) - Custom hooks with types
- [Utilities Reference](./utilities.md) - Helper functions
- [How-to: TypeScript Integration](../how-to/guides.md#typescript-integration) - TypeScript best practices

---

## Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
