package main

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
)

func main() {
	// Define the directory containing the .tsx files
	dirPath := "/home/sajjad/TORCH-Glare/lib/components"

	// Read all .tsx files in the directory
	files, err := filepath.Glob(filepath.Join(dirPath, "*.tsx"))
	if err != nil {
		fmt.Println("Error reading directory:", err)
		return
	}

	// Regex to match Tailwind CSS variables (var(--variable-name) and --variable-name) with any prefix
	regex := regexp.MustCompile(`([a-zA-Z0-9-]+)-\[var\(--([a-zA-Z0-9-]+)\)]|([a-zA-Z0-9-]+)-\[--([a-zA-Z0-9-]+)\]`)

	for _, file := range files {
		// Read the file content
		content, err := os.ReadFile(file)
		if err != nil {
			fmt.Println("Error reading file:", file, err)
			continue
		}

		// Replace matches with Tailwind-compatible syntax
		replacedContent := regex.ReplaceAllStringFunc(string(content), func(match string) string {
			submatches := regex.FindStringSubmatch(match)
			classPrefix := ""
			varName := ""
			if submatches[1] != "" {
				classPrefix = submatches[1]
				varName = submatches[2]
			} else {
				classPrefix = submatches[3]
				varName = submatches[4]
			}
			return fmt.Sprintf("%s-%s", classPrefix, varName)
		})

		// Write back the modified content to the same file
		err = os.WriteFile(file, []byte(replacedContent), 0644)
		if err != nil {
			fmt.Println("Error writing file:", file, err)
			continue
		}

		fmt.Println("Modified file:", file)
	}

	fmt.Println("Processing complete for all .tsx files in:", dirPath)
}
