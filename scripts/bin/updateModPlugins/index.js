import { ExtractCssVariables } from "../../utils/ExtractCssVariables.js";
import fs from 'fs';

const CreateModePluginFile = (filesPath) => {
    // Check if files exist
    if (!fs.existsSync(filesPath.modeCssVarsPath)) {
        console.error(`Error: File not found: ${filesPath.modeCssVarsPath}`);
        return;
    }

    if (!fs.existsSync(filesPath.coreColorsPath)) {
        console.error(`Error: File not found: ${filesPath.coreColorsPath}`);
        return;
    }

    // css base files
    const modeCssVars = ExtractCssVariables(filesPath.modeCssVarsPath)
    const coreColorsVars = ExtractCssVariables(filesPath.coreColorsPath)

    // Content to write to the file
    const content = `const plugin = require('tailwindcss/plugin');
module.exports = plugin(function ({ addBase }) {
    // create css vars for tailwind base
    const mode = {
        'root':  ${JSON.stringify(modeCssVars, null, 2)},
    }
    const coreColors = {
        'root':  ${JSON.stringify(coreColorsVars, null, 2)},
    }
        
    addBase(mode)
    addBase(coreColors)
})
`;

    fs.writeFileSync('new-mod.js', content);
    console.log('new-mod.js has been created successfully!');
}







// usage
CreateModePluginFile({
    coreColorsPath: "./css files/coreColors.css", // path to the core colors file
    modeCssVarsPath: "./css files/mode.css", // path to the mode css file
})


