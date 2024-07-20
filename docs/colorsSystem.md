# Framework Color System
the framework color system is based of glare core colors system and glare color mapping.

- the glare core colors system is pure colors Example :
``` CSS
:root {
     --purple-100: #F5EEFFFF;
     --purple-200: #EBDCFFFF;
     --purple-300: #D8BAFFFF;
     --medium-red-800: #88071DFF;
     --medium-red-900: #5B0513FF;
     --medium-red-1000: #2D020AFF;
     // ...etc
}
```

- glare colors mapping is unique pure css vars used with each component, and we have three files each file use the same var name but different color value to have different themes for the components.


- with each theme file we use the same var name but with different color value
- the glare colors dark mod mapping Example :
``` CSS
@import '../coreColorSystem/default.css'; /* the glare core colors system file */
:root {
  --content-presentation-action-link: var(--blue-sparkle-400);
  --background-presentation-form-field-hover: var(--black-700);
  --background-presentation-action-dropdown-primary: var(--black-900);
  --background-presentation-form-header-shadow: var(--black-alpha-75);
  --background-presentation-tab-hover-sidebar: var(--white-alpha-15);
     // ...etc
}
```


├── src
│   ├── lib
│   │   ├── styles
│   │   │   ├── colors
│   │   │   │   ├── colorMapping 
│   │   │   │   │   ├── dark.css # if you import this file you will have dark theme mod.
│   │   │   │   │   ├── default.css # if you import this file you will have default theme mod.
│   │   │   │   │   └── light.css # if you import this file you will have light theme mod.
│   │   │   │   └── coreColorSystem
│   │   │   │       └── default.css # the main colors used with the themes files above.





