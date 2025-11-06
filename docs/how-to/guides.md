---
title: How-to Guides
description: Practical guides for common tasks and patterns with TORCH Glare Components Library.
category: How-to
tags: [guides, best-practices, customization, accessibility, typescript, validation, dark-mode]
related:
  - Getting Started
  - Theming Basics
  - Component Composition
---

# How-to Guides

Practical, step-by-step guides for accomplishing common tasks with TORCH Glare.

## Table of Contents

1. [Custom Themes](#custom-themes)
2. [Form Validation](#form-validation)
3. [Dark Mode Implementation](#dark-mode-implementation)
4. [Accessibility Best Practices](#accessibility-best-practices)
5. [TypeScript Integration](#typescript-integration)

---

## Custom Themes

Learn how to create and apply custom themes to match your brand.

### Create a Custom Color Palette

**Step 1**: Define your custom colors in `tailwind.config.ts`

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        'brand-primary': '#4200FF',
        'brand-secondary': '#5215CC',
        'brand-accent': '#CFBEFF',
        'brand-dark': '#0D0F4E',
        'brand-light': '#F9F9F9',
      },
    },
  },
  plugins: [
    require('mapping-color-system'),
    require('glare-torch-mode'),
    require('glare-typography'),
  ],
} satisfies Config;
```

**Step 2**: Override theme CSS variables

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  [data-theme="light"] {
    --background-presentation-action-primary: #4200FF;
    --content-presentation-action-light-primary: #FFFFFF;
    --border-presentation-action-primary: #5215CC;
  }

  [data-theme="dark"] {
    --background-presentation-action-primary: #5215CC;
    --content-presentation-action-light-primary: #F9F9F9;
    --border-presentation-action-primary: #CFBEFF;
  }
}
```

**Step 3**: Create custom component variants

```tsx
// components/BrandButton.tsx
import { Button } from '@torch-ai/torch-glare';
import { cn } from '@torch-ai/torch-glare/utils';

export function BrandButton({ children, ...props }: any) {
  return (
    <Button
      {...props}
      className={cn(
        'bg-brand-primary hover:bg-brand-secondary',
        'text-white border-brand-accent',
        props.className
      )}
    >
      {children}
    </Button>
  );
}
```

### Create a Custom Theme Hook

```tsx
// hooks/useCustomTheme.ts
import { useTheme } from '@torch-ai/torch-glare';
import { useEffect } from 'react';

export function useCustomTheme() {
  const { theme, updateTheme } = useTheme();

  useEffect(() => {
    // Apply custom theme classes
    if (theme === 'light') {
      document.documentElement.classList.add('brand-light-theme');
    } else {
      document.documentElement.classList.add('brand-dark-theme');
    }

    return () => {
      document.documentElement.classList.remove('brand-light-theme', 'brand-dark-theme');
    };
  }, [theme]);

  return { theme, updateTheme };
}
```

### Custom Theme Provider

```tsx
// providers/BrandThemeProvider.tsx
import { ThemeProvider } from '@torch-ai/torch-glare';

export function BrandThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" defaultThemeMode="TORCH">
      <div className="brand-theme-wrapper">
        {children}
      </div>
    </ThemeProvider>
  );
}
```

### Testing Custom Themes

```tsx
// __tests__/BrandButton.test.tsx
import { render } from '@testing-library/react';
import { ThemeProvider } from '@torch-ai/torch-glare';
import { BrandButton } from '../components/BrandButton';

describe('BrandButton', () => {
  it('applies custom brand colors', () => {
    const { container } = render(
      <ThemeProvider defaultTheme="light">
        <BrandButton>Click me</BrandButton>
      </ThemeProvider>
    );

    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-brand-primary');
  });
});
```

---

## Form Validation

Implement comprehensive form validation with error handling.

### Basic Validation Setup

```tsx
// hooks/useFormValidation.ts
import { useState, useCallback } from 'react';

type ValidationRules<T> = {
  [K in keyof T]?: Array<(value: T[K]) => string | undefined>;
};

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  rules: ValidationRules<T>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = useCallback(
    (field: keyof T, value: any): string | undefined => {
      const fieldRules = rules[field];
      if (!fieldRules) return undefined;

      for (const rule of fieldRules) {
        const error = rule(value);
        if (error) return error;
      }
      return undefined;
    },
    [rules]
  );

  const handleChange = useCallback(
    (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValues((prev) => ({ ...prev, [field]: value }));

      if (touched[field]) {
        const error = validateField(field, value);
        setErrors((prev) => ({ ...prev, [field]: error }));
      }
    },
    [touched, validateField]
  );

  const handleBlur = useCallback(
    (field: keyof T) => () => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const error = validateField(field, values[field]);
      setErrors((prev) => ({ ...prev, [field]: error }));
    },
    [values, validateField]
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(rules).forEach((field) => {
      const error = validateField(field as keyof T, values[field as keyof T]);
      if (error) {
        newErrors[field as keyof T] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(
      Object.keys(rules).reduce((acc, field) => ({ ...acc, [field]: true }), {})
    );

    return isValid;
  }, [rules, values, validateField]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    reset,
  };
}
```

### Common Validation Rules

```tsx
// utils/validationRules.ts
export const required = (message = 'This field is required') => {
  return (value: any) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return message;
    }
    return undefined;
  };
};

export const email = (message = 'Invalid email address') => {
  return (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return message;
    }
    return undefined;
  };
};

export const minLength = (min: number, message?: string) => {
  return (value: string) => {
    if (value && value.length < min) {
      return message || `Must be at least ${min} characters`;
    }
    return undefined;
  };
};

export const maxLength = (max: number, message?: string) => {
  return (value: string) => {
    if (value && value.length > max) {
      return message || `Must be no more than ${max} characters`;
    }
    return undefined;
  };
};

export const pattern = (regex: RegExp, message: string) => {
  return (value: string) => {
    if (value && !regex.test(value)) {
      return message;
    }
    return undefined;
  };
};

export const matchField = (otherField: string, message?: string) => {
  return (value: string, values: any) => {
    if (value && value !== values[otherField]) {
      return message || `Must match ${otherField}`;
    }
    return undefined;
  };
};
```

### Using Validation in Forms

```tsx
// components/RegistrationForm.tsx
'use client';

import { useFormValidation } from '../hooks/useFormValidation';
import { required, email, minLength } from '../utils/validationRules';
import { LabelField, Button, toast } from '@torch-ai/torch-glare';

export default function RegistrationForm() {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    reset,
  } = useFormValidation(
    {
      email: '',
      password: '',
      confirmPassword: '',
    },
    {
      email: [required(), email()],
      password: [required(), minLength(8, 'Password must be at least 8 characters')],
      confirmPassword: [
        required(),
        (value) => {
          if (value !== values.password) {
            return 'Passwords must match';
          }
          return undefined;
        },
      ],
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix validation errors');
      return;
    }

    // Submit form
    toast.success('Registration successful!');
    reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <LabelField
        theme="light"
        label="Email"
        requiredLabel="*"
        type="email"
        value={values.email}
        onChange={handleChange('email')}
        onBlur={handleBlur('email')}
        errorMessage={touched.email ? errors.email : undefined}
      />

      <LabelField
        theme="light"
        label="Password"
        requiredLabel="*"
        type="password"
        value={values.password}
        onChange={handleChange('password')}
        onBlur={handleBlur('password')}
        errorMessage={touched.password ? errors.password : undefined}
      />

      <LabelField
        theme="light"
        label="Confirm Password"
        requiredLabel="*"
        type="password"
        value={values.confirmPassword}
        onChange={handleChange('confirmPassword')}
        onBlur={handleBlur('confirmPassword')}
        errorMessage={touched.confirmPassword ? errors.confirmPassword : undefined}
      />

      <Button theme="light" variant="PrimeStyle" type="submit" className="w-full">
        Register
      </Button>
    </form>
  );
}
```

### Async Validation

```tsx
// Example: Check if email is available
export const emailAvailable = (message = 'Email already taken') => {
  return async (value: string) => {
    if (!value) return undefined;

    try {
      const response = await fetch(`/api/check-email?email=${value}`);
      const data = await response.json();

      if (!data.available) {
        return message;
      }
    } catch (error) {
      console.error('Email validation error:', error);
    }

    return undefined;
  };
};
```

---

## Dark Mode Implementation

Implement comprehensive dark mode support.

### Setup Dark Mode Toggle

```tsx
// components/DarkModeToggle.tsx
'use client';

import { useTheme, Button } from '@torch-ai/torch-glare';
import { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const { theme, updateTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button theme="light" variant="ContStyle" buttonType="icon">
        <div className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <Button
      theme={theme as any}
      variant="ContStyle"
      buttonType="icon"
      onClick={() => updateTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </Button>
  );
}
```

### Respect System Preferences

```tsx
// hooks/useSystemTheme.ts
import { useEffect } from 'react';
import { useTheme } from '@torch-ai/torch-glare';

export function useSystemTheme() {
  const { theme, updateTheme } = useTheme();

  useEffect(() => {
    // Only sync with system if theme is 'default'
    if (theme !== 'default') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      updateTheme(e.matches ? 'dark' : 'light');
    };

    // Set initial value
    updateTheme(mediaQuery.matches ? 'dark' : 'light');

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, updateTheme]);
}
```

### Dark Mode Images

```tsx
// components/ThemedImage.tsx
import { useTheme } from '@torch-ai/torch-glare';
import Image from 'next/image';

interface ThemedImageProps {
  lightSrc: string;
  darkSrc: string;
  alt: string;
  width?: number;
  height?: number;
}

export function ThemedImage({
  lightSrc,
  darkSrc,
  alt,
  width = 200,
  height = 200,
}: ThemedImageProps) {
  const { theme } = useTheme();

  return (
    <Image
      src={theme === 'dark' ? darkSrc : lightSrc}
      alt={alt}
      width={width}
      height={height}
      className="transition-opacity duration-200"
    />
  );
}
```

### Testing Dark Mode

```tsx
// __tests__/DarkMode.test.tsx
import { render } from '@testing-library/react';
import { ThemeProvider } from '@torch-ai/torch-glare';
import userEvent from '@testing-library/user-event';
import DarkModeToggle from '../components/DarkModeToggle';

describe('Dark Mode', () => {
  it('switches between light and dark themes', async () => {
    const user = userEvent.setup();

    const { getByRole } = render(
      <ThemeProvider defaultTheme="light">
        <DarkModeToggle />
      </ThemeProvider>
    );

    const toggle = getByRole('button');

    // Initial theme is light
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    // Click to switch to dark
    await user.click(toggle);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    // Click to switch back to light
    await user.click(toggle);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
});
```

---

## Accessibility Best Practices

Ensure your application is accessible to all users.

### Keyboard Navigation

```tsx
// components/AccessibleMenu.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@torch-ai/torch-glare';

export default function AccessibleMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const menuItems = ['Profile', 'Settings', 'Logout'];

  useEffect(() => {
    if (isOpen) {
      const menuItems = menuRef.current?.querySelectorAll('[role="menuitem"]');
      (menuItems?.[focusedIndex] as HTMLElement)?.focus();
    }
  }, [focusedIndex, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % menuItems.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + menuItems.length) % menuItems.length);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(menuItems.length - 1);
        break;
    }
  };

  return (
    <div className="relative">
      <Button
        theme="light"
        variant="PrimeStyle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        Menu
      </Button>

      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          onKeyDown={handleKeyDown}
          className="
            absolute top-full mt-2 right-0
            bg-background-presentation-form-base
            border border-border-presentation-global-primary
            rounded-lg shadow-lg
            min-w-[200px]
          "
        >
          {menuItems.map((item, index) => (
            <button
              key={item}
              role="menuitem"
              tabIndex={index === focusedIndex ? 0 : -1}
              onClick={() => {
                console.log(`Clicked ${item}`);
                setIsOpen(false);
              }}
              className="
                w-full px-4 py-2 text-left
                hover:bg-background-presentation-action-hover
                focus:bg-background-presentation-action-hover
                focus:outline-none
                typography-body-medium-regular
              "
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

### ARIA Labels and Roles

```tsx
// components/AccessibleForm.tsx
import { LabelField, Button } from '@torch-ai/torch-glare';
import { useState } from 'react';

export default function AccessibleForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  return (
    <form
      aria-label="Contact form"
      onSubmit={(e) => e.preventDefault()}
    >
      <LabelField
        theme="light"
        label="Email"
        requiredLabel="*"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? 'email-error' : undefined}
      />

      {error && (
        <p
          id="email-error"
          role="alert"
          className="typography-body-small-regular text-content-presentation-state-negative mt-1"
        >
          {error}
        </p>
      )}

      <Button
        theme="light"
        variant="PrimeStyle"
        type="submit"
        aria-label="Submit contact form"
      >
        Submit
      </Button>
    </form>
  );
}
```

### Focus Management

```tsx
// hooks/useFocusTrap.ts
import { useEffect, useRef } from 'react';

