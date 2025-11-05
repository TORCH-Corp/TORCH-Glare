---
name: Switch
version: 1.1.15
status: stable
category: components/forms
tags: [form, switch, toggle, radix-ui, accessible, controlled]
last-reviewed: 2024-11-05
bundle-size: 1.6kb
dependencies:
  - "@radix-ui/react-switch": "^1.0.0"
---

# Switch

> A fully accessible toggle switch component built on Radix UI primitives. Perfect for boolean settings, feature toggles, and on/off states with smooth animations and keyboard support.

## Installation

```bash
npm install torch-glare
```

## Import

```typescript
import { Switch } from 'torch-glare/lib/components/Switch'
```

## Quick Examples

### Basic Usage

```typescript
import { Switch } from 'torch-glare/lib/components/Switch'

function Example() {
  const [enabled, setEnabled] = useState(false)

  return (
    <Switch
      checked={enabled}
      onCheckedChange={setEnabled}
    />
  )
}
```

### With Label

```typescript
function LabeledSwitch() {
  const [notifications, setNotifications] = useState(true)

  return (
    <div className="flex items-center space-x-3">
      <Switch
        id="notifications"
        checked={notifications}
        onCheckedChange={setNotifications}
      />
      <label
        htmlFor="notifications"
        className="text-sm font-medium cursor-pointer"
      >
        Enable notifications
      </label>
    </div>
  )
}
```

### Settings Panel

```typescript
function SettingsPanel() {
  const [settings, setSettings] = useState({
    darkMode: false,
    autoSave: true,
    notifications: true,
    analytics: false
  })

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label htmlFor="dark-mode" className="flex flex-col">
          <span className="text-sm font-medium">Dark Mode</span>
          <span className="text-xs text-gray-500">Use dark theme</span>
        </label>
        <Switch
          id="dark-mode"
          checked={settings.darkMode}
          onCheckedChange={(checked) => updateSetting('darkMode', checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <label htmlFor="auto-save" className="flex flex-col">
          <span className="text-sm font-medium">Auto-Save</span>
          <span className="text-xs text-gray-500">Save changes automatically</span>
        </label>
        <Switch
          id="auto-save"
          checked={settings.autoSave}
          onCheckedChange={(checked) => updateSetting('autoSave', checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <label htmlFor="notifications" className="flex flex-col">
          <span className="text-sm font-medium">Notifications</span>
          <span className="text-xs text-gray-500">Receive push notifications</span>
        </label>
        <Switch
          id="notifications"
          checked={settings.notifications}
          onCheckedChange={(checked) => updateSetting('notifications', checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <label htmlFor="analytics" className="flex flex-col">
          <span className="text-sm font-medium">Analytics</span>
          <span className="text-xs text-gray-500">Help improve our service</span>
        </label>
        <Switch
          id="analytics"
          checked={settings.analytics}
          onCheckedChange={(checked) => updateSetting('analytics', checked)}
        />
      </div>
    </div>
  )
}
```

### Feature Flags

```typescript
function FeatureFlags() {
  const [features, setFeatures] = useState({
    betaFeatures: false,
    experimentalUI: false,
    debugMode: false
  })

  const toggleFeature = (feature: keyof typeof features) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }))
  }

  return (
    <div className="p-4 border rounded">
      <h3 className="font-semibold mb-4">Developer Features</h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
          <div>
            <p className="font-medium">Beta Features</p>
            <p className="text-xs text-gray-500">Enable experimental features</p>
          </div>
          <Switch
            checked={features.betaFeatures}
            onCheckedChange={() => toggleFeature('betaFeatures')}
          />
        </div>

        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
          <div>
            <p className="font-medium">Experimental UI</p>
            <p className="text-xs text-gray-500">Try the new interface</p>
          </div>
          <Switch
            checked={features.experimentalUI}
            onCheckedChange={() => toggleFeature('experimentalUI')}
          />
        </div>

        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
          <div>
            <p className="font-medium">Debug Mode</p>
            <p className="text-xs text-gray-500">Show debug information</p>
          </div>
          <Switch
            checked={features.debugMode}
            onCheckedChange={() => toggleFeature('debugMode')}
            className={features.debugMode ? 'bg-red-500' : ''}
          />
        </div>
      </div>
    </div>
  )
}
```

### Privacy Settings

```typescript
function PrivacySettings() {
  const [privacy, setPrivacy] = useState({
    shareData: false,
    personalizedAds: false,
    cookies: true,
    tracking: false
  })

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Privacy Settings</h3>

      {Object.entries(privacy).map(([key, value]) => (
        <div
          key={key}
          className="flex items-center justify-between py-2 border-b"
        >
          <label htmlFor={key} className="flex-1">
            <span className="block font-medium">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <span className="text-sm text-gray-500">
              {getPrivacyDescription(key)}
            </span>
          </label>
          <Switch
            id={key}
            checked={value}
            onCheckedChange={(checked) =>
              setPrivacy(prev => ({ ...prev, [key]: checked }))
            }
          />
        </div>
      ))}
    </div>
  )
}

function getPrivacyDescription(key: string) {
  const descriptions: Record<string, string> = {
    shareData: 'Share usage data to improve services',
    personalizedAds: 'Show ads based on your interests',
    cookies: 'Use cookies for better experience',
    tracking: 'Allow activity tracking'
  }
  return descriptions[key] || ''
}
```

