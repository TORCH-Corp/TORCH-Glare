/*
This function converts CSS variables from a CSS file into a Tailwind v4 compatible @theme format.

Example:

Input CSS file:
```css
:root {
  --primary: #ff0000;
  --secondary: #0000ff;
}
```

Output:
```css
@theme {
  --color-primary: var(--primary);
  --color-secondary: var(--secondary);
}
```

The updated documentation now accurately describes what the function does - it creates a Tailwind v4 compatible @theme block with prefixed color variables that reference the original CSS variables.
*/

import fs from "fs";

export function ConvertCssVarsToTailwindV4Vars(cssFilePath) {

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
      // Determine the key based on includePrefixInKeys option
      const key = `--color-${match[1]}`

      // Determine the value based on useVarSyntax option
      const value = `var(--${match[1]})`

      // Store in the vars object
      vars[key] = value;
    }

    // Format the output as a CSS-like string with @theme selector
    let content = '@theme {\n';

    // Add each variable as a CSS property
    for (const [key, value] of Object.entries(vars)) {
      content += `  ${key}: ${value};\n`;
    }

    // Close the selector
    content += '}';

    return content;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return null;
  }
}


// convert css file to jsVarsReferenceObject