export function useFocusTrap<T extends HTMLElement>(isActive: boolean) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!isActive) return;

    const element = ref.current;
    if (!element) return;

    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    element.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return ref;
}
```

### Screen Reader Support

```tsx
// components/AccessibleButton.tsx
import { Button } from '@torch-ai/torch-glare';

interface AccessibleButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  children: React.ReactNode;
}

export function AccessibleButton({
  onClick,
  isLoading,
  children,
}: AccessibleButtonProps) {
  return (
    <Button
      theme="light"
      variant="PrimeStyle"
      onClick={onClick}
      disabled={isLoading}
      aria-busy={isLoading}
      aria-label={isLoading ? 'Loading...' : undefined}
    >
      {isLoading ? (
        <>
          <span aria-hidden="true">Loading...</span>
          <span className="sr-only">Please wait</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
}
```

---

## TypeScript Integration

Maximize type safety with TORCH Glare.

### Type-Safe Form Handling

```tsx
// types/forms.ts
export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export type FormErrors<T> = Partial<Record<keyof T, string>>;
export type FormTouched<T> = Partial<Record<keyof T, boolean>>;
```

```tsx
// components/TypeSafeForm.tsx
import { useState } from 'react';
import { LabelField, Button, toast } from '@torch-ai/torch-glare';
import type { ContactForm, FormErrors, FormTouched } from '../types/forms';

export default function TypeSafeForm() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors<ContactForm>>({});
  const [touched, setTouched] = useState<FormTouched<ContactForm>>({});

  const handleChange = <K extends keyof ContactForm>(field: K) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Form submitted!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <LabelField
        theme="light"
        label="Name"
        value={formData.name}
        onChange={handleChange('name')}
        errorMessage={touched.name ? errors.name : undefined}
      />

      {/* More fields... */}

      <Button theme="light" variant="PrimeStyle" type="submit">
        Submit
      </Button>
    </form>
  );
}
```

### Generic Components

```tsx
// components/TypedList.tsx
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

export function TypedList<T>({
  items,
  renderItem,
  keyExtractor,
}: ListProps<T>) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={keyExtractor(item)}>
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}
```

### Type-Safe Hooks

```tsx
// hooks/useTypedLocalStorage.ts
import { useState, useEffect } from 'react';

export function useTypedLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue];
}
```

### Extending Component Types

```tsx
// types/components.ts
import type { ButtonProps } from '@torch-ai/torch-glare';

export interface ExtendedButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
}
```

```tsx
// components/ExtendedButton.tsx
import { Button } from '@torch-ai/torch-glare';
import type { ExtendedButtonProps } from '../types/components';

export function ExtendedButton({
  isLoading,
  loadingText = 'Loading...',
  children,
  ...props
}: ExtendedButtonProps) {
  return (
    <Button {...props} disabled={props.disabled || isLoading}>
      {isLoading ? loadingText : children}
    </Button>
  );
}
```

### Type Guards

```tsx
// utils/typeGuards.ts
import type { User } from '../types';

export function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'email' in value &&
    'name' in value
  );
}
```

---

## Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Accessibility](https://reactjs.org/docs/accessibility.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Web Docs](https://developer.mozilla.org)

## Need More Help?

- [Component Documentation](../components/)
- [Tutorials](../tutorials/)
- [API Reference](../reference/)
- [GitHub Issues](https://github.com/torch-ai/torch-glare/issues)
