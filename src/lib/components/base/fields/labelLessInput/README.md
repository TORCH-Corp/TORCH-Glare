# LabelLessInput 1.0 Component

## Overview

React Input element Component.

## Default style
[Figma Design](https://www.figma.com/file/Q3aIuqsK0HWrUrOElSFEIb/TORCH-Glare-V1.4.3?type=design&node-id=5990-202615&mode=dev)


## implement 

- only label prop is required

```tsx
  < LabelLessInput
    name="" // input name attribute
    label="" // label
    required_label="" // red label
    secondary_label="" // small label
    component_size="" // component size style options -> "S" | "M" | "L" 
    negative={false}
    drop_down={false} // get dropdown button and dropdown list active
    drop_down_list_child={} // to have dropdown -> you should pass dropdown component
    trailing_label=""
    action_button={} // to have action button with the input
    left_side_icon={}
    badges_children={} // to set badges as children inside the input
    theme="" // "System-Style" 
  /> 

```









