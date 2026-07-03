import * as fs from "fs";
import * as path from "path";
import { addUtil } from "../commands/utils.js";
import { addHook } from "../commands/hook.js";
import { addLayout } from "../commands/layout.js";
import { add } from "../commands/add.js";

/**
 * Walk a copied component file's imports and (a) collect 3rd-party deps to
 * install, (b) recursively pull in any referenced glare components, hooks, or
 * utils so the user gets a self-contained drop-in.
 *
 * Import-path forms understood:
 *   "lucide-react"                          → 3rd-party
 *   "./TableView"                           → sibling (already copied by folder copy)
 *   "../Button"                             → ../components/Button.tsx
 *   "../../components/Button"               → same
 *   "../utils/cn"                           → util "cn"
 *   "../../utils/cn"                        → util "cn"
 *   "../../utils/dataViews/pathUtils"       → util folder "dataViews" (whole folder)
 *   "../hooks/useIsMobile"                  → hook "useIsMobile.ts"
 *   "../../hooks/useIsMobile"               → same
 *
 * @param componentPath - File whose imports we're walking.
 * @param installedDependencies - Already-present 3rd-party packages.
 * @returns Set of 3rd-party deps still to install.
 */
export function getDependenciesAndInstallNestedComponents(
    componentPath: string,
    installedDependencies: Set<string>,
): Set<string> {
    const componentContent = fs.readFileSync(componentPath, "utf-8");
    const importRegex = /import\s+(?:[\s\S]*?from\s+)?['"]([^'"]+)['"]/g;
    const dependenciesToInstall = new Set<string>();
    const dir = path.dirname(componentPath);

    let match;
    while ((match = importRegex.exec(componentContent)) !== null) {
        const moduleName = match[1];
        if (!moduleName) continue;

        // ----- 3rd-party packages (no relative prefix) -----
        if (!moduleName.startsWith(".")) {
            if (!installedDependencies.has(moduleName)) {
                dependenciesToInstall.add(moduleName);
            }
            continue;
        }

        // ----- Relative imports -----
        const segments = moduleName.split("/").filter(s => s && s !== ".");
        const dotDots = segments.filter(s => s === "..").length;
        const rest = segments.slice(dotDots);

        // Sibling import (no ..): handled by directory copy, skip.
        if (dotDots === 0) continue;

        const head = rest[0];

        // Implicit-or-explicit segment header — handle both:
        //   "../utils/cn"     (head = "utils")
        //   "../../utils/cn"  (head = "utils")
        //   "../Button"       (head = "Button")           → component sibling
        if (head === "utils") {
            // utils/cn  or  utils/dataViews/pathUtils
            const utilEntry = rest[1]
            if (utilEntry) {
                addUtil(utilEntry)
            }
        } else if (head === "hooks") {
            const hookEntry = rest[1]
            if (hookEntry) {
                addHook(`${hookEntry}.ts`)
            }
        } else if (head === "layouts") {
            // layouts/DataViewCard → copy from apps/lib/layouts (NOT components)
            const layoutEntry = rest[1]
            if (layoutEntry) {
                addLayout(layoutEntry)
            }
        } else if (head === "components") {
            const compEntry = rest[1]
            if (compEntry) {
                // Use bare name; the add() resolver figures out folder-vs-file.
                add(compEntry)
            }
        } else {
            // Bare relative — assume sibling component (e.g. "../Button" from a layout).
            // Resolve against the file system to decide whether to call addUtil/addHook/add.
            const resolved = resolveRelative(dir, moduleName)
            if (resolved) {
                routeByLocation(resolved)
            } else {
                // Fallback: try as a sibling component.
                add(head)
            }
        }
    }

    return dependenciesToInstall;
}

/**
 * Resolve a relative import to an absolute file or folder path inside
 * apps/lib (skipping extension guesses — caller knows what they want).
 * Returns null when nothing exists.
 */
function resolveRelative(fromDir: string, moduleName: string): string | null {
    const base = path.resolve(fromDir, moduleName)
    const candidates = [base, `${base}.tsx`, `${base}.ts`, path.join(base, "index.ts"), path.join(base, "index.tsx")]
    for (const c of candidates) {
        if (fs.existsSync(c)) return c
    }
    return null
}

/**
 * Given an absolute path inside apps/lib, route it to the right add* command
 * by inspecting which top-level folder it lives in.
 */
function routeByLocation(absPath: string): void {
    const marker = `${path.sep}apps${path.sep}lib${path.sep}`
    const idx = absPath.indexOf(marker)
    if (idx === -1) return
    const after = absPath.slice(idx + marker.length)
    const [folder, ...rest] = after.split(path.sep)
    const entry = rest[0]
    if (!entry) return
    switch (folder) {
        case "components": add(stripExt(entry)); break
        case "hooks":      addHook(entry); break
        case "utils":      addUtil(entry); break
        case "layouts":    addLayout(stripExt(entry)); break
    }
}

function stripExt(name: string): string {
    return name.replace(/\.(tsx?|jsx?)$/, "")
}
