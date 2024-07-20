# Typography System

the typography system is scss mixins based on Glare Framework design system.

Glare Framework typography system based on four levels:

- body level
- display level
- headers level
- labels level

each typography level has nested levels:

- large level
- medium level
- small level

and each nested level has four levels of mixins:

- Bold level mixin
- SemiBold level mixin
- Medium level mixin
- Regular level mixin

├── src
│   ├── lib
│   │   ├── styles
│   │   │   └── typography 
│   │   │       ├── index.scss #the entry point file, you should import this file
│   │   │       └── mixins 
│   │   │           └── EN
│   │   │               ├── body 
│   │   │               │   ├── _large.scss
│   │   │               │   ├── _medium.scss
│   │   │               │   └── _small.scss
│   │   │               ├── display
│   │   │               │   ├── _large.scss
│   │   │               │   ├── _medium.scss
│   │   │               │   └── _small.scss
│   │   │               ├── headers
│   │   │               │   ├── _large.scss
│   │   │               │   ├── _medium.scss
│   │   │               │   └── _small.scss
│   │   │               └── labels
│   │   │                   ├── _large.scss
│   │   │                   ├── _medium.scss
│   │   │                   └── _small.scss