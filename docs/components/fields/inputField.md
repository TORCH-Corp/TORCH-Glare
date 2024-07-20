# InputField 1.0 Component

## Overview

React Input element Component.

## Design File
[Figma Design](https://www.figma.com/file/Q3aIuqsK0HWrUrOElSFEIb/TORCH-Glare-V1.4.3?type=design&node-id=1820-419072&mode=dev)


### Component Features

- the component use Glare Label component as wrapper so we can use Glare Label features.
- the component has three sizes variants.
- you can display the label vertically or horizontally
- the component can have dropdown you just need to pass it as child.
- the component can have label at the end
- the component can have button at the end
- the component can have icon at the start
- the component can have badges children rendered inside it you just need to pass them as children.
- the component can display Error message by Show Tooltip component, you just need to pass error message.
- the component can have static theme named "System-Style" overwise theme will depend on the imported theme file like dark.css file.
- the component automatically show negative style when passing error message.
- this component has hook to handle all of the component styles named "useStates" hook
- there is functionality when user click on an element in the dropdown component the component will hide automatically.
- the dropdown Dynamically change it's position when hit the viewport.


### Component Folder Structure

├── components
│   ├── input                          # the main component file
│   │   ├── componnets 
│   │   │   ├── extraComponents.tsx    # in this file we have the components that display at at the end of the component
│   │   │   └── InputElement.tsx       # the html input tag component here
│   │   ├── hooks
│   │   │   └── useStates.tsx          # this hook to handle the deferent component styles.
│   │   ├── index.tsx                  # the component entry file.
│   │   ├── style.scss                 # the normal styles file
│   │   └── _variants.scss             # the component variants styles file
│   └── labeledInput                   # this component is the input with Label component as wrapper
├── index.tsx                          # the main entry file
└── README.md                          # simple readme file
