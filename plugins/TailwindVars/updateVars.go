package main

import (
	"bufio"
	"fmt"
	"os"
	"regexp"
)

// input: give it dark.css file or any css mod file of the mod files exported from glare figma.
// output: create a file called colors.js contain js object of variables you can use in tailwind.config file.

/*
example :

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

func main() {
	// Define the input CSS file path
	cssFilePath := "C:/Users/sajjad/Documents/projects/TORCH-Glare/dark.css"

	// Open the CSS file
	cssFile, err := os.Open(cssFilePath)
	if err != nil {
		fmt.Println("Error opening CSS file:", err)
		return
	}
	defer cssFile.Close()

	// Regex to match CSS variables
	re := regexp.MustCompile(`--([^:]+):\s*([^;]+);`)

	// Create a map to store the variables
	vars := make(map[string]string)

	// Read the CSS file line by line
	scanner := bufio.NewScanner(cssFile)
	for scanner.Scan() {
		line := scanner.Text()
		matches := re.FindStringSubmatch(line)
		if len(matches) == 3 {
			// Store the variable name as the key and the value as `var(--variable-name)`
			vars[matches[1]] = fmt.Sprintf("var(--%s)", matches[1])
		}
	}

	// Check for errors during scanning
	if err := scanner.Err(); err != nil {
		fmt.Println("Error reading CSS file:", err)
		return
	}

	// Define the output JavaScript file path
	jsFilePath := "colors.js"

	// Create a JavaScript file
	jsFile, err := os.Create(jsFilePath)
	if err != nil {
		fmt.Println("Error creating JavaScript file:", err)
		return
	}
	defer jsFile.Close()

	// Write the JavaScript object to the file
	writer := bufio.NewWriter(jsFile)
	writer.WriteString("const colors = {\n")
	for key, value := range vars {
		writer.WriteString(fmt.Sprintf("  \"%s\": \"%s\",\n", key, value))
	}
	writer.WriteString("};\n")

	// Flush the buffer to ensure all data is written to the file
	writer.Flush()

	fmt.Printf("JavaScript file '%s' created successfully!\n", jsFilePath)
}
