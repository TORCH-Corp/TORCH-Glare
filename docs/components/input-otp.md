---
name: InputOTP
version: 1.1.15
status: stable
category: components/forms
tags: [form, otp, input, verification, authentication, accessible]
last-reviewed: 2024-11-05
bundle-size: 2.6kb
dependencies:
  - "input-otp": "^1.0.0"
---

# InputOTP

> A fully accessible OTP (One-Time Password) input component built on the input-otp library. Features individual digit slots, automatic focus management, and support for various OTP formats. Perfect for verification codes, 2FA, and PIN inputs.

## Installation

```bash
npm install torch-glare
```

## Import

```typescript
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator
} from 'torch-glare/lib/components/InputOTP'
```

## Quick Examples

### Basic 6-Digit OTP

```typescript
import { InputOTP, InputOTPGroup, InputOTPSlot } from 'torch-glare/lib/components/InputOTP'

function Example() {
  const [otp, setOtp] = useState('')

  return (
    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  )
}
```

### With Separator

```typescript
function OTPWithSeparator() {
  const [code, setCode] = useState('')

  return (
    <InputOTP maxLength={6} value={code} onChange={setCode}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  )
}
```

### 4-Digit PIN

```typescript
function PINInput() {
  const [pin, setPIN] = useState('')
  const [error, setError] = useState('')

  const handleComplete = (value: string) => {
    if (value.length === 4) {
      // Validate PIN
      if (value === '1234') {
        console.log('PIN correct!')
      } else {
        setError('Incorrect PIN')
      }
    }
  }

  useEffect(() => {
    handleComplete(pin)
  }, [pin])

  return (
    <div className="space-y-2">
      <label>Enter 4-digit PIN</label>
      <InputOTP
        maxLength={4}
        value={pin}
        onChange={(value) => {
          setPIN(value)
          setError('')
        }}
        pattern={REGEXP_ONLY_DIGITS}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
```

### SMS Verification

```typescript
function SMSVerification() {
  const [code, setCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  const handleVerify = async () => {
    if (code.length === 6) {
      setIsVerifying(true)
      try {
        await verifyCode(code)
        setIsVerified(true)
      } catch (error) {
        console.error('Verification failed')
      } finally {
        setIsVerifying(false)
      }
    }
  }

  return (
    <div className="space-y-4">
      <p>Enter the 6-digit code sent to your phone</p>

      <InputOTP
        maxLength={6}
        value={code}
        onChange={setCode}
        onComplete={handleVerify}
        disabled={isVerifying || isVerified}
      >
        <InputOTPGroup>
          {[0, 1, 2, 3, 4, 5].map(index => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>

      {isVerifying && <p>Verifying...</p>}
      {isVerified && <p className="text-green-500">✓ Verified successfully!</p>}

      <button
        onClick={handleVerify}
        disabled={code.length !== 6 || isVerifying || isVerified}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        Verify Code
      </button>
    </div>
  )
}
```

### Two-Factor Authentication

```typescript
function TwoFactorAuth() {
  const [authCode, setAuthCode] = useState('')
  const [showBackupOption, setShowBackupOption] = useState(false)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>

      <p className="text-sm text-gray-600">
        Enter the 6-digit code from your authenticator app
      </p>

      <InputOTP
        maxLength={6}
        value={authCode}
        onChange={setAuthCode}
        pattern={REGEXP_ONLY_DIGITS}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowBackupOption(!showBackupOption)}
          className="text-sm text-blue-500 hover:underline"
        >
          Use backup code instead
        </button>

        <button
          disabled={authCode.length !== 6}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Verify
        </button>
      </div>

      {showBackupOption && (
        <input
          type="text"
          placeholder="Enter backup code"
          className="w-full p-2 border rounded"
        />
      )}
    </div>
  )
}
```

### Custom Pattern (Alphanumeric)

```typescript
function AlphanumericCode() {
  const [code, setCode] = useState('')

  return (
    <div>
      <label>Enter verification code (letters and numbers)</label>
      <InputOTP
        maxLength={6}
        value={code}
        onChange={setCode}
        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        className="mt-2"
      >
        <InputOTPGroup>
          {[0, 1, 2, 3, 4, 5].map(index => (
            <InputOTPSlot
              key={index}
              index={index}
              className="uppercase"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <p className="text-xs text-gray-500 mt-1">
        Code: {code.toUpperCase()}
      </p>
    </div>
  )
}
```

### Resend Code Timer

