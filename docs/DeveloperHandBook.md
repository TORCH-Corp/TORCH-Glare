# TORCH Glare Components Library 

Welcome to the **TORCH Glare Components Library**! This library contains a collection of reusable React components that can be used to build user interfaces efficiently.

## Most Important Notes:

- Framework Figma Design file ['https://www.figma.com/design/Q3aIuqsK0HWrUrOElSFEIb/TORCH-Glare-V1.5.2?node-id=1094-125590&t=ySiHG1iTEWxwMxhA-0']
- components name are the same on the figma design file.
- components props and options are the same on the figma design file.
- each component has simple README file.
- the components use advanced typography system based on the framework design system, we use scss mixins.
- the components use advanced color mapping system by using normal CSS vars inside scss files, with that we have more than a single color mod, we have dark, light, default mods.
- we use font icons of RemixIcons library.


### More About Framework Typography
more about [typography](typography.md)

### More About Framework Color system
more about [colorSystem](colorsSystem.md)


### Project Folders Structure
src
├── index.css                      # global css file for testing env
├── App.tsx                        # global App component for testing env
├── lib
│   ├── components                 # main framework components folder
│   │   ├── base                   # the base components 
│   │   ├── helpers                # additional helpers components
│   │   └── shared                 # additional components
│   ├── hooks                      # the reuseable hooks of the framework
│   ├── styles
│   │   ├── colors                 # main css colors and colors mapping
│   │   ├── mediaQuery             # mediaQuery mixins
│   │   └── typography             # typography mixins
│   └── types  
        







