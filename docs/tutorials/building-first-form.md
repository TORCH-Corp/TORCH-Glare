---
title: Building Your First Form
description: Complete guide to creating forms with TORCH Glare including validation, error handling, and best practices.
category: Tutorial
difficulty: Intermediate
duration: 30 minutes
tags: [forms, validation, input, error-handling, user-input]
related:
  - Getting Started
  - Component Composition
  - LabelField Component
  - InputField Component
---

# Building Your First Form

Learn how to build complete, production-ready forms with TORCH Glare. This tutorial covers everything from basic inputs to validation and error handling.

## What You'll Build

A user registration form with:
- Multiple input types (text, email, password)
- Form validation
- Error handling and display
- Password strength indicator
- Success feedback
- Responsive design

## Prerequisites

- Completed the [Getting Started](./getting-started.md) tutorial
- Basic understanding of React hooks
- Familiarity with form handling in React

---

## Step 1: Create the Form Component

Let's start with a basic form structure:

```tsx
// components/RegistrationForm.tsx
'use client';

import { useState } from 'react';
import { Button } from '@torch-ai/torch-glare';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6">
      <h2 className="typography-display-medium-bold mb-6">
        Create Account
      </h2>

      {/* We'll add fields here */}

      <Button theme="light" variant="PrimeStyle" type="submit" className="w-full">
        Register
      </Button>
    </form>
  );
}
```

---

## Step 2: Add Input Fields

### Using LabelField Component

`LabelField` combines a label and input field with built-in styling:

```tsx
import { useState } from 'react';
import { LabelField, Button } from '@torch-ai/torch-glare';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="typography-display-medium-bold mb-6">
        Create Account
      </h2>

      <LabelField
        theme="light"
        label="Full Name"
        requiredLabel="*"
        value={formData.fullName}
        onChange={handleChange('fullName')}
        placeholder="John Doe"
      />

      <LabelField
        theme="light"
        label="Email"
        requiredLabel="*"
        type="email"
        value={formData.email}
        onChange={handleChange('email')}
        placeholder="you@example.com"
      />

      <LabelField
        theme="light"
        label="Password"
        requiredLabel="*"
        type="password"
        value={formData.password}
        onChange={handleChange('password')}
        placeholder="••••••••"
      />

      <LabelField
        theme="light"
        label="Confirm Password"
        requiredLabel="*"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange('confirmPassword')}
        placeholder="••••••••"
      />

      <Button theme="light" variant="PrimeStyle" type="submit" className="w-full">
        Register
      </Button>
    </form>
  );
}
```

---

## Step 3: Add Validation

Let's add comprehensive validation:

```tsx
'use client';

import { useState, FormEvent } from 'react';
import { LabelField, Button, FieldHint } from '@torch-ai/torch-glare';

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation functions
  const validateFullName = (name: string): string | undefined => {
    if (!name.trim()) return 'Full name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain a number';
    return undefined;
  };

  const validateConfirmPassword = (confirmPassword: string): string | undefined => {
    if (!confirmPassword) return 'Please confirm your password';
    if (confirmPassword !== formData.password) return 'Passwords do not match';
    return undefined;
  };

  // Handle field changes
  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));

    // Validate on change if field has been touched
    if (touched[field]) {
      validateField(field, value);
    }
  };

  // Handle blur events
  const handleBlur = (field: keyof typeof formData) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  // Validate individual field
  const validateField = (field: keyof typeof formData, value: string) => {
    let error: string | undefined;

    switch (field) {
      case 'fullName':
        error = validateFullName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(value);
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      fullName: validateFullName(formData.fullName),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword),
    };

    setErrors(newErrors);
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    return !Object.values(newErrors).some(error => error !== undefined);
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      console.log('Form is valid:', formData);
      // Submit form data
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="typography-display-medium-bold mb-6">
        Create Account
      </h2>

      <div>
        <LabelField
          theme="light"
          label="Full Name"
          requiredLabel="*"
          value={formData.fullName}
          onChange={handleChange('fullName')}
          onBlur={handleBlur('fullName')}
          placeholder="John Doe"
          errorMessage={touched.fullName ? errors.fullName : undefined}
        />
      </div>

      <div>
        <LabelField
          theme="light"
          label="Email"
          requiredLabel="*"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          onBlur={handleBlur('email')}
          placeholder="you@example.com"
          errorMessage={touched.email ? errors.email : undefined}
        />
      </div>

      <div>
        <LabelField
          theme="light"
          label="Password"
          requiredLabel="*"
          type="password"
          value={formData.password}
          onChange={handleChange('password')}
          onBlur={handleBlur('password')}
          placeholder="••••••••"
          errorMessage={touched.password ? errors.password : undefined}
        />
      </div>

      <div>
        <LabelField
          theme="light"
          label="Confirm Password"
          requiredLabel="*"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          onBlur={handleBlur('confirmPassword')}
          placeholder="••••••••"
          errorMessage={touched.confirmPassword ? errors.confirmPassword : undefined}
        />
      </div>

      <Button theme="light" variant="PrimeStyle" type="submit" className="w-full">
        Register
      </Button>
    </form>
  );
}
```

