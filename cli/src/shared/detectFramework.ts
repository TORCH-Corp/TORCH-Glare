import fs from "fs";
import path from "path";

export type Framework = "next" | "vite" | "react" | "unknown";

/**
 * Detect the framework used in the project by checking package.json dependencies.
 */
export function detectFramework(): Framework {
    const packageJsonPath = path.join(process.cwd(), "package.json");

    if (!fs.existsSync(packageJsonPath)) {
        return "unknown";
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    const allDeps = {
        ...(packageJson.dependencies || {}),
        ...(packageJson.devDependencies || {}),
    };

    if (allDeps["next"]) return "next";
    if (allDeps["vite"]) return "vite";
    if (allDeps["react"]) return "react";

    return "unknown";
}

/**
 * Detect if the project uses Tailwind CSS v3 (returns true) or v4+ (returns false).
 * Returns null if Tailwind is not installed.
 */
export function detectTailwindVersion(): 3 | 4 | null {
    const packageJsonPath = path.join(process.cwd(), "package.json");

    if (!fs.existsSync(packageJsonPath)) {
        return null;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    const allDeps = {
        ...(packageJson.dependencies || {}),
        ...(packageJson.devDependencies || {}),
    };

    const tailwindVersion = allDeps["tailwindcss"];
    if (!tailwindVersion) return null;

    if (tailwindVersion.startsWith("^3") || tailwindVersion.startsWith("3") || tailwindVersion.startsWith("~3")) {
        return 3;
    }

    return 4;
}

/**
 * Find the global CSS file in the project.
 */
export function findGlobalCssPath(framework: Framework): string | null {
    const candidates = framework === "next"
        ? [
            "app/globals.css",
            "src/app/globals.css",
            "styles/globals.css",
            "src/styles/globals.css",
        ]
        : [
            "src/index.css",
            "src/globals.css",
            "src/App.css",
            "index.css",
            "styles/globals.css",
        ];

    for (const candidate of candidates) {
        if (fs.existsSync(path.join(process.cwd(), candidate))) {
            return candidate;
        }
    }

    return null;
}

/**
 * Find the Tailwind config file path.
 */
export function findTailwindConfigPath(): string | null {
    const candidates = [
        "tailwind.config.ts",
        "tailwind.config.js",
        "tailwind.config.mjs",
        "tailwind.config.cjs",
    ];

    for (const candidate of candidates) {
        if (fs.existsSync(path.join(process.cwd(), candidate))) {
            return candidate;
        }
    }

    return null;
}

/**
 * Find the layout/HTML file where font links should be injected.
 */
export function findLayoutPath(framework: Framework): string | null {
    if (framework === "next") {
        const candidates = [
            "app/layout.tsx",
            "app/layout.jsx",
            "app/layout.js",
            "src/app/layout.tsx",
            "src/app/layout.jsx",
            "src/app/layout.js",
        ];
        for (const candidate of candidates) {
            if (fs.existsSync(path.join(process.cwd(), candidate))) {
                return candidate;
            }
        }
    }

    // Vite / React / Other
    const htmlCandidates = [
        "index.html",
        "public/index.html",
    ];
    for (const candidate of htmlCandidates) {
        if (fs.existsSync(path.join(process.cwd(), candidate))) {
            return candidate;
        }
    }

    return null;
}
