# BadgeField Component

The BadgeField component is a versatile and reusable input field that supports badges, icons, dropdowns, and error handling. It is designed to be highly customizable and integrates seamlessly with other UI components like Tooltip, Popover, and Input.

## Features

- **Customizable Sizes:** Supports three sizes (XS, S, M).
- **Multiple Variants:** Offers two styling variants (PresentationStyle, SystemStyle).
- **Icons and Labels:** Allows adding icons and labels to the input field.
- **Popover Support:** Integrates with a Popover component for dropdown functionality.
- **Error Handling:** Displays error messages using a Tooltip.
- **Badges:** Supports adding badges inside the input field.
- **Theme Support:** Works with dark, light, and default themes.

## Installation

To install the component run:

```bash
npx torchcorp@latest add BadgeField
```

## Props

| Prop Name         | Type                              | Description                                         | Default Value         |
|------------------|--------------------------------|-------------------------------------------------|----------------------|
| size             | "XS", "S", "M"                   | The size of the input field.                     | "M"                 |
| label           | string                           | The label displayed in the input field.          | undefined            |
| required         | boolean                         | Indicates if the input field is required.        | false                |
| icon            | ReactNode                        | Icon displayed on the left side of the input field. | undefined            |
| popoverChildren  | ReactNode                        | Content to display in the popover dropdown.      | undefined            |
| errorMessage     | string                           | Error message to display in a tooltip.          | undefined            |
| onTable         | boolean                          | Adjusts the border style for table layouts.      | false                |
| toolTipSide      | ToolTipSide                      | Position of the tooltip for error messages.      | undefined            |
| badgesChildren   | ReactNode                        | Badges to display inside the input field.        | undefined            |
| variant         | "SystemStyle", "PresentationStyle" | Styling variant for the input field.            | "PresentationStyle"  |
| theme           | "dark", "light", "default"        | The theme applied to the input field.           | "default"           |

## Usage

### Basic Example

```jsx
import { BadgeField } from "@/components/BadgeField";

function Example() {
  return (
    <BadgeField
      label="Username"
      placeholder="Enter your username"
      size="M"
      variant="PresentationStyle"
    />
  );
}
```

### With Icon and Error Message

```jsx
import { BadgeField } from "@/components/BadgeField";

function Example() {
  return (
    <BadgeField
      label="Email"
      placeholder="Enter your email"
      icon={<i className="ri-add-line"></i>}
      errorMessage="Invalid email"
      toolTipSide="top"
    />
  );
}
```

### With Popover and Badges

```jsx
import { BadgeField } from "@/components/BadgeField";

function Example() {
  const popoverContent = (
    <div>
      <p>Option 1</p>
      <p>Option 2</p>
    </div>
  );

  const badges = (
    <div className="flex gap-1">
      <span className="badge">Badge 1</span>
      <span className="badge">Badge 2</span>
    </div>
  );

  return (
    <BadgeField
      label="Tags"
      placeholder="Add tags"
      popoverChildren={popoverContent}
      badgesChildren={badges}
    />
  );
}
```

## Variants

| Variant             | Description                                      |
|--------------------|--------------------------------------------------|
| PresentationStyle  | Default styling for presentation purposes.      |
| SystemStyle       | Styling tailored for system-level inputs.       |

## Sizes

| Size  | Description                |
|------|----------------------------|
| XS   | Extra small input field.   |
| S    | Small input field.         |
| M    | Medium input field (default). |

## Customization

### Adding Custom Styles

```jsx
<BadgeField
  label="Custom Field"
  placeholder="Enter text"
  className="my-custom-class"
/>
```

### Using Icons

```jsx

<BadgeField
  label="Search"
  placeholder="Search..."
  icon={<i className="ri-add-line"></i>}
/>
```

### Error Handling

```jsx
<BadgeField
  label="Password"
  placeholder="Enter password"
  errorMessage="Password is required"
  toolTipSide="bottom"
/>
```

