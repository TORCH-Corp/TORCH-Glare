# ButtonField Component

The ButtonField component is a flexible and reusable UI element designed to group buttons or other interactive elements together. It supports optional dividers to visually separate elements and integrates seamlessly with icons from RemixIcon.

## Features
- **Dividers**: Add dividers to visually separate elements within the component.
- **Theme Support**: Works with dark, light, and default themes.
- **Customizable**: Easily extendable with additional class names and props.
- **RemixIcon Integration**: Use RemixIcon for icons within the component.


## Installation
To install the ButtonField component, use the following command:

```bash
npx torchcorp@latest add ButtonField
```

## Usage

### Basic Example
```jsx
import { ButtonField } from "@/components/ButtonField";

function Example() {
  return (
    <ButtonField>
      <button>Button 1</button>
      <button>Button 2</button>
    </ButtonField>
  );
}
```

### With Dividers
```jsx
import { ButtonField } from "@/components/ButtonField";

function Example() {
  return (
    <ButtonField withDivider>
      <button>Button 1</button>
      <button>Button 2</button>
    </ButtonField>
  );
}
```

### With RemixIcon
```jsx

function Example() {
  return (
    <ButtonField withDivider>
      <button>
         <i className="ri-add-circle-line"></i>  Home
      </button>
      <button>
        <i className="ri-add-circle-line"></i>  Settings
      </button>
    </ButtonField>
  );
}
```

### Themed ButtonField
```jsx
import { ButtonField } from "@/components/ButtonField";

function Example() {
  return (
    <ButtonField theme="dark" withDivider>
      <button>Dark Theme Button 1</button>
      <button>Dark Theme Button 2</button>
    </ButtonField>
  );
}
```

## Customization

### Adding Custom Styles
You can pass additional class names using the `className` prop:

```jsx
<ButtonField className="my-custom-class">
  <button>Custom Button</button>
</ButtonField>
```

### Using RemixIcon
Install RemixIcon if not already installed:

```bash
npm install react-icons
```

Then, use icons within the ButtonField:

```jsx

<ButtonField>
  <button>
    <i className="ri-add-circle-line"></i> 
  </button>
  <button>
    <i className="ri-add-circle-line"></i> 
  </button>
</ButtonField>
```
## Props

| Prop Name   | Type                            | Description                                         | Default Value |
|------------|--------------------------------|-----------------------------------------------------|--------------|
| withDivider | boolean                        | Adds dividers on both sides of the children.       | `false`      |
| theme       | "dark", "light", "default"    | The theme applied to the component.                | `"default"`  |
| className   | string                         | Additional custom class names for styling.         | `undefined`  |


