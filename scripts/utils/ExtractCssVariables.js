import fs from "fs";

// this function is used to extract the css variables from the css file and return an object with the variables as keys and the values as the values of the variables.

export function ExtractCssVariables(cssFilePath) {
    try {
        // Read the CSS file
        const cssContent = fs.readFileSync(cssFilePath, 'utf8');

        // Regex to match CSS variables
        const regex = /--([^:]+):\s*([^;]+);/g;

        // Create a map to store the variables
        const vars = {};

        // Find all matches in the CSS content
        let match;
        while ((match = regex.exec(cssContent)) !== null) {
            // Keep the -- prefix in the key
            const key = `--${match[1].trim()}`;

            // Get the value exactly as it appears in the CSS file
            const value = match[2].trim();

            // Store in the vars object
            vars[key] = value;
        }

        return vars;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return null;
    }
}