### Disabled State

```typescript
function DisabledSwitches() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Switch disabled />
        <span className="text-gray-500">Disabled Off</span>
      </div>

      <div className="flex items-center gap-3">
        <Switch disabled checked />
        <span className="text-gray-500">Disabled On</span>
      </div>
    </div>
  )
}
```

### Form Integration

```typescript
function NotificationForm() {
  const [formData, setFormData] = useState({
    email: true,
    push: false,
    sms: false
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log('Notification preferences:', formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <fieldset>
        <legend className="text-lg font-semibold mb-3">
          Notification Channels
        </legend>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="email-notif">Email Notifications</label>
            <Switch
              id="email-notif"
              checked={formData.email}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, email: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="push-notif">Push Notifications</label>
            <Switch
              id="push-notif"
              checked={formData.push}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, push: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="sms-notif">SMS Notifications</label>
            <Switch
              id="sms-notif"
              checked={formData.sms}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, sms: checked })
              }
            />
          </div>
        </div>
      </fieldset>

      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        Save Preferences
      </button>
    </form>
  )
}
```

## API Reference

### Switch Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | - | Controlled checked state |
| `defaultChecked` | `boolean` | `false` | Uncontrolled default state |
| `onCheckedChange` | `(checked: boolean) => void` | - | Called when state changes |
| `disabled` | `boolean` | `false` | Disables the switch |
| `required` | `boolean` | `false` | Makes field required in forms |
| `name` | `string` | - | Form field name |
| `value` | `string` | `'on'` | Form submission value |
| `id` | `string` | - | HTML id for label association |
| `className` | `string` | - | Additional CSS classes |

### TypeScript

```typescript
import { SwitchProps } from '@radix-ui/react-switch'

interface CustomSwitchProps extends SwitchProps {
  className?: string
}

export const Switch: React.ForwardRefExoticComponent<CustomSwitchProps>
```

## Common Patterns

### Conditional Content

```typescript
function ConditionalSettings() {
  const [advancedMode, setAdvancedMode] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Switch
          id="advanced"
          checked={advancedMode}
          onCheckedChange={setAdvancedMode}
        />
        <label htmlFor="advanced">Advanced Mode</label>
      </div>

      {advancedMode && (
        <div className="p-4 border rounded bg-gray-50">
          <h4 className="font-semibold mb-2">Advanced Settings</h4>
          <div className="space-y-2">
            <input placeholder="API Key" className="w-full p-2 border rounded" />
            <input placeholder="Webhook URL" className="w-full p-2 border rounded" />
            <select className="w-full p-2 border rounded">
              <option>Debug Level: Info</option>
              <option>Debug Level: Warning</option>
              <option>Debug Level: Error</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
```

### Live Preview Toggle

```typescript
function LivePreviewToggle() {
  const [livePreview, setLivePreview] = useState(true)
  const [previewDelay, setPreviewDelay] = useState(500)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label htmlFor="live-preview">
          Live Preview
          {livePreview && (
            <span className="ml-2 text-xs text-green-600">● Active</span>
          )}
        </label>
        <Switch
          id="live-preview"
          checked={livePreview}
          onCheckedChange={setLivePreview}
        />
      </div>

      {livePreview && (
        <div className="ml-4">
          <label className="text-sm text-gray-600">
            Delay: {previewDelay}ms
            <input
              type="range"
              min="0"
              max="2000"
              step="100"
              value={previewDelay}
              onChange={(e) => setPreviewDelay(Number(e.target.value))}
              className="w-full"
            />
          </label>
        </div>
      )}
    </div>
  )
}
```

### Sync Settings

```typescript
function SyncSettings() {
  const [syncing, setSyncing] = useState(false)
  const [autoSync, setAutoSync] = useState(false)

  const handleSync = async (enabled: boolean) => {
    setAutoSync(enabled)
    if (enabled) {
      setSyncing(true)
      // Simulate sync
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSyncing(false)
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded">
      <div>
        <p className="font-medium">Auto Sync</p>
        <p className="text-sm text-gray-500">
          {syncing ? 'Syncing...' : 'Sync data across devices'}
        </p>
      </div>
      <Switch
        checked={autoSync}
        onCheckedChange={handleSync}
        disabled={syncing}
      />
    </div>
  )
}
```

## Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Switch } from 'torch-glare/lib/components/Switch'

