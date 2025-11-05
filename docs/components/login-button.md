---
title: LoginButton
description: Full-width authentication button designed for login forms and auth flows.
component: true
group: Buttons & Actions
keywords: [button, login, auth, authentication, sign-in, full-width]
---

# LoginButton

A specialized full-width button component designed specifically for authentication flows. Features loading states, two visual variants, and optimized sizing for login forms.

## Installation

```bash
npx torch-cli add login-button
```

## Imports

```typescript
import { LoginButton } from '@/components/LoginButton'
```

## Basic Usage

```tsx
import { LoginButton } from '@/components/LoginButton'

export function BasicLoginButton() {
  return (
    <LoginButton onClick={handleLogin}>
      Sign In
    </LoginButton>
  )
}
```

## Examples

### Login Form

Complete login form implementation.

```tsx
export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login({ email, password })
      // Handle successful login
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>

      <LoginButton
        type="submit"
        isLoading={isLoading}
        disabled={isLoading || !email || !password}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </LoginButton>
    </form>
  )
}
```

### Variants

LoginButton offers two variants: default and noBg.

```tsx
export function LoginButtonVariants() {
  return (
    <div className="w-full max-w-md space-y-4">
      <LoginButton variant="default">
        Sign In with Email
      </LoginButton>

      <LoginButton variant="noBg">
        Sign In with Email
      </LoginButton>
    </div>
  )
}
```

### Social Login Buttons

OAuth and social authentication buttons.

```tsx
export function SocialLoginButtons() {
  const [loadingProvider, setLoadingProvider] = useState(null)

  const handleSocialLogin = async (provider) => {
    setLoadingProvider(provider)
    try {
      await signInWithProvider(provider)
    } catch (error) {
      console.error(`${provider} login failed:`, error)
    } finally {
      setLoadingProvider(null)
    }
  }

  return (
    <div className="w-full max-w-md space-y-3">
      <LoginButton
        onClick={() => handleSocialLogin('google')}
        isLoading={loadingProvider === 'google'}
        disabled={loadingProvider !== null}
      >
        <i className="ri-google-fill mr-2"></i>
        Continue with Google
      </LoginButton>

      <LoginButton
        onClick={() => handleSocialLogin('github')}
        isLoading={loadingProvider === 'github'}
        disabled={loadingProvider !== null}
        variant="noBg"
      >
        <i className="ri-github-fill mr-2"></i>
        Continue with GitHub
      </LoginButton>

      <LoginButton
        onClick={() => handleSocialLogin('microsoft')}
        isLoading={loadingProvider === 'microsoft'}
        disabled={loadingProvider !== null}
        variant="noBg"
      >
        <i className="ri-microsoft-fill mr-2"></i>
        Continue with Microsoft
      </LoginButton>
    </div>
  )
}
```

### Two-Factor Authentication

Login flow with 2FA support.

```tsx
export function TwoFactorLogin() {
  const [step, setStep] = useState('credentials') // 'credentials' | '2fa'
  const [isLoading, setIsLoading] = useState(false)
  const [code, setCode] = useState('')

  const handleInitialLogin = async () => {
    setIsLoading(true)
    try {
      const requires2FA = await attemptLogin()
      if (requires2FA) {
        setStep('2fa')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify2FA = async () => {
    setIsLoading(true)
    try {
      await verify2FA(code)
      // Handle successful verification
    } finally {
      setIsLoading(false)
    }
  }

  if (step === '2fa') {
    return (
      <div className="w-full max-w-md space-y-4">
        <h3 className="text-lg font-semibold">Enter verification code</h3>
        <p className="text-sm text-gray-600">
          We've sent a code to your registered device
        </p>

        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="000000"
          maxLength={6}
          className="w-full px-3 py-2 border rounded-lg text-center text-lg tracking-widest"
        />

        <LoginButton
          onClick={handleVerify2FA}
          isLoading={isLoading}
          disabled={isLoading || code.length !== 6}
        >
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </LoginButton>

        <LoginButton
          variant="noBg"
          onClick={() => setStep('credentials')}
          disabled={isLoading}
        >
          Back to login
        </LoginButton>
      </div>
    )
  }

  return (
    // Initial login form
    <LoginButton
      onClick={handleInitialLogin}
      isLoading={isLoading}
    >
      Sign In
    </LoginButton>
  )
}
```

