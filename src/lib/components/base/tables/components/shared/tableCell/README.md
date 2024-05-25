# TableCell 1.2 Component


## Overview

React Table Data Cell component.

## Default style
[Figma Design](https://www.figma.com/design/Q3aIuqsK0HWrUrOElSFEIb/TORCH-Glare-V1.4.4?node-id=6287-203562&t=GJiBeC8BRuf7trgg-4)



## About the component

- this component is the table data tag and should be rendered as data cell under the table header.

- this component has more than a single variant you can choose one of them by using the "component_type" prop





#### "component_type" prop options

```tsx
<TableCell 
  component_type="" // "Input-Field" | "Input-DropList" | "Input-Trailing-Label" | "input-date-picker" | "Label-Buttons" | "Item Style"
/>
```

- The "Input-Field" option returns an input field as a cell with a label hidden under it.

- The "Input-DropList" option returns an input field as a cell with a label hidden under it and you should also pass the dropDown child component by passing it in "drop_down_list_child" prop.

- The "Input-Trailing-Label" option returns an input field as a cell with a label inside it and you should also pass the label string  by passing it in "Input-Trailing-Label" prop.

- The "input-date-picker" option is returns an input field type date with date picker component.

- The "Label-Buttons" option is returns a section to contain buttons or label or any other component and you should pass it's children by using "buttons_or_labels_children" prop

- The "Item Style" option is returns "Item Style" component (see on figma)




## implement 
- only componentType prop required.

```tsx
 import {TableCell} from 'torch-glare'

<TableCell 
    onDateChange={} // callback function when using date picker component.
    name="" // input name 
    cellLabel="" // main component label 
    secondary_cell_label="" // secondary label
    cell_icon={} // icon when using "Item Style" option 
    component_size="" //css size options -> "S" | "M"
    disabled={false} // 
    negative={false}
    component_type="" // component  "Input-Field" | "Input-DropList" | "Input-Trailing-Label" | "input-date-picker" | "Label-Buttons"
    drop_down_list_child={} // should pass dropdown child to have dropdown list
    trailing_label="" // to have label inside the cell input
    action_button={} // to have button inside the cell input you should pass button child
    buttons_or_labels_children={} // to have buttons container you should pass buttons children here
/>
```





