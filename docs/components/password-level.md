---
title: PasswordLevel
description: Real-time password strength indicator with visual feedback based on length, symbols, and uppercase characters
group: Feedback & Status
keywords: [password, strength, security, validation, indicator, level]
---

# PasswordLevel

> A real-time password strength indicator that visually displays password security level through a three-bar progress indicator. Evaluates password strength based on length, special characters, and uppercase letters.

## Installation

No external dependencies required.

## Import

```typescript
import { PasswordLevel } from '@torch-ui/components'
import type { PasswordLevelProps } from '@torch-ui/components'
```

## Quick Examples

### Basic Usage

```typescript
import { PasswordLevel } from '@torch-ui/components'
import { InputField } from '@torch-ui/components'
import { useState } from 'react'

function Example() {
  const [password, setPassword] = useState('')

  return (
    <div className="space-y-2">
      <InputField
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        label="Password"
      />
      <PasswordLevel value={password} />
    </div>
  )
}
```

### With Labels

```typescript
import { PasswordLevel } from '@torch-ui/components'
import { InputField } from '@torch-ui/components'
import { useState } from 'react'

function WithLabels() {
  const [password, setPassword] = useState('')

  const getStrengthLabel = (password: string) => {
    let level = 0
    if (password.length >= 6) level++
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) level++
    if (/[A-Z]/.test(password)) level++

    if (level === 0) return 'No password'
    if (level === 1) return 'Weak'
    if (level === 2) return 'Medium'
    return 'Strong'
  }

  const getStrengthColor = (password: string) => {
    const label = getStrengthLabel(password)
    if (label === 'Weak') return 'text-red-500'
    if (label === 'Medium') return 'text-yellow-500'
    if (label === 'Strong') return 'text-green-500'
    return 'text-gray-400'
  }

  return (
    <div className="space-y-2">
      <InputField
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        label="Password"
      />
      <PasswordLevel value={password} />
      <p className={`text-sm font-medium ${getStrengthColor(password)}`}>
        Password strength: {getStrengthLabel(password)}
      </p>
    </div>
  )
}
```

### Registration Form

```typescript
import { PasswordLevel } from '@torch-ui/components'
import { InputField, Button, FieldHint } from '@torch-ui/components'
import { useState } from 'react'

function RegistrationForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const passwordMatch = password && confirmPassword && password === confirmPassword

  const getPasswordLevel = (pwd: string) => {
    let level = 0
    if (pwd.length >= 6) level++
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) level++
    if (/[A-Z]/.test(pwd)) level++
    return level
  }

  const isStrongPassword = getPasswordLevel(password) === 3

  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <InputField
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Create Password"
        />
        <PasswordLevel value={password} />
        <FieldHint
          state="info"
          label="Password must be at least 6 characters with uppercase and symbols"
        />
      </div>

      <InputField
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        label="Confirm Password"
      />

      {confirmPassword && !passwordMatch && (
        <FieldHint state="error" label="Passwords do not match" />
      )}

      <Button
        type="submit"
        disabled={!isStrongPassword || !passwordMatch}
      >
        Create Account
      </Button>
    </form>
  )
}
```

### With Requirements Checklist

```typescript
import { PasswordLevel } from '@torch-ui/components'
import { InputField } from '@torch-ui/components'
import { useState } from 'react'

function PasswordWithChecklist() {
  const [password, setPassword] = useState('')

  const requirements = [
    {
      label: 'At least 6 characters',
      met: password.length >= 6,
    },
    {
      label: 'Contains a special character',
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
    {
      label: 'Contains an uppercase letter',
      met: /[A-Z]/.test(password),
    },
  ]

  return (
    <div className="space-y-4">
      <InputField
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        label="Password"
      />

      <PasswordLevel value={password} />

      <div className="space-y-2">
        <p className="text-sm font-medium">Password requirements:</p>
        <ul className="space-y-1">
          {requirements.map((req, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <i
                className={`${
                  req.met
                    ? 'ri-checkbox-circle-fill text-green-500'
                    : 'ri-checkbox-blank-circle-line text-gray-400'
                }`}
              />
              <span className={req.met ? 'text-green-600' : 'text-gray-600'}>
                {req.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
```

### Password Change Form