```typescript
function OTPWithResend() {
  const [otp, setOtp] = useState('')
  const [timer, setTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(t => t - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else {
      setCanResend(true)
    }
  }, [timer])

  const handleResend = () => {
    setOtp('')
    setTimer(30)
    setCanResend(false)
    // Trigger resend API call
    console.log('Resending code...')
  }

  return (
    <div className="space-y-4">
      <InputOTP maxLength={6} value={otp} onChange={setOtp}>
        <InputOTPGroup>
          {[0, 1, 2, 3, 4, 5].map(index => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>

      <div className="text-center">
        {canResend ? (
          <button
            onClick={handleResend}
            className="text-blue-500 hover:underline"
          >
            Resend code
          </button>
        ) : (
          <p className="text-gray-500">
            Resend code in {timer}s
          </p>
        )}
      </div>
    </div>
  )
}
```

## API Reference

### InputOTP Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxLength` | `number` | - | Maximum number of characters |
| `value` | `string` | - | Controlled value |
| `onChange` | `(value: string) => void` | - | Change handler |
| `onComplete` | `(value: string) => void` | - | Called when all slots filled |
| `pattern` | `RegExp` | - | Validation pattern |
| `disabled` | `boolean` | `false` | Disables input |
| `autoFocus` | `boolean` | `false` | Focus first slot on mount |
| `className` | `string` | - | Additional CSS classes |
| `containerClassName` | `string` | - | Container CSS classes |

### InputOTPGroup Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | OTP slots |

### InputOTPSlot Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `index` | `number` | - | Slot index (required) |
| `className` | `string` | - | Additional CSS classes |

### InputOTPSeparator Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### Common Patterns

```typescript
// Digits only
import { REGEXP_ONLY_DIGITS } from 'input-otp'

// Digits and letters
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp'

// Custom pattern
const REGEXP_CUSTOM = /^[A-Z0-9]$/
```

### TypeScript

```typescript
interface InputOTPProps {
  maxLength: number
  value: string
  onChange: (value: string) => void
  onComplete?: (value: string) => void
  pattern?: RegExp
  disabled?: boolean
  autoFocus?: boolean
  className?: string
  containerClassName?: string
}

interface InputOTPSlotProps {
  index: number
  className?: string
}
```

## Common Patterns

### Email Verification

```typescript
function EmailVerification() {
  const [step, setStep] = useState<'email' | 'verify'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')

  const sendCode = async () => {
    await sendVerificationEmail(email)
    setStep('verify')
  }

  const verifyEmail = async () => {
    const isValid = await verifyEmailCode(email, code)
    if (isValid) {
      // Email verified
    }
  }

  if (step === 'email') {
    return (
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />
        <button onClick={sendCode}>Send Code</button>
      </div>
    )
  }

  return (
    <div>
      <p>Enter code sent to {email}</p>
      <InputOTP maxLength={6} value={code} onChange={setCode}>
        <InputOTPGroup>
          {[0, 1, 2, 3, 4, 5].map(i => (
            <InputOTPSlot key={i} index={i} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <button onClick={verifyEmail}>Verify</button>
    </div>
  )
}
```

### Multi-Step Verification

```typescript
function MultiStepVerification() {
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [phoneCode, setPhoneCode] = useState('')
  const [emailCode, setEmailCode] = useState('')
  const [step, setStep] = useState(1)

  return (
    <div className="space-y-6">
      {/* Step 1: Phone Verification */}
      {step === 1 && (
        <div>
          <h3>Step 1: Verify Phone</h3>
          <InputOTP maxLength={6} value={phoneCode} onChange={setPhoneCode}>
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map(i => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <button onClick={() => setStep(2)}>Next</button>
        </div>
      )}

      {/* Step 2: Email Verification */}
      {step === 2 && (
        <div>
          <h3>Step 2: Verify Email</h3>
          <InputOTP maxLength={6} value={emailCode} onChange={setEmailCode}>
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map(i => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <button onClick={() => console.log('Verified!')}>Complete</button>
        </div>
      )}
    </div>
  )
}
```

## Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { InputOTP, InputOTPGroup, InputOTPSlot } from 'torch-glare/lib/components/InputOTP'

