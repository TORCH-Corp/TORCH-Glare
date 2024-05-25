# DropDownMenuItem 1.0 Component

## Overview

React list item button Component.

## Default style
[Figma Design](https://www.figma.com/file/Q3aIuqsK0HWrUrOElSFEIb/TORCH-Glare-V1.4.2?type=design&node-id=1735-159517&mode=dev)

## implement 

- all of the props optional except the elementName prop.

```tsx
  <DropDownMenuItem
    element_name="" // input name prop
    component_size="" // 'M' 
    component_label="" // the item label
    required_label= "" // the item required flag label
    secondary_label="" // the item secondary label
    right_side_icon={} // react component icon (remix icons font type icons)
    onRightSideIconClick={}
    component_style="" // "Presentation-Warning-Style" | "Presentation-Negative-Style" | "System-Style"
    component_type="" // "radio" | "checkbox"
    icon="" // react component icon (remix icons font type icons)

    {...any prop}
   /> 
```