### Sign Up Flow

Registration form with LoginButton.

```tsx
export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const handleSignUp = async (e) => {
    e.preventDefault()
    if (!agreed) return

    setIsLoading(true)
    try {
      await createAccount(formData)
      // Handle successful signup
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSignUp} className="w-full max-w-md space-y-4">
      {/* Form fields */}

      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="terms"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1"
        />
        <label htmlFor="terms" className="text-sm">
          I agree to the Terms of Service and Privacy Policy
        </label>
      </div>

      <LoginButton
        type="submit"
        isLoading={isLoading}
        disabled={isLoading || !agreed}
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </LoginButton>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or</span>
        </div>
      </div>

      <LoginButton variant="noBg">
        Sign In to Existing Account
      </LoginButton>
    </form>
  )
}
```

### Password Reset

Password reset flow implementation.

```tsx
export function PasswordResetFlow() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleReset = async () => {
    setIsLoading(true)
    try {
      await sendPasswordResetEmail(email)
      setSent(true)
    } finally {
      setIsLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="w-full max-w-md space-y-4 text-center">
        <i className="ri-mail-check-line text-4xl text-green-500"></i>
        <h3 className="text-lg font-semibold">Check your email</h3>
        <p className="text-sm text-gray-600">
          We've sent password reset instructions to {email}
        </p>

        <LoginButton onClick={() => setSent(false)}>
          Send Again
        </LoginButton>

        <LoginButton variant="noBg" onClick={() => window.location.href = '/login'}>
          Back to Login
        </LoginButton>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <h3 className="text-lg font-semibold">Reset your password</h3>
      <p className="text-sm text-gray-600">
        Enter your email and we'll send you instructions
      </p>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="w-full px-3 py-2 border rounded-lg"
      />

      <LoginButton
        onClick={handleReset}
        isLoading={isLoading}
        disabled={isLoading || !email}
      >
        {isLoading ? 'Sending...' : 'Send Reset Link'}
      </LoginButton>

      <LoginButton variant="noBg" onClick={() => window.location.href = '/login'}>
        Back to Login
      </LoginButton>
    </div>
  )
}
```

### Magic Link Authentication

Passwordless authentication flow.

```tsx
export function MagicLinkLogin() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [linkSent, setLinkSent] = useState(false)

  const handleSendMagicLink = async () => {
    setIsLoading(true)
    try {
      await sendMagicLink(email)
      setLinkSent(true)
    } finally {
      setIsLoading(false)
    }
  }

  if (linkSent) {
    return (
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <i className="ri-mail-send-line text-4xl text-blue-500 mb-4"></i>
          <h3 className="text-lg font-semibold">Check your inbox!</h3>
          <p className="text-sm text-gray-600 mt-2">
            We sent a magic link to {email}
          </p>
        </div>

        <LoginButton
          variant="noBg"
          onClick={() => setLinkSent(false)}
        >
          Use a different email
        </LoginButton>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <h3 className="text-lg font-semibold">Sign in with magic link</h3>
      <p className="text-sm text-gray-600">
        We'll email you a secure link to sign in instantly
      </p>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="w-full px-3 py-2 border rounded-lg"
        required
      />

      <LoginButton
        onClick={handleSendMagicLink}
        isLoading={isLoading}
        disabled={isLoading || !email}
      >
        {isLoading ? 'Sending magic link...' : 'Send Magic Link'}
      </LoginButton>
    </div>
  )
}
```

### Session Management