describe('InputOTP', () => {
  it('handles input correctly', () => {
    const handleChange = jest.fn()
    render(
      <InputOTP maxLength={4} onChange={handleChange}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
    )

    const input = screen.getByRole('textbox', { hidden: true })
    fireEvent.change(input, { target: { value: '1234' } })

    expect(handleChange).toHaveBeenCalledWith('1234')
  })

  it('calls onComplete when all slots filled', () => {
    const handleComplete = jest.fn()
    render(
      <InputOTP
        maxLength={4}
        onComplete={handleComplete}
      >
        <InputOTPGroup>
          {[0, 1, 2, 3].map(i => (
            <InputOTPSlot key={i} index={i} />
          ))}
        </InputOTPGroup>
      </InputOTP>
    )

    const input = screen.getByRole('textbox', { hidden: true })
    fireEvent.change(input, { target: { value: '1234' } })

    expect(handleComplete).toHaveBeenCalledWith('1234')
  })
})
```

### Accessibility Test

```typescript
import { axe } from '@axe-core/react'

test('InputOTP meets WCAG standards', async () => {
  const { container } = render(
    <div>
      <label htmlFor="otp">Enter verification code</label>
      <InputOTP maxLength={6} id="otp">
        <InputOTPGroup>
          {[0, 1, 2, 3, 4, 5].map(i => (
            <InputOTPSlot key={i} index={i} />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  )

  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## Accessibility

### Keyboard Support

- **Arrow Keys**: Navigate between slots
- **Backspace**: Delete and move to previous slot
- **Delete**: Clear current slot
- **Tab**: Move focus out of component
- **Numbers/Letters**: Input based on pattern

### ARIA Support

- Hidden input field manages actual value
- Individual slots are visual only
- Screen readers announce the full value
- Proper label association

### Best Practices

```typescript
// Always provide a label
<label htmlFor="verification-code">
  Enter the 6-digit code
</label>
<InputOTP id="verification-code" maxLength={6}>
  {/* slots */}
</InputOTP>

// Provide clear instructions
<div role="status" aria-live="polite">
  {code.length === 6 ? 'Code complete' : `${6 - code.length} digits remaining`}
</div>
```

## Styling

### Slot States

```css
/* Default slot */
.slot {
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
}

/* Active/focused slot */
.slot[data-active="true"] {
  border-color: var(--focus-color);
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.3);
}

/* Slot with value */
.slot:not(:empty) {
  font-weight: 500;
}
```

### Custom Slot Styles

```typescript
<InputOTPSlot
  index={0}
  className="w-12 h-12 text-lg font-bold"
/>
```

### Theme Variants

```typescript
// Custom themed slots
<InputOTPSlot
  index={0}
  className="border-blue-500 focus:border-blue-600"
/>
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (gzip) | 2.6kb |
| First render | <6ms |
| Input handling | <1ms |
| Focus transition | <2ms |
| Tree-shakeable | ✅ |

### Optimization Tips

1. Use React.memo for static surrounding elements
2. Avoid re-rendering parent on each input change
3. Debounce validation calls
4. Use onComplete for API calls instead of onChange

## Migration

### From Custom OTP Input

```diff
// From custom implementation
- <div className="flex gap-2">
-   {[0,1,2,3].map(i => (
-     <input
-       key={i}
-       maxLength={1}
-       className="w-10 h-10"
-     />
-   ))}
- </div>

// To InputOTP
+ <InputOTP maxLength={4}>
+   <InputOTPGroup>
+     {[0,1,2,3].map(i => (
+       <InputOTPSlot key={i} index={i} />
+     ))}
+   </InputOTPGroup>
+ </InputOTP>
```

## Troubleshooting

### Paste not working

**Solution:** Ensure pattern allows pasted characters

```typescript
// Allow paste of 6 digits
<InputOTP
  maxLength={6}
  pattern={REGEXP_ONLY_DIGITS}
  onPaste={(e) => {
    const pasted = e.clipboardData.getData('text')
    if (/^\d{6}$/.test(pasted)) {
      onChange(pasted)
    }
  }}
/>
```

### Focus not moving between slots

**Solution:** This is handled automatically by input-otp

```typescript
// Focus management is automatic
<InputOTP autoFocus> {/* Focus first slot */}
```

## Related Components

- [Input](/docs/components/input.md) - Basic input
- [InputField](/docs/components/input-field.md) - Enhanced input
- [Form](/docs/components/form.md) - Form wrapper

## Browser Support

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile browsers ✅

## Changelog

### v1.1.15
- Integrated input-otp library
- Added slot components
- Enhanced accessibility

### v1.1.14
- Initial OTP input planning

### v1.1.0
- Component requirements defined