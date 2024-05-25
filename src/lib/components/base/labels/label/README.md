# Label 1.0 Component

## Overview

React Label Component.

## Default style
[Figma Design](https://www.figma.com/file/Q3aIuqsK0HWrUrOElSFEIb/TORCH-Glare-V1.4.1?type=design&node-id=1802-333127&mode=dev)

## implement 

- all of the props optional

```tsx
  <Label
    name="" 
    label=""
    required_label=""
    secondary_label=""
    component_size= "" // "S" | "M" | "L"
    component_style="" // "vertical" | "horizontal"
    as_child={false} // to inherit thr text color
    child_dir="" // "vertical" | "vertical-reverse" 
    theme="" // "System-Style" 
    disabled={true}

    {..any prop}
   > <Label/>
```









