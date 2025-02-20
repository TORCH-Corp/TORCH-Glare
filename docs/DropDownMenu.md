
# DropdownMenu Component

## Installation

To get started, install the `DropdownMenu` component using the following command:

```bash
npx torchcorp@latest add DropdownMenu
```

This will automatically install the necessary dependencies and set up the `DropdownMenu` component in your project.

If you prefer to install manually, you can also install the required packages:

```bash
npm install @radix-ui/react-dropdown-menu class-variance-authority
```

Or if using Yarn:

```bash
yarn add @radix-ui/react-dropdown-menu class-variance-authority
```

## Usage

Once installed, you can start using the `DropdownMenu` component in your project.

Here's a basic example of how to use the `DropdownMenu`:

```tsx
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from './path-to-your-dropdown-menu';

function App() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Item 1</DropdownMenuItem>
        <DropdownMenuItem>Item 2</DropdownMenuItem>
        <DropdownMenuItem>Item 3</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

## Props

### `DropdownMenu` Props

| Prop       | Type               | Description                                    |
|------------|--------------------|------------------------------------------------|
| `variant`  | `"SystemStyle"` or `"PresentationStyle"` | Defines the style variant for the menu. Default is `"PresentationStyle"`. |
| `className`| `string`           | Optional className for custom styling.         |
| `theme`    | `"dark"`, `"light"`, or `"default"` | Defines the theme for the menu. Default is `"default"`. |

### `DropdownMenuItem` Props

| Prop      | Type               | Description                                    |
|-----------|--------------------|------------------------------------------------|
| `variant` | `"Default"`, `"Warning"`, `"Negative"`, `"SystemStyle"` | Defines the variant for the item. Default is `"Default"`. |
| `size`    | `"S"`, `"M"`        | Defines the size of the item. Default is `"M"`. |
| `disabled`| `boolean`           | If true, disables the item. Default is `false`. |
| `active`  | `boolean`           | If true, applies active styles to the item. Default is `false`. |

## Custom Styling

You can customize the styles of the dropdown by passing custom classNames to the components:

```tsx
<DropdownMenuContent className="your-custom-class">
  <DropdownMenuItem>Custom Item</DropdownMenuItem>
</DropdownMenuContent>
```

## License

This component is open source and available under the [MIT License](LICENSE).