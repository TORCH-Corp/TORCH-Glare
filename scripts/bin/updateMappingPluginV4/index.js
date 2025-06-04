import { ExtractCssVariables } from "../../utils/ExtractCssVariables.js";
import { ConvertCssVarsToTailwindV4Vars } from "../../utils/ConvertCssVarsToTailwindV4Vars.js";
import fs from 'fs';

const CreatePluginFile = (filesPath) => {
    // css base files
    const darkModeCssVars = ExtractCssVariables(filesPath.darkModeCssVarsPath)
    const lightModeCssVars = ExtractCssVariables(filesPath.lightModeCssVarsPath)
    const defaultModeCssVars = ExtractCssVariables(filesPath.defaultModeCssVarsPath)


    const tailwindVars = ConvertCssVarsToTailwindV4Vars([filesPath.darkModeCssVarsPath, filesPath.coreColorsPath])

    // Content to write to the file
    const content = `const plugin = require('tailwindcss/plugin');
module.exports =  plugin(function ({ addBase }) {
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
`;

    fs.writeFileSync('new-plugin.js', content);
    // The tailwindVars result contains the output path and we don't need to write it again
    // since ConvertCssVarsToTailwindV4Vars already creates the output file
    console.log('Files have been created successfully!');
    console.log('Generated theme file:', tailwindVars[tailwindVars.length - 1].outputPath);
}


// usage
CreatePluginFile({
    coreColorsPath: "./css files/coreColors.css", // path to the core colors file
    darkModeCssVarsPath: "./css files/dark.css", // path to the dark mode css file
    lightModeCssVarsPath: "./css files/light.css", // path to the light mode css file
    defaultModeCssVarsPath: "./css files/default.css", // path to the default mode css file
})