```typescript
import { PasswordLevel } from '@torch-ui/components'
import { InputField, Button } from '@torch-ui/components'
import { useState } from 'react'

function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const canSubmit =
    currentPassword &&
    newPassword &&
    newPassword === confirmPassword &&
    getPasswordLevel(newPassword) >= 2 // At least medium strength

  return (
    <form className="space-y-4">
      <InputField
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        label="Current Password"
      />

      <div className="space-y-2">
        <InputField
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          label="New Password"
        />
        <PasswordLevel value={newPassword} />
      </div>

      <InputField
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        label="Confirm New Password"
      />

      <Button type="submit" disabled={!canSubmit}>
        Change Password
      </Button>
    </form>
  )
}
```

### Real-time Feedback

```typescript
import { PasswordLevel } from '@torch-ui/components'
import { InputField } from '@torch-ui/components'
import { useState, useEffect } from 'react'

function RealTimeFeedback() {
  const [password, setPassword] = useState('')
  const [feedback, setFeedback] = useState<string[]>([])

  useEffect(() => {
    const newFeedback: string[] = []

    if (password.length > 0 && password.length < 6) {
      newFeedback.push('Password is too short')
    }

    if (password.length >= 6 && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      newFeedback.push('Add a special character for better security')
    }

    if (password.length >= 6 && !/[A-Z]/.test(password)) {
      newFeedback.push('Add an uppercase letter for better security')
    }

    if (!/[0-9]/.test(password) && password.length > 0) {
      newFeedback.push('Consider adding a number')
    }

    setFeedback(newFeedback)
  }, [password])

  return (
    <div className="space-y-2">
      <InputField
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        label="Password"
      />

      <PasswordLevel value={password} />

      {feedback.length > 0 && (
        <div className="space-y-1">
          {feedback.map((msg, index) => (
            <p key={index} className="text-xs text-gray-600">
              💡 {msg}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
```

### Different Themes

```typescript
import { PasswordLevel } from '@torch-ui/components'
import { useState } from 'react'

function ThemeExample() {
  const [password, setPassword] = useState('')

  return (
    <div className="space-y-4">
      <div className="p-4 bg-white">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordLevel value={password} theme="light" />
      </div>

      <div className="p-4 bg-gray-900">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordLevel value={password} theme="dark" />
      </div>
    </div>
  )
}
```

### Custom Styling

```typescript
import { PasswordLevel } from '@torch-ui/components'
import { useState } from 'react'

function CustomStyling() {
  const [password, setPassword] = useState('')

  return (
    <div className="space-y-2">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border rounded p-2"
      />

      <PasswordLevel
        value={password}
        className="!rounded-[8px] !p-[6px] !gap-[6px]"
      />
    </div>
  )
}
```

### Animated Feedback

```typescript
import { PasswordLevel } from '@torch-ui/components'
import { InputField } from '@torch-ui/components'
import { useState } from 'react'

function AnimatedFeedback() {
  const [password, setPassword] = useState('')

  const getLevel = (pwd: string) => {
    let level = 0
    if (pwd.length >= 6) level++
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) level++
    if (/[A-Z]/.test(pwd)) level++
    return level
  }

  const level = getLevel(password)

  const messages = [
    'Enter a password',
    'Weak - Add more characters',
    'Medium - Almost there!',
    'Strong - Great password!',
  ]

  return (
    <div className="space-y-2">
      <InputField
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        label="Password"
      />

      <PasswordLevel value={password} />

      <div className="transition-all duration-300">
        <p
          className={`text-sm font-medium ${
            level === 0
              ? 'text-gray-400'
              : level === 1
              ? 'text-red-500'
              : level === 2
              ? 'text-yellow-500'
              : 'text-green-500'
          }`}
        >
          {messages[level]}
        </p>
      </div>
    </div>
  )
}
```

## API Reference

### PasswordLevel Props

Extends all standard HTML div attributes.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | **required** | Password string to evaluate |
| `theme` | `'light' \| 'dark' \| 'default'` | - | Theme variant |
| `className` | `string` | - | Additional CSS classes |
| ...HTMLDivElement | - | - | All div attributes |

### Strength Calculation

Password strength is calculated based on three criteria:

| Level | Criteria | Color |
|-------|----------|-------|
| 1 | Length ≥ 6 characters | Red (Weak) |
| 2 | + Contains special character | Yellow (Medium) |
| 3 | + Contains uppercase letter | Green (Strong) |

### Special Characters

The following characters count as special characters:

```
! @ # $ % ^ & * ( ) , . ? " : { } | < >
```

## TypeScript

### Full Type Definitions

```typescript
import { HTMLAttributes } from 'react'

interface PasswordLevelProps extends HTMLAttributes<HTMLDivElement> {
  value: string
  theme?: 'light' | 'dark' | 'default'
}

export const PasswordLevel: React.FC<PasswordLevelProps>
```

### Helper Functions

```typescript
// Calculate password level
function getPasswordLevel(password: string): number {
  const symbolRegex = /[!@#$%^&*(),.?":{}|<>]/
  const uppercaseRegex = /[A-Z]/

  let level = 0
  if (password.length >= 6) level++
  if (symbolRegex.test(password)) level++
  if (uppercaseRegex.test(password)) level++

  return level
}

// Get strength label
function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' | 'none' {
  const level = getPasswordLevel(password)
  if (level === 0) return 'none'
  if (level === 1) return 'weak'
  if (level === 2) return 'medium'
  return 'strong'
}

// Check if password is acceptable
function isPasswordAcceptable(password: string, minLevel: number = 2): boolean {
  return getPasswordLevel(password) >= minLevel
}
```

## Common Patterns

### Validation Hook

```typescript
import { PasswordLevel } from '@torch-ui/components'
import { useState, useMemo } from 'react'

function usePasswordValidation(password: string) {
  const validation = useMemo(() => {
    const symbolRegex = /[!@#$%^&*(),.?":{}|<>]/
    const uppercaseRegex = /[A-Z]/
    const numberRegex = /[0-9]/

    return {
      hasMinLength: password.length >= 6,
      hasSymbol: symbolRegex.test(password),
      hasUppercase: uppercaseRegex.test(password),
      hasNumber: numberRegex.test(password),
      level: [
        password.length >= 6,
        symbolRegex.test(password),
        uppercaseRegex.test(password),
      ].filter(Boolean).length,
      isStrong: password.length >= 6 && symbolRegex.test(password) && uppercaseRegex.test(password),
    }
  }, [password])

  return validation
}

// Usage
function ValidatedPasswordField() {
  const [password, setPassword] = useState('')
  const validation = usePasswordValidation(password)

  return (
    <div className="space-y-2">
      <InputField
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        label="Password"
      />
      <PasswordLevel value={password} />

      <div className="text-xs space-y-1">
        <p className={validation.hasMinLength ? 'text-green-600' : 'text-gray-500'}>
          ✓ At least 6 characters
        </p>
        <p className={validation.hasSymbol ? 'text-green-600' : 'text-gray-500'}>
          ✓ Special character
        </p>
        <p className={validation.hasUppercase ? 'text-green-600' : 'text-gray-500'}>
          ✓ Uppercase letter
        </p>
      </div>
    </div>
  )
}
```

### Password Generator

```typescript
import { PasswordLevel } from '@torch-ui/components'
import { InputField, Button } from '@torch-ui/components'
import { useState } from 'react'

function PasswordGenerator() {
  const [password, setPassword] = useState('')

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const symbols = '!@#$%^&*(),.?":{}|<>'
    const all = uppercase + lowercase + numbers + symbols

    let pwd = ''
    // Ensure at least one of each required type
    pwd += uppercase[Math.floor(Math.random() * uppercase.length)]
    pwd += symbols[Math.floor(Math.random() * symbols.length)]

    // Fill remaining characters
    for (let i = 0; i < 10; i++) {
      pwd += all[Math.floor(Math.random() * all.length)]
    }

    // Shuffle
    pwd = pwd.split('').sort(() => Math.random() - 0.5).join('')
    setPassword(pwd)
  }

  return (
    <div className="space-y-2">
      <InputField
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        label="Password"
        childrenSide={
          <Button onClick={generatePassword} size="S">
            Generate
          </Button>
        }
      />
      <PasswordLevel value={password} />
    </div>
  )
}
```

## Testing

### Unit Test Examples

