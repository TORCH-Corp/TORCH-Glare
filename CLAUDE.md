# CLAUDE.md - TORCH Glare Component Development Guide

## Project Overview

TORCH Glare is a React component library built with TypeScript, Radix UI, and Tailwind CSS. This guide explains patterns and conventions for building new components.

## Project Structure

```
TORCH-Glare/
├── apps/lib/                  # Main component library
│   ├── components/            # UI components
│   ├── hooks/                 # Custom React hooks
│   ├── layouts/               # Layout components
│   ├── providers/             # Context providers
│   └── utils/                 # Utilities (cn, types)
├── cli/                       # torch-glare CLI tool
├── plugins/                   # Tailwind plugins
└── docs/                      # Documentation
```

## Development Commands

```bash
cd apps
pnpm install
pnpm run dev          # Start dev server
pnpm run build        # Production build
pnpm run lint         # Run ESLint
```

## Component Building Patterns

### 1. File Structure

Components live in `apps/lib/components/`. Each component is a single file named in PascalCase.

### 2. Required Imports

```typescript
import React, { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import { Themes } from "../utils/types";
// For Radix-based components:
import * as PrimitiveName from "@radix-ui/react-primitive-name";
```

### 3. CVA Variant Definition

Define styles using `cva()` with variants object:

```typescript
const componentStyles = cva(
  [
    // Base styles (always applied)
    "flex items-center",
    "transition-all duration-200 ease-in-out",
    "border",
  ],
  {
    variants: {
      variant: {
        PresentationStyle: [
          "bg-background-presentation-form-field-primary",
          "border-border-presentation-action-primary",
          "hover:bg-background-presentation-form-field-hover",
          "focus-within:border-border-presentation-state-focus",
        ],
        SystemStyle: [
          "bg-black-alpha-20",
          "text-white",
          "border-[#2C2D2E]",
        ],
      },
      size: {
        S: ["h-[22px]", "text-[12px]"],
        M: ["h-[28px]", "text-[14px]"],
        L: ["h-[34px]", "text-[16px]"],
        XL: ["h-[40px]", "text-[18px]"],
      },
      error: {
        true: [
          "border-border-presentation-state-negative",
        ],
      },
      disabled: {
        true: [
          "cursor-not-allowed",
          "bg-background-presentation-action-disabled",
        ],
      },
    },
    defaultVariants: {
      variant: "PresentationStyle",
      size: "M",
    },
    compoundVariants: [
      {
        disabled: true,
        variant: "PresentationStyle",
        className: "pointer-events-none",
      },
    ],
  }
);
```

### 4. Interface Definition

Extend HTML attributes and CVA variants:

```typescript
interface Props
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentStyles> {
  theme?: Themes;
  // Custom props
}
```

For Radix-based components:

```typescript
interface Props
  extends React.ComponentPropsWithoutRef<typeof Primitive.Root>,
    VariantProps<typeof componentStyles> {
  theme?: Themes;
}
```

### 5. Component with forwardRef

```typescript
export const Component = forwardRef<HTMLDivElement, Props>(
  ({ className, variant, size, theme, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-theme={theme}
        className={cn(componentStyles({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Component.displayName = "Component";
```

### 6. Radix UI Wrapper Pattern

```typescript
"use client"

import * as DialogPrimitive from "@radix-ui/react-dialog";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className={cn("fixed inset-0 z-50 bg-black/80")} />
    <DialogPrimitive.Content
      ref={ref}
      className={cn("fixed left-[50%] top-[50%] z-50", className)}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

export { Dialog, DialogTrigger, DialogContent };
```

### 7. Compound Component Pattern (Input)

```typescript
// Group wrapper
export const Group = forwardRef<HTMLDivElement, GroupProps>(
  ({ size, variant, error, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(GroupStyles({ size, variant, error }), className)}
      {...props}
    />
  )
);

// Icon slot
export const Icon = ({ children, className }: IconProps) => (
  <div className={cn("flex items-center", className)} data-role="icon">
    {children}
  </div>
);

// Input element
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn("flex-1 bg-transparent outline-none", className)}
      {...props}
    />
  )
);
```

## Styling Conventions

### CSS Variable Naming

Use semantic CSS variables from the design system:

```
--background-{context}-{component}-{state}
--content-{context}-{component}-{state}
--border-{context}-{component}-{state}
```

Contexts: `presentation`, `system`
States: `primary`, `secondary`, `hover`, `focus`, `disabled`

### Common Background Variables
- `bg-background-presentation-form-field-primary`
- `bg-background-presentation-action-secondary`
- `bg-background-presentation-action-hover`
- `bg-background-presentation-action-disabled`
- `bg-background-presentation-state-negative-primary`

### Common Content Variables
- `text-content-presentation-action-light-primary`
- `text-content-presentation-action-hover`
- `text-content-presentation-state-disabled`

