import { MakeJsVarsReferenceObject } from "./MakeJsVarsReferenceObject.js";
import { ExtractCssVariables } from "./ExtractCssVariables.js";
import fs from 'fs';

const darkModeCssVars = ExtractCssVariables("./css files/dark.css")
const lightModeCssVars = ExtractCssVariables("./css files/light.css")

const defaultModeCssVars = ExtractCssVariables("./css files/default.css")
const coreColorsForTailwindConfig = MakeJsVarsReferenceObject("./css files/coreColors.css")
const coreVariablesForTailwindConfig = MakeJsVarsReferenceObject("./css files/dark.css")

const cssVarsForTailwindConfig = {
    ...coreColorsForTailwindConfig,
    ...coreVariablesForTailwindConfig,
}


// Content to write to the file
const content = `const plugin = require('tailwindcss/plugin');
const themePlugin = plugin(function ({ addBase }) {
    // create css vars for tailwind base
    const darkTheme = {
        'html:not([data-theme]),[data-theme="dark"],[data-theme="null"]':  ${JSON.stringify(darkModeCssVars, null, 2)},
    }

    const lightTheme = {
        '[data-theme="light"]': ${JSON.stringify(lightModeCssVars, null, 2)},
    }

    const defaultTheme = {
        '[data-theme="default"]': ${JSON.stringify(defaultModeCssVars, null, 2)},
    }

    addBase(darkTheme)
    addBase(lightTheme)
    addBase(defaultTheme)
})

module.exports = {
    plugin: themePlugin,
    tailwindVars: ${JSON.stringify(cssVarsForTailwindConfig, null, 2)},
};`;

// Write the content to file.js
fs.writeFileSync('file.js', content);

console.log('file.js has been created successfully!');



/* const plugin = require('tailwindcss/plugin');
const themePlugin = plugin(function ({ addBase }) {
    // create css vars for tailwind base
    const darkTheme = {
        'html:not([data-theme]),[data-theme="dark"],[data-theme="null"]': {
            ...darkModeCssVars,
        }
    }

    const lightTheme = {
        '[data-theme="light"]': {
            ...lightModeCssVars,
        }
    }

    const defaultTheme = {
        '[data-theme="default"]': {
            ...defaultModeCssVars,
        }
    }

    addBase(darkTheme)
    addBase(lightTheme)
    addBase(defaultTheme)
})
 */