---

## Step 4: Add Password Strength Indicator

Use the `PasswordLevel` component to show password strength:

```tsx
import { LabelField, PasswordLevel, Button } from '@torch-ai/torch-glare';

// Inside your form component, add this after the password field:

<div>
  <LabelField
    theme="light"
    label="Password"
    requiredLabel="*"
    type="password"
    value={formData.password}
    onChange={handleChange('password')}
    onBlur={handleBlur('password')}
    placeholder="••••••••"
    errorMessage={touched.password ? errors.password : undefined}
  />

  {/* Password strength indicator */}
  {formData.password && (
    <div className="mt-2">
      <PasswordLevel theme="light" value={formData.password} />
    </div>
  )}
</div>
```

---

## Step 5: Add Field Hints

Use `FieldHint` to provide helpful guidance:

```tsx
import { LabelField, FieldHint, Button } from '@torch-ai/torch-glare';

<div>
  <LabelField
    theme="light"
    label="Email"
    requiredLabel="*"
    type="email"
    value={formData.email}
    onChange={handleChange('email')}
    onBlur={handleBlur('email')}
    placeholder="you@example.com"
    errorMessage={touched.email ? errors.email : undefined}
  />

  {!errors.email && !touched.email && (
    <FieldHint
      theme="light"
      state="info"
      label="We'll never share your email with anyone"
      className="mt-2"
    />
  )}
</div>
```

---

## Step 6: Add Loading State

Show loading feedback during submission:

```tsx
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsSubmitting(true);

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Registration successful:', formData);
    // Handle success (e.g., redirect, show success message)
  } catch (error) {
    console.error('Registration failed:', error);
    // Handle error
  } finally {
    setIsSubmitting(false);
  }
};

// Update button
<Button
  theme="light"
  variant="PrimeStyle"
  type="submit"
  className="w-full"
  disabled={isSubmitting}
>
  {isSubmitting ? 'Registering...' : 'Register'}
</Button>
```

---

## Step 7: Add Success Feedback with Toast

Use the `toast` function for success notifications:

```tsx
import { LabelField, Button, toast } from '@torch-ai/torch-glare';

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  if (!validateForm()) {
    toast.error('Please fix the errors in the form');
    return;
  }

  setIsSubmitting(true);

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast.success('Account created successfully!');

    // Reset form
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setErrors({});
    setTouched({});
  } catch (error) {
    toast.error('Registration failed. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};
```

---

## Step 8: Complete Form Example

Here's the complete, production-ready form:

```tsx
'use client';

import { useState, FormEvent } from 'react';
import {
  LabelField,
  Button,
  PasswordLevel,
  FieldHint,
  toast,
} from '@torch-ai/torch-glare';

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateFullName = (name: string): string | undefined => {
    if (!name.trim()) return 'Full name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain a number';
    return undefined;
  };

  const validateConfirmPassword = (confirmPassword: string): string | undefined => {
    if (!confirmPassword) return 'Please confirm your password';
    if (confirmPassword !== formData.password) return 'Passwords do not match';
    return undefined;
  };

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));

    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field: keyof typeof formData) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const validateField = (field: keyof typeof formData, value: string) => {
    let error: string | undefined;

    switch (field) {
      case 'fullName':
        error = validateFullName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(value);
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      fullName: validateFullName(formData.fullName),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword),
    };

    setErrors(newErrors);
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    return !Object.values(newErrors).some(error => error !== undefined);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success('Account created successfully!');

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setErrors({});
      setTouched({});
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="
          max-w-md w-full p-6 space-y-4
          bg-background-presentation-form-base
          border border-border-presentation-global-primary
          rounded-lg
        "
      >
        <div className="mb-6">
          <h2 className="typography-display-medium-bold mb-2">
            Create Account
          </h2>
          <p className="typography-body-medium-regular text-content-presentation-global-secondary">
            Join us and get started today
          </p>
        </div>

        <div>
          <LabelField
            theme="light"
            label="Full Name"
            requiredLabel="*"
            value={formData.fullName}
            onChange={handleChange('fullName')}
            onBlur={handleBlur('fullName')}
            placeholder="John Doe"
            errorMessage={touched.fullName ? errors.fullName : undefined}
          />
        </div>

        <div>
          <LabelField
            theme="light"
            label="Email"
            requiredLabel="*"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            placeholder="you@example.com"
            errorMessage={touched.email ? errors.email : undefined}
          />
          {!errors.email && !touched.email && (
            <FieldHint
              theme="light"
              state="info"
              label="We'll never share your email"
              className="mt-2"
            />
          )}
        </div>

        <div>
          <LabelField
            theme="light"
            label="Password"
            requiredLabel="*"
            type="password"
            value={formData.password}
            onChange={handleChange('password')}
            onBlur={handleBlur('password')}
            placeholder="••••••••"
            errorMessage={touched.password ? errors.password : undefined}
          />
          {formData.password && (
            <div className="mt-2">
              <PasswordLevel theme="light" value={formData.password} />
            </div>
          )}
        </div>

        <div>
          <LabelField
            theme="light"
            label="Confirm Password"
            requiredLabel="*"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            onBlur={handleBlur('confirmPassword')}
            placeholder="••••••••"
            errorMessage={touched.confirmPassword ? errors.confirmPassword : undefined}
          />
        </div>

        <Button
          theme="light"
          variant="PrimeStyle"
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </Button>

        <p className="typography-body-small-regular text-content-presentation-global-secondary text-center">
          Already have an account?{' '}
          <a href="/login" className="text-content-presentation-action-light-primary">
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}
```

---

## Best Practices

### 1. Validate on Blur, Not on Every Keystroke

```tsx
// ✓ Good - Validate after user leaves field
<LabelField
  onBlur={handleBlur('email')}
  onChange={handleChange('email')}
/>

// ✗ Avoid - Immediate validation on every keystroke
<LabelField
  onChange={(e) => {
    handleChange('email')(e);
    validateField('email', e.target.value);
  }}
/>
```

### 2. Show Errors Only After Touch

```tsx
// Only show errors for fields the user has interacted with
errorMessage={touched.email ? errors.email : undefined}
```

### 3. Disable Submit During Submission

```tsx
<Button
  type="submit"
  disabled={isSubmitting || Object.keys(errors).length > 0}
>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</Button>
```

### 4. Provide Clear Error Messages

```tsx
// ✓ Good - Specific and actionable
'Password must contain at least one uppercase letter'

// ✗ Bad - Vague
'Invalid password'
```

### 5. Reset Form After Success

```tsx
const handleSuccess = () => {
  setFormData(initialState);
  setErrors({});
  setTouched({});
  toast.success('Success!');
};
```

---

## Next Steps

Now that you can build forms, explore:

1. **[Component Composition](./component-composition.md)** - Combine components for complex UIs
2. **[Theming Basics](./theming-basics.md)** - Customize form appearance
3. **[Select Component](../components/select.md)** - Add dropdown fields
4. **[Checkbox Component](../components/checkbox.md)** - Add checkboxes

## Additional Resources

- [LabelField API](../components/label-field.md)
- [InputField API](../components/input-field.md)
- [PasswordLevel API](../components/password-level.md)
- [FieldHint API](../components/field-hint.md)
- [Toast API](../components/toast.md)