### Common Border Variables
- `border-border-presentation-action-primary`
- `border-border-presentation-action-hover`
- `border-border-presentation-state-focus`
- `border-border-presentation-state-negative`

### Typography Classes
- `typography-body-small-regular`
- `typography-body-small-medium`
- `typography-body-medium-regular`
- `typography-body-large-regular`
- `typography-body-large-medium`
- `typography-headers-medium-medium`

### Size Conventions
| Size | Height | Border Radius |
|------|--------|---------------|
| S    | 22px   | 4px           |
| M    | 28px   | 4px           |
| L    | 34px   | 6px           |
| XL   | 40px   | 6px           |

### Transition Standards
```typescript
"transition-all duration-200 ease-in-out"
```

## Hook Building Pattern

```typescript
import { useEffect, useRef } from "react";

export function useHookName<T extends HTMLElement>(
  callback: () => void
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    // Setup logic
    return () => {
      // Cleanup
    };
  }, [callback]);

  return ref;
}
```

## Provider Building Pattern

```typescript
"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface ContextProps {
  value: string;
  updateValue: (value: string) => void;
}

const Context = createContext<ContextProps | undefined>(undefined);

interface ProviderProps {
  children: ReactNode;
  defaultValue?: string;
}

export const Provider: React.FC<ProviderProps> = ({
  children,
  defaultValue = "default",
}) => {
  const [value, setValue] = useState(defaultValue);

  // Sync with DOM/localStorage in useEffect

  return (
    <Context.Provider value={{ value, updateValue: setValue }}>
      {children}
    </Context.Provider>
  );
};

export const useContextHook = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useContextHook must be used within Provider");
  }
  return context;
};
```

## Key Conventions

### 1. Theme Support
- All components accept `theme?: Themes` prop
- Apply via `data-theme={theme}` attribute
- Themes: `"dark" | "light" | "default"`

### 2. forwardRef
- All components use `forwardRef` for ref access
- Set `Component.displayName` after definition

### 3. className Merging
- Always use `cn()` utility to merge classes
- User's `className` prop always comes last

### 4. Spread Props
- Spread remaining props to root element
- Props come before ref in the element

### 5. Client Components
- Add `"use client"` directive for interactive components
- Required for Radix UI wrappers

### 6. Variant Exports
- Export CVA variants if reusable: `export const buttonVariants = cva(...)`

### 7. Icon Handling
- Use Remix Icon classes: `ri-icon-name`
- Size icons via `[&_i]:text-[size]`

### 8. State Classes
- Hover: `hover:*`
- Focus: `focus:*` or `focus-within:*`
- Disabled: `disabled:*` or `[&:has(input[disabled])]:*`
- Active: `active:*`
- Checked: `data-[state=checked]:*`
- Open: `data-[state=open]:*`

## Utility Reference

### cn() - Class Merger
```typescript
import { cn } from "../utils/cn";
cn("base-class", conditional && "applied-if-true", className)
```

### Types
```typescript
import { Themes, ButtonVariant } from "../utils/types";
// Themes: "dark" | "light" | "default"
// ButtonVariant: "PrimeStyle" | "BlueSecStyle" | ...
```

## Animation Patterns

### Radix Animations
```typescript
"data-[state=open]:animate-in"
"data-[state=closed]:animate-out"
"data-[state=closed]:fade-out-0"
"data-[state=open]:fade-in-0"
```

### Loading Spinner
- Hide icons during loading: `[&_i]:hidden` when `is_loading: true`
- Use `animate-spin` for rotation

## Common Patterns

### asChild Pattern (Radix Slot)
```typescript
import { Slot } from "@radix-ui/react-slot";

const Component = asChild ? Slot : "button";
```

### Polymorphic as Prop
```typescript
interface Props {
  as?: React.ElementType;
}
const Tag = as || "div";
<Tag {...props} />
```

### Error State with Tooltip
```typescript
<Tooltip open={error !== undefined} text={error}>
  <Component />
</Tooltip>
```

## File Checklist for New Components

1. Import dependencies (React, cva, cn, types)
2. Define CVA styles with variants
3. Define Props interface
4. Create forwardRef component
5. Set displayName
6. Export component (and variants if needed)
7. Add `"use client"` if interactive

## Path Aliases

```typescript
// In apps/lib (configured in tsconfig)
import { cn } from "@/utils/cn";        // -> ./lib/utils/cn
import { Button } from "@/components/Button";
```

## Dependencies to Know

- `class-variance-authority` - CVA for variants
- `clsx` + `tailwind-merge` - Class merging (via cn)
- `@radix-ui/*` - Accessible primitives
- `lucide-react` - Icons (alternative to Remix)
- `framer-motion` - Animations
- `react-hook-form` - Form management
