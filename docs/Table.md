```markdown
# Table Components

A set of React table components with theming, sorting, and resizing capabilities, built with Tailwind CSS and `class-variance-authority`.

## Features

- Themed table styling.
- Sortable table headers.
- Resizable table columns.
- Supports row states for visual cues (delete, update, add, selected, open).
- Custom checkbox component.
- Subtable expansion button.
- Footer button for actions.

## Installation

To install the components run:

```sh
npx torchcorp@latest add Table
```

## Usage

### Basic Table Example

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./Table";

const App = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Age</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>John Doe</TableCell>
          <TableCell>30</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Jane Smith</TableCell>
          <TableCell>25</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default App;
```

### Sortable Table Example

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./Table";
import { useState } from "react";

const data = [
  { name: "John Doe", age: 30 },
  { name: "Jane Smith", age: 25 },
  { name: "Peter Jones", age: 40 },
];

const App = () => {
  const [sortType, setSortType] = useState<"asc" | "desc" | undefined>(undefined);
  const [sortedData, setSortedData] = useState([...data]);

  const handleSort = () => {
    let newSortType: "asc" | "desc" | undefined;
    if (sortType === undefined) {
      newSortType = "asc";
    } else if (sortType === "asc") {
      newSortType = "desc";
    } else {
      newSortType = undefined;
    }

    setSortType(newSortType);

    let newData = [...data];

    if (newSortType === "asc") {
      newData.sort((a, b) => a.name.localeCompare(b.name));
    } else if (newSortType === "desc") {
      newData.sort((a, b) => b.name.localeCompare(a.name));
    }

    setSortedData(newData);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead sortType={sortType} onSort={handleSort}>Name</TableHead>
          <TableHead>Age</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.map((item) => (
          <TableRow key={item.name}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.age}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default App;
```

### Themed Table Example

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./Table";

const App = () => {
  return (
    <Table theme="dark">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Age</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>John Doe</TableCell>
          <TableCell>30</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Jane Smith</TableCell>
          <TableCell>25</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default App;
```

## Components

### `Table`

The main table component.

**Props:**

| Prop      | Type                        | Description                                                                                                    | Default |
|-----------|-----------------------------|----------------------------------------------------------------------------------------------------------------|---------|
| `theme`   | `"dark" \| "light" \| "default"` | Defines the theme of the table.  Note that theming is implemented via CSS variables.                             | `"default"`|
| `className` | `string`                    | Custom styles for the table.                                                                                   | -       |
| All other HTMLAttributes<HTMLTableElement> | (inherited) | Other standard table attributes (e.g., `aria-label`).       | -       |

### `TableHeader`

The table header section.

**Props:**

| Prop      | Type                        | Description                                                                                                    | Default |
|-----------|-----------------------------|----------------------------------------------------------------------------------------------------------------|---------|
| `className` | `string`                    | Custom styles for the table header.                                                                              | -       |
| All other HTMLAttributes<HTMLTableSectionElement> | (inherited) | Other standard thead attributes (e.g., `aria-label`).       | -       |

### `TableBody`

The table body section.

**Props:**

| Prop      | Type                        | Description                                                                                                    | Default |
|-----------|-----------------------------|----------------------------------------------------------------------------------------------------------------|---------|
| `className` | `string`                    | Custom styles for the table body.                                                                                | -       |
| All other HTMLAttributes<HTMLTableSectionElement> | (inherited) | Other standard tbody attributes (e.g., `aria-label`).       | -       |

### `TableFooter`

The table footer section.

**Props:**

| Prop      | Type                        | Description                                                                                                    | Default |
|-----------|-----------------------------|----------------------------------------------------------------------------------------------------------------|---------|
| `className` | `string`                    | Custom styles for the table footer.                                                                                | -       |
| All other HTMLAttributes<HTMLTableSectionElement> | (inherited) | Other standard tfoot attributes (e.g., `aria-label`).       | -       |

### `TableRow`

A single table row.

**Props:**

| Prop      | Type                         | Description                                                                                | Default |
|-----------|------------------------------|--------------------------------------------------------------------------------------------|---------|
| `state`   | `"delete" \| "update" \| "add" \| "selected" \| "open"` | Defines the visual state of the row (e.g., for indicating deletion).                               | -       |
| `className` | `string`                     | Custom styles for the table row.                                                                   | -       |
| All other HTMLAttributes<HTMLTableRowElement> | (inherited) | Other standard tr attributes (e.g., `aria-label`).       | -       |

### `TableHead`

A table header cell.

**Props:**

| Prop      | Type                        | Description                                                                                                                              | Default |
|-----------|-----------------------------|------------------------------------------------------------------------------------------------------------------------------------------|---------|
| `size`    | `"S" \| "M"`                | Defines the size of the table head cell.                                                                                             | `"M"`   |
| `disabled`| `boolean`                   | Disables the table head cell.                                                                                                        | `false` |
| `sortType`| `"asc" \| "desc" \| undefined` | Indicates the current sort direction (ascending, descending, or none).                                                                  | `undefined`|
| `onSort`  | `() => void`                | Callback function executed when the table head is clicked for sorting.                                                                | -       |
| `isDummy` | `boolean`                   | If true it remove sort ability and another properties from the element                                                                                                             | `false` |
| `className` | `string`                    | Custom styles for the table head.                                                                                                  | -       |
| All other ButtonHTMLAttributes<HTMLButtonElement> & ThHTMLAttributes<HTMLTableCellElement> | (inherited) | Other standard th and button attributes (e.g., `aria-label`).       | -       |

### `TableCell`

A table data cell.

**Props:**

| Prop      | Type                        | Description                                                                                              | Default |
|-----------|-----------------------------|----------------------------------------------------------------------------------------------------------|---------|
| `isDummy` | `boolean`                   | If `true`, removes the wrapping `div` with overflow hidden and enables auto width.                       | `false` |
| `className` | `string`                    | Custom styles for the table cell.                                                                          | -       |
| All other HTMLAttributes<HTMLTableCellElement> | (inherited) | Other standard td attributes (e.g., `aria-label`).       | -       |

### `TableCheckbox`

A custom checkbox component for tables.

**Props:**

| Prop      | Type                         | Description                                             | Default |
|-----------|------------------------------|---------------------------------------------------------|---------|
| `id`      | `string`                     | The ID of the checkbox (required for label association). | -       |
| `className` | `string`                     | Custom styles for the checkbox.                           | -       |
| All other InputHTMLAttributes<HTMLInputElement> | (inherited) | Other standard input attributes (e.g., `checked`).       | -       |

### `TableCaption`

A table caption component.

**Props:**

| Prop      | Type                        | Description                                             | Default |
|-----------|-----------------------------|---------------------------------------------------------|---------|
| `className` | `string`                    | Custom styles for the table caption.                      | -       |
| All other HTMLAttributes<HTMLTableCaptionElement> | (inherited) | Other standard caption attributes (e.g., `aria-label`).       | -       |

### `TableFooterButton`

A button component for the table footer.

**Props:**

| Prop      | Type            | Description                                                              | Default |
|-----------|-----------------|--------------------------------------------------------------------------|---------|
| `className` | `string`        | Custom styles for the button.                                            | -       |
| All other ButtonHTMLAttributes<HTMLButtonElement> | (inherited) | Other standard button attributes (e.g., `onClick`).       | -       |

### `SubTableButton`

A button component used to expand/collapse sub-tables.

**Props:**

| Prop      | Type      | Description                                                    | Default |
|-----------|-----------|----------------------------------------------------------------|---------|
| `isActive`| `boolean` | Indicates if the subtable associated with the button is active | `false` |
| `className`| `string`  | Custom styles for the button                                   | -       |
| `dummy`   | `boolean`                   | If true it remove hover effect and another properties from the element                                                                                                             | `false` |


