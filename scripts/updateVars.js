// Inputs: Give it dark.css file or any css mod file of the mod files exported from glare figma.
// Outputs: Create a file called colors.js containing a JS object of variables you can use in tailwind.config file.

/*
example:

var cssColors = {
  "primary": "var(--primary)",
  "secondary": "var(--secondary)",
}

// in tailwind.config
 theme: {
    extend: {
      colors: cssColors
    },
  },
*/

import fs from "fs";


function updateVars() {
  // Define the input CSS file path
  const cssFilePath = "/home/sajjad/TORCH-Glare/index.css";

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
      // Store the variable name as the key and the value as `var(--variable-name)`
      vars[match[1]] = `var(--${match[1]})`;
    }

    // Define the output JavaScript file path
    const jsFilePath = "colors.js";

    // Create the JavaScript content
    let jsContent = "const colors = {\n";
    for (const [key, value] of Object.entries(vars)) {
      jsContent += `  "${key}": "${value}",\n`;
    }
    jsContent += "};\n";

    // Write to the JavaScript file
    fs.writeFileSync(jsFilePath, jsContent);

    console.log(`JavaScript file '${jsFilePath}' created successfully!`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

// Execute the function
updateVars(); 