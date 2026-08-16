import fs from "fs";
import path from "path";

/**
 * Where an entry stylesheet lives, in the order projects usually put it.
 * Next.js app router first, then pages/Vite, then a `styles/` convention.
 */
const CANDIDATES = [
    "app/globals.css",
    "src/app/globals.css",
    "src/index.css",
    "styles/globals.css",
    "src/styles/globals.css",
    "app/global.css",
    "src/styles/index.css",
];

/** The marker that tells us the block is already there. */
const MARKER = "glare-torch-mode";

/**
 * Tailwind v4 registers the design system through the CSS file itself.
 *
 * The order matters and is not cosmetic: CSS requires every `@import` to precede other at-rules, so
 * an `@import "tailwindcss"` placed *after* the `@plugin` lines is silently dropped by the bundler.
 * That takes every `--color-*` registration with it and leaves every `bg-background-presentation-*`
 * utility rendering as nothing — with no build error to explain it.
 */
const V4_BLOCK = `@import "tailwindcss";
@import "mapping-color-system-v4/tailwindVars.css";
@plugin "glare-torch-mode";
@plugin "tailwind-scrollbar-hide";
@plugin "tailwindcss-animate";
@plugin "glare-typography";
@plugin "mapping-color-system-v4";
`;

/** For v3 the plugins belong in `tailwind.config.*`, which is user-owned JS we do not rewrite. */
const V3_SNIPPET = `plugins: [
  require("glare-torch-mode"),
  require("tailwind-scrollbar-hide"),
  require("tailwindcss-animate"),
  require("glare-typography"),
  require("mapping-color-system"),
  require("@tailwindcss/container-queries"),
]`;

export function findStylesheet(cwd: string = process.cwd()): string | null {
    for (const candidate of CANDIDATES) {
        const full = path.join(cwd, candidate);
        if (fs.existsSync(full)) return full;
    }
    return null;
}

/**
 * Put the design system into the project's stylesheet.
 *
 * `init` used to install the five Tailwind packages and stop, leaving the wiring as a manual step
 * buried in the docs — so a project would build cleanly and render every component unstyled. This
 * closes that gap, and is a no-op when the block is already present, so re-running `init` is safe.
 *
 * @returns what happened, so the caller can report it truthfully.
 */
export function wireStylesheet(
    isV3: boolean,
    cwd: string = process.cwd(),
): { status: "written" | "already" | "not-found" | "manual"; file?: string } {
    // v3's plugins go in tailwind.config.*, whose shape is arbitrary user JS. A wrong edit there is
    // worse than a printed instruction, so print and let the developer place it.
    if (isV3) {
        console.log("ℹ️ Tailwind v3 detected. Add these plugins to your `tailwind.config.*`:\n");
        console.log(V3_SNIPPET + "\n");
        return { status: "manual" };
    }

    const file = findStylesheet(cwd);
    if (!file) {
        console.log(
            "⚠️ No entry stylesheet found (looked for " +
                CANDIDATES.slice(0, 4).join(", ") +
                ").\n   Add this to yours, keeping `@import \"tailwindcss\"` first:\n",
        );
        console.log(V4_BLOCK);
        return { status: "not-found" };
    }

    const current = fs.readFileSync(file, "utf-8");
    if (current.includes(MARKER)) {
        console.log(`✅ ${path.relative(cwd, file)} is already wired — left alone.`);
        return { status: "already", file };
    }

    // Replace the project's own `@import "tailwindcss"` rather than adding a second one; if there
    // is none, the block goes at the very top, which is where the import has to be anyway.
    const existing = /^[ \t]*@import\s+["']tailwindcss["'];?[ \t]*\r?\n/m;
    const next = existing.test(current)
        ? current.replace(existing, V4_BLOCK)
        : V4_BLOCK + "\n" + current;

    fs.writeFileSync(file, next);
    console.log(`✅ Wired ${path.relative(cwd, file)} with the TORCH Glare design system.`);
    return { status: "written", file };
}

export { V4_BLOCK, MARKER, CANDIDATES };
