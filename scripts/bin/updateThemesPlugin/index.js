import { MakeJsVarsReferenceObject } from "../../utils/MakeJsVarsReferenceObject.js";
import { ExtractCssVariables } from "../../utils/ExtractCssVariables.js";
import fs from 'fs';

const CreatePluginFile = (filesPath) => {
    // css base files
    const darkModeCssVars = ExtractCssVariables(filesPath.darkModeCssVarsPath)
    const lightModeCssVars = ExtractCssVariables(filesPath.lightModeCssVarsPath)
    const defaultModeCssVars = ExtractCssVariables(filesPath.defaultModeCssVarsPath)

    // tailwind variables
    const coreColorsForTailwindConfig = MakeJsVarsReferenceObject(filesPath.coreColorsPath)
    const coreVariablesForTailwindConfig = MakeJsVarsReferenceObject(filesPath.darkModeCssVarsPath)

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

    fs.writeFileSync('new-plugin.js', content);

    console.log('new-plugin.js has been created successfully!');
}







// usage
CreatePluginFile({
    coreColorsPath: "./coreColors.css", // path to the core colors file
    darkModeCssVarsPath: "./dark.css", // path to the dark mode css file
    lightModeCssVarsPath: "./light.css", // path to the light mode css file
    defaultModeCssVarsPath: "./default.css", // path to the default mode css file
})


