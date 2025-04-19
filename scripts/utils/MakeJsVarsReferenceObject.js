
/*
this function used to crate object of colors variables from css file to be extended in tailwind config colors object. 

example:

input:

colors.css
{
  "--primary": "var(--red-500)",
  "--secondary": "var(--blue-500)",
}

output:
var cssColors = {
  "primary": "var(--primary)", // input value reference to css variable above
  "secondary": "var(--secondary)", // input value reference to css variable above
}

if you notice the input keys are the same as the output keys and the value is the same as the input key.
this is because the the keys are the same in glare design file and the value are references to the css variables.
so we can use this object to extend the tailwind config colors object and use it as tailwind variables instead of the pure css variables.

the goal of this function is to give you a reference object of the css variables to be used in the tailwind config colors object and use it in the components.
*/

import fs from "fs";


export function MakeJsVarsReferenceObject(cssFilePath) {

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
      const key = `${match[1]}`

      // Determine the value based on useVarSyntax option
      const value = `var(--${match[1]})`

      // Store in the vars object
      vars[key] = value;
    }

    return vars;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return null;
  }
}


// convert css file to jsVarsReferenceObject