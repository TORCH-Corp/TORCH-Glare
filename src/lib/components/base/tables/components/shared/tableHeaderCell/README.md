# TableHeaderCell 1.0 Component

## Overview

React TableHeader Component.

## Default style
[Figma Design](https://www.figma.com/design/Q3aIuqsK0HWrUrOElSFEIb/TORCH-Glare-V1.4.3?node-id=6278-198120&t=Ft2XIKybUdTv2rgR-4)


## implement 

```tsx
 import {TableHeaderCell } from 'torch-glare'

<TableHeaderCell 
  component_size="" // this for component size in css you can use this options ->  "S" | "M" | "L"
  label="" // the table label
  end_edge={false} // this to have deferent style when this component is the last one rendered
  resizable={false} // to make the component resizable.
  id="" // important to identify the component.
  on_sorting_btn_click={} // this component has a sorting button with icon to sort the body cells and you should pass callback function when this button clicked.
  sorting_icon_type="" // when click the sorting button this options is to change the icon based on the sorting direction ->  "Default" | "UP" | "DOWN"
/>
```