describe('Switch', () => {
  it('toggles state on click', () => {
    const handleChange = jest.fn()
    render(
      <Switch onCheckedChange={handleChange} />
    )

    const switchElement = screen.getByRole('switch')
    fireEvent.click(switchElement)

    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('respects disabled state', () => {
    const handleChange = jest.fn()
    render(
      <Switch disabled onCheckedChange={handleChange} />
    )

    const switchElement = screen.getByRole('switch')
    fireEvent.click(switchElement)

    expect(handleChange).not.toHaveBeenCalled()
    expect(switchElement).toBeDisabled()
  })

  it('shows correct checked state', () => {
    const { rerender } = render(<Switch checked={false} />)

    let switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveAttribute('data-state', 'unchecked')

    rerender(<Switch checked={true} />)
    switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveAttribute('data-state', 'checked')
  })
})
```

### Accessibility Test

```typescript
import { axe } from '@axe-core/react'

test('Switch meets WCAG standards', async () => {
  const { container } = render(
    <div>
      <label htmlFor="test-switch">Enable feature</label>
      <Switch id="test-switch" />
    </div>
  )

  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## Accessibility

### Keyboard Support

- **Space**: Toggle switch when focused
- **Tab**: Move focus to/from switch
- **Enter**: Toggle switch (in some contexts)

### ARIA Attributes

Radix UI automatically provides:

```html
<!-- Unchecked state -->
<button
  role="switch"
  aria-checked="false"
  data-state="unchecked"
/>

<!-- Checked state -->
<button
  role="switch"
  aria-checked="true"
  data-state="checked"
/>

<!-- Disabled -->
<button
  role="switch"
  aria-checked="false"
  disabled
/>
```

### Screen Reader Support

- Announces switch role
- Communicates on/off state
- Reads associated labels
- Announces state changes

### Label Association

```typescript
// Method 1: Using htmlFor/id
<label htmlFor="switch-id">Label</label>
<Switch id="switch-id" />

// Method 2: Wrapping
<label>
  <Switch />
  <span>Label</span>
</label>

// Method 3: aria-label
<Switch aria-label="Enable feature" />
```

## Styling

### Custom Styles

```typescript
// Custom colors
<Switch
  className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
/>

// Custom size
<Switch
  className="w-16 h-8 [&>span]:w-7 [&>span]:h-7"
/>
```

### State-Based Styling

```css
/* Using data attributes */
.switch[data-state="checked"] {
  background-color: var(--color-primary);
}

.switch[data-state="unchecked"] {
  background-color: var(--color-secondary);
}
```

### Animation

The switch includes smooth transitions:

```css
/* Thumb animation */
.switch-thumb {
  transition: transform 100ms;
  transform: translateX(0);
}

.switch[data-state="checked"] .switch-thumb {
  transform: translateX(21px);
}
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (gzip) | 1.6kb |
| First render | <4ms |
| Interaction | <1ms |
| Animation | 100ms |
| Tree-shakeable | ✅ |

### Optimization Tips

1. Use uncontrolled mode with `defaultChecked` when possible
2. Memoize change handlers with `useCallback`
3. Avoid inline functions in render
4. Group multiple switches in a single state object

## Migration

### From Checkbox

```diff
// From checkbox used as toggle
- <input
-   type="checkbox"
-   checked={enabled}
-   onChange={(e) => setEnabled(e.target.checked)}
- />

// To Switch
+ <Switch
+   checked={enabled}
+   onCheckedChange={setEnabled}
+ />
```

### From Custom Toggle

```diff
// From custom implementation
- <button
-   onClick={() => setEnabled(!enabled)}
-   className={enabled ? 'bg-blue-500' : 'bg-gray-300'}
- >
-   <span className={enabled ? 'translate-x-5' : ''} />
- </button>

// To Switch
+ <Switch
+   checked={enabled}
+   onCheckedChange={setEnabled}
+ />
```

## Troubleshooting

### Switch not toggling

**Solution:** Ensure proper controlled/uncontrolled usage

```typescript
// Controlled - requires both props
<Switch checked={value} onCheckedChange={setValue} />

// Uncontrolled - use defaultChecked
<Switch defaultChecked />
```

### Label not clickable

**Solution:** Properly associate label with switch

```typescript
// ✅ Correct
<label htmlFor="my-switch">Label</label>
<Switch id="my-switch" />

// ❌ Wrong - no association
<label>Label</label>
<Switch />
```

## Related Components

- [Toggle](/docs/components/toggle.md) - Toggle button component
- [Checkbox](/docs/components/checkbox.md) - For multiple selections
- [Radio](/docs/components/radio.md) - For single choice from options

## Browser Support

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile browsers ✅

## Changelog

### v1.1.15
- Migrated to Radix UI Switch primitive
- Added smooth animations
- Improved accessibility

### v1.1.14
- Enhanced visual design
- Fixed focus styles

### v1.1.0
- Initial stable release