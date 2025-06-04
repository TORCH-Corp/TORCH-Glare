/*
This function converts CSS variables from CSS files into Tailwind v4 compatible @theme format files.

Example:

Input CSS file:
```css
:root {
  --primary: #ff0000;
  --secondary: #0000ff;
}
```

Output file:
```css
@theme {
  --color-primary: var(--primary);
  --color-secondary: var(--secondary);
}
```

The function can process multiple CSS files and creates corresponding output files with -theme.css suffix.
*/

import fs from "fs";
import path from "path";

export function ConvertCssVarsToTailwindV4Vars(cssFilePaths) {
  // Handle both single string and array inputs
  const filePaths = Array.isArray(cssFilePaths) ? cssFilePaths : [cssFilePaths];

  // Create a map to store all variables from all files
  const allVars = {};
  const results = [];

  for (const cssFilePath of filePaths) {
    try {
      // Read the CSS file
      const cssContent = fs.readFileSync(cssFilePath, 'utf8');

      // Regex to match CSS variables
      const regex = /--([^:]+):\s*([^;]+);/g;

      // Find all matches in the CSS content
      let match;
      while ((match = regex.exec(cssContent)) !== null) {
        // Determine the key based on includePrefixInKeys option
        const key = `--color-${match[1]}`

        // Determine the value based on useVarSyntax option
        const value = `var(--${match[1]})`

        // Store in the allVars object
        allVars[key] = value;
      }

      results.push({
        inputPath: cssFilePath,
        success: true
      });

    } catch (error) {
      console.error(`Error processing ${cssFilePath}: ${error.message}`);
      results.push({
        inputPath: cssFilePath,
        error: error.message,
        success: false
      });
    }
  }

  // Format the output as a CSS-like string with @theme selector
  let content = '@theme {\n';

  // Add each variable as a CSS property
  for (const [key, value] of Object.entries(allVars)) {
    content += `  ${key}: ${value};\n`;
  }

  // Close the selector
  content += '}';

  // Generate output file path using the first file's directory
  const firstFilePath = filePaths[0];
  const parsedPath = path.parse(firstFilePath);
  const outputPath = path.join(
    parsedPath.dir,
    'tailwindVars.css'
  );

  // Write the combined content to the output file
  fs.writeFileSync(outputPath, content, 'utf8');

  // Add the output path to the results
  results.push({
    outputPath,
    success: true
  });

  return results;
}


// convert css file to jsVarsReferenceObject