```typescript
import { render, screen } from '@testing-library/react'
import { PasswordLevel } from '@torch-ui/components'

describe('PasswordLevel', () => {
  it('renders three bars', () => {
    const { container } = render(<PasswordLevel value="" />)

    const bars = container.querySelectorAll('.h-\\[4px\\]')
    expect(bars).toHaveLength(3)
  })

  it('shows weak password (level 1)', () => {
    const { container } = render(<PasswordLevel value="password" />)

    const bars = container.querySelectorAll('[class*="bg-border-presentation-state-negative"]')
    expect(bars).toHaveLength(1) // Only first bar filled
  })

  it('shows medium password (level 2)', () => {
    const { container } = render(<PasswordLevel value="password!" />)

    const negativeBars = container.querySelectorAll('[class*="negative"]')
    const warningBars = container.querySelectorAll('[class*="warning"]')

    expect(negativeBars).toHaveLength(1) // First bar
    expect(warningBars).toHaveLength(1) // Second bar
  })

  it('shows strong password (level 3)', () => {
    const { container } = render(<PasswordLevel value="Password!123" />)

    const negativeBars = container.querySelectorAll('[class*="negative"]')
    const warningBars = container.querySelectorAll('[class*="warning"]')
    const successBars = container.querySelectorAll('[class*="success"]')

    expect(negativeBars).toHaveLength(1) // First bar
    expect(warningBars).toHaveLength(1) // Second bar
    expect(successBars).toHaveLength(1) // Third bar
  })

  it('updates level when value changes', () => {
    const { rerender, container } = render(<PasswordLevel value="pass" />)

    let bars = container.querySelectorAll('[class*="negative"]')
    expect(bars).toHaveLength(0) // Too short

    rerender(<PasswordLevel value="password" />)
    bars = container.querySelectorAll('[class*="negative"]')
    expect(bars).toHaveLength(1) // Level 1

    rerender(<PasswordLevel value="Password!123" />)
    const successBars = container.querySelectorAll('[class*="success"]')
    expect(successBars).toHaveLength(1) // Level 3
  })

  it('applies theme correctly', () => {
    const { container } = render(
      <PasswordLevel value="test" theme="dark" />
    )

    const element = container.querySelector('[data-theme="dark"]')
    expect(element).toBeInTheDocument()
  })
})
```

## Accessibility

- **Visual Indicators**: Color-coded bars (red, yellow, green)
- **Color Independence**: Always include text labels alongside colors
- **Progressive Enhancement**: Works without JavaScript (static display)
- **Screen Readers**: Add `aria-label` or `aria-describedby` for context

### Accessibility Best Practices

```typescript
// Provide text alternative
<div>
  <PasswordLevel value={password} aria-label={`Password strength: ${getStrength(password)}`} />
  <p className="sr-only">
    Password strength: {getStrength(password)}
  </p>
</div>

// Link with description
<div>
  <InputField
    id="password-input"
    type="password"
    aria-describedby="password-strength"
  />
  <div id="password-strength">
    <PasswordLevel value={password} />
    <p className="text-sm">Strength: {getStrength(password)}</p>
  </div>
</div>
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (minified) | ~1kb |
| Bundle size (gzipped) | ~0.5kb |
| Dependencies | None |
| Re-renders | Only on value change |
| Calculation complexity | O(n) where n is password length |
| Tree-shakeable | ✅ |

### Performance Tips

1. **Debounce for real-time validation**: Avoid excessive calculations
   ```typescript
   const debouncedPassword = useDebounce(password, 300)
   <PasswordLevel value={debouncedPassword} />
   ```

2. **Memoize calculations**: Cache strength calculations
   ```typescript
   const level = useMemo(() => getPasswordLevel(password), [password])
   ```

## Styling

### Default Styling

- Container: Rounded borders, grid layout with 3 columns
- Bars: 4px height, rounded, with color transitions
- Colors:
  - Level 0: Gray (secondary border)
  - Level 1: Red (negative state)
  - Level 2: Yellow (warning state)
  - Level 3: Green (success state)
- Animation: 300ms ease-in-out transitions

## Best Practices

1. **Always show with password input**: Provide immediate feedback
2. **Add text labels**: Don't rely solely on colors
3. **Set minimum requirements**: Enforce at least level 2 for important accounts
4. **Provide helpful hints**: Tell users what's missing
5. **Test all levels**: Ensure all three states display correctly
6. **Consider additional criteria**: Numbers, lowercase, special patterns
7. **Validate on submit**: Client-side indicator + server-side validation

## Related Components

- [InputField](./input-field.md) - Input field for password entry
- [FieldHint](./field-hint.md) - Inline validation messages
- [Toast](./toast.md) - Success/error notifications
- [Button](./button.md) - Submit buttons with disabled states
