package main

import (
	"bufio"
	"fmt"
	"os"
	"regexp"
	"strings"
)

func main() {
	// Input and output file paths
	cssFilePath := "C:/Users/sajjad/Documents/projects/TORCH-Glare/src/lib/providers/ThemeProvider/themes/themes/torch.css" // Replace with your CSS file path
	jsFilePath := "output.js"                                                                                               // Replace with your desired JS file path

	// Read the CSS file
	cssContent, err := os.ReadFile(cssFilePath)
	if err != nil {
		fmt.Println("Error reading CSS file:", err)
		return
	}

	// Extract CSS variables
	variables := extractCSSVariables(string(cssContent))

	// Generate JavaScript content
	jsContent := generateJSContent(variables)

	// Write the JavaScript content to the output file
	err = os.WriteFile(jsFilePath, []byte(jsContent), 0644)
	if err != nil {
		fmt.Println("Error writing JS file:", err)
		return
	}

	fmt.Println("JavaScript file generated successfully:", jsFilePath)
}

// extractCSSVariables extracts CSS variables from the given CSS content
func extractCSSVariables(cssContent string) map[string]string {
	variables := make(map[string]string)
	scanner := bufio.NewScanner(strings.NewReader(cssContent))

	// Regex to match CSS variables
	re := regexp.MustCompile(`--([^:]+):\s*([^;]+);`)

	for scanner.Scan() {
		line := scanner.Text()
		matches := re.FindStringSubmatch(line)
		if len(matches) == 3 {
			key := strings.TrimSpace(matches[1])
			value := strings.TrimSpace(matches[2])
			variables[key] = value
		}
	}

	return variables
}

// generateJSContent generates the JavaScript content from the extracted variables
func generateJSContent(variables map[string]string) string {
	var builder strings.Builder

	// Write the JavaScript template
	builder.WriteString("module.exports = plugin(function ({ addBase }) {\n")
	builder.WriteString("  const cssVariables = {\n")
	builder.WriteString("    ':root': {\n")

	// Write each variable
	for key, value := range variables {
		builder.WriteString(fmt.Sprintf("      '--%s': '%s',\n", key, value))
	}

	builder.WriteString("    },\n")
	builder.WriteString("  };\n\n")
	builder.WriteString("  addBase(cssVariables);\n")
	builder.WriteString("});\n")

	return builder.String()
}