Login with session timeout warning.

```tsx
export function SessionLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      await login({
        sessionDuration: rememberMe ? '30d' : '24h'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-4">
      {/* Login fields */}

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <span className="text-sm">Remember me for 30 days</span>
        </label>

        <a href="/forgot" className="text-sm text-blue-500 hover:underline">
          Forgot password?
        </a>
      </div>

      <LoginButton
        onClick={handleLogin}
        isLoading={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </LoginButton>

      <p className="text-xs text-center text-gray-500">
        {rememberMe
          ? 'You'll stay signed in for 30 days'
          : 'Session expires after 24 hours of inactivity'}
      </p>
    </div>
  )
}
```

### Multi-Step Authentication

Complex authentication with multiple steps.

```tsx
export function MultiStepAuth() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const steps = [
    { title: 'Enter Email', action: 'Continue' },
    { title: 'Enter Password', action: 'Sign In' },
    { title: 'Verify Identity', action: 'Verify' },
  ]

  const handleNext = async () => {
    setIsLoading(true)
    try {
      // Process current step
      if (step < steps.length) {
        setStep(step + 1)
      } else {
        // Complete authentication
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-4">
      {/* Step indicator */}
      <div className="flex justify-between mb-6">
        {steps.map((_, index) => (
          <div
            key={index}
            className={cn(
              "h-2 flex-1 mx-1 rounded-full",
              index < step
                ? "bg-blue-500"
                : "bg-gray-200"
            )}
          />
        ))}
      </div>

      <h3 className="text-lg font-semibold">
        Step {step}: {steps[step - 1].title}
      </h3>

      {/* Step-specific content */}

      <LoginButton
        onClick={handleNext}
        isLoading={isLoading}
      >
        {isLoading ? 'Processing...' : steps[step - 1].action}
      </LoginButton>

      {step > 1 && (
        <LoginButton
          variant="noBg"
          onClick={() => setStep(step - 1)}
          disabled={isLoading}
        >
          Back
        </LoginButton>
      )}
    </div>
  )
}
```

## API Reference

### LoginButton Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `'default' \| 'noBg'` | `'default'` | Visual variant |
| isLoading | `boolean` | `false` | Loading state |
| theme | `Themes` | - | Theme override |
| className | `string` | - | Additional CSS classes |
| children | `ReactNode` | - | Button content |
| onClick | `() => void` | - | Click handler |
| type | `'button' \| 'submit' \| 'reset'` | `'button'` | Button type |
| disabled | `boolean` | `false` | Disabled state |

### Variants

| Variant | Description | Use Case |
|---------|-------------|----------|
| default | Solid background with border | Primary actions |
| noBg | Transparent background with border | Secondary actions |

## Styling

### Base Styles

- **Full Width**: Always spans 100% of container width
- **Fixed Height**: 42px for consistent form layouts
- **Rounded Corners**: 8px border radius
- **Typography**: body-large-regular for optimal readability
- **Transitions**: Smooth 250ms animations

### Variant Styles

#### Default Variant
```css
.default {
  background: var(--background-system-body-primary);
  color: var(--content-system-global-primary);
  border: 1px solid var(--border-system-global-primary);
}

.default:hover {
  border-color: #9748FF;
}
```

#### NoBg Variant
```css
.noBg {
  background: transparent;
  color: var(--content-system-global-primary);
  border: 1px solid var(--border-system-global-primary);
}

.noBg:hover {
  border-color: #9748FF;
}
```

## TypeScript Types

```typescript
interface LoginButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'noBg'
  isLoading?: boolean
  theme?: Themes
}

type Themes = 'light' | 'dark' | 'default'
```

## Common Patterns

### Auth Form Component

```tsx
function AuthForm({ mode = 'signin' }) {
  const [isLoading, setIsLoading] = useState(false)

  const buttonText = {
    signin: 'Sign In',
    signup: 'Create Account',
    reset: 'Reset Password',
  }

  return (
    <form className="w-full max-w-md space-y-4">
      {/* Form fields based on mode */}

      <LoginButton
        type="submit"
        isLoading={isLoading}
      >
        {isLoading ? 'Processing...' : buttonText[mode]}
      </LoginButton>

      <LoginButton
        variant="noBg"
        type="button"
        onClick={() => {/* Navigate to alternative */}}
      >
        {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
      </LoginButton>
    </form>
  )
}
```

### Error Handling

```tsx
function LoginWithError() {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setError(null)
    setIsLoading(true)

    try {
      await login()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <LoginButton
        onClick={handleLogin}
        isLoading={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </LoginButton>
    </div>
  )
}
```

## Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { LoginButton } from '@/components/LoginButton'

describe('LoginButton', () => {
  it('renders with full width', () => {
    render(<LoginButton>Sign In</LoginButton>)
    const button = screen.getByText('Sign In')
    expect(button).toHaveClass('w-full')
  })

  it('shows loading state', () => {
    const { container } = render(
      <LoginButton isLoading={true}>
        Sign In
      </LoginButton>
    )

    const loadingIcon = container.querySelector('.ri-loader-4-line')
    expect(loadingIcon).toBeInTheDocument()
  })

  it('applies variant styles', () => {
    render(<LoginButton variant="noBg">Sign In</LoginButton>)
    const button = screen.getByText('Sign In')
    expect(button).toHaveClass('bg-transparent')
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(
      <LoginButton onClick={handleClick}>
        Sign In
      </LoginButton>
    )

    fireEvent.click(screen.getByText('Sign In'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('disables when loading', () => {
    render(
      <LoginButton isLoading={true}>
        Sign In
      </LoginButton>
    )

    const button = screen.getByRole('button')
    // Loading state shows loading icon, not disabled attribute
    expect(button.querySelector('.animate-spin')).toBeInTheDocument()
  })
})
```

## Accessibility

- **Full Width**: Ensures easy tap target on mobile devices
- **Loading States**: Clear visual and programmatic loading indicators
- **Keyboard Support**: Full keyboard navigation support
- **Focus Management**: Clear focus states for keyboard users
- **ARIA Support**: Proper ARIA attributes for screen readers
- **Contrast Ratios**: Meets WCAG AA standards

### Accessibility Example

```tsx
<LoginButton
  aria-label="Sign in to your account"
  aria-describedby="login-help"
  isLoading={isLoading}
  aria-busy={isLoading}
>
  {isLoading ? 'Signing in...' : 'Sign In'}
</LoginButton>
<span id="login-help" className="sr-only">
  Enter your email and password above, then click this button
</span>
```

## Performance

- **Optimized Animations**: CSS transitions for smooth hover effects
- **Loading Icon**: Lightweight SVG animation
- **Minimal Re-renders**: Loading state managed efficiently
- **CSS Variables**: Theme changes without component re-renders

## Migration Guide

### From Custom Buttons

```tsx
// Before: Custom full-width button
<button className="w-full py-2 px-4 bg-blue-500 text-white rounded">
  Sign In
</button>

// After: LoginButton
<LoginButton>
  Sign In
</LoginButton>
```

### From Other Libraries

```tsx
// Before: Material-UI Button
<Button
  fullWidth
  variant="contained"
  loading={isLoading}
>
  Sign In
</Button>

// After: LoginButton
<LoginButton isLoading={isLoading}>
  Sign In
</LoginButton>
```

## Best Practices

1. **Always Full Width**: LoginButton is designed to span container width
2. **Loading Feedback**: Always show loading state during async operations
3. **Error Handling**: Display clear error messages above the button
4. **Disabled States**: Disable when form is invalid or processing
5. **Alternative Actions**: Use noBg variant for secondary auth options
6. **Mobile Optimization**: Ensure parent container has appropriate padding
7. **Form Integration**: Use type="submit" for form submissions