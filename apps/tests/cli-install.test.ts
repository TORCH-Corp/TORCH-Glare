/**
 * The CLI's install path.
 *
 * These cover the three bugs that made `add DataViews` install 16 of 55 items and exit 0: an empty
 * leftover directory counting as "installed", names that only matched with their file extension,
 * and a dependency walk with no visited set. Tests run with cwd = apps.
 */
import { describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "fs";
import { tmpdir } from "os";
import path from "path";
import { readFileSync as read } from "fs";

import { resolveEntry, isInstalled } from "../../cli/src/shared/resolveEntry";
import { resolveInstallPlan } from "../../cli/src/shared/resolveInstallPlan";
import { wireStylesheet, MARKER } from "../../cli/src/shared/wireStylesheet";
import type { Registry } from "../../cli/src/types/main";

const registry: Registry = JSON.parse(read(path.resolve(process.cwd(), "lib/registry.json"), "utf-8"));

const tmp = () => mkdtempSync(path.join(tmpdir(), "glare-cli-"));

describe("resolveEntry", () => {
    const available = ["Button.tsx", "DataViews", "useDragDrop.tsx", "cn.ts"];
    const dir = path.resolve(process.cwd(), "lib/components");

    it("accepts a bare name, which is what every command passes", () => {
        expect(resolveEntry("Button", available, dir)).toBe("Button.tsx");
        // The one that used to fail silently: the only hook shipped as .tsx.
        expect(resolveEntry("useDragDrop", available, dir)).toBe("useDragDrop.tsx");
        expect(resolveEntry("cn", available, dir)).toBe("cn.ts");
    });

    it("accepts the name with its extension, and a folder component", () => {
        expect(resolveEntry("Button.tsx", available, dir)).toBe("Button.tsx");
        expect(resolveEntry("DataViews", available, dir)).toBe("DataViews");
    });

    it("returns null for something that does not exist", () => {
        expect(resolveEntry("NotAThing", available, dir)).toBeNull();
    });
});

describe("isInstalled", () => {
    it("treats an empty directory as absent", () => {
        const root = tmp();
        mkdirSync(path.join(root, "DataViews"), { recursive: true });
        // This is the exact state that made `add DataViews` refuse to copy while reporting
        // "already exists" — a folder left behind by a deleted install.
        expect(isInstalled(root, "DataViews")).toBe(false);
        rmSync(root, { recursive: true, force: true });
    });

    it("treats a directory with a file — at any depth — as installed", () => {
        const root = tmp();
        mkdirSync(path.join(root, "DataViews", "views"), { recursive: true });
        writeFileSync(path.join(root, "DataViews", "views", "table.tsx"), "export {}");
        expect(isInstalled(root, "DataViews")).toBe(true);
        rmSync(root, { recursive: true, force: true });
    });

    it("treats a plain file as installed", () => {
        const root = tmp();
        writeFileSync(path.join(root, "Button.tsx"), "export {}");
        expect(isInstalled(root, "Button.tsx")).toBe(true);
        rmSync(root, { recursive: true, force: true });
    });
});

describe("the install plan", () => {
    it("resolves the whole graph for a folder component", () => {
        const plan = resolveInstallPlan(registry, "components", "DataViews");
        expect(plan).not.toBeNull();

        const names = plan!.items.map((i) => `${i.type}/${i.name}`);
        // Every one of these was missing after `add DataViews --force` under the old walker.
        for (const ref of [
            "components/FormBuilder",
            "components/TreeFolder",
            "components/Card",
            "layouts/DataViewCard",
            "hooks/useDragDrop",
            "utils/cn",
        ]) {
            expect(names).toContain(ref);
        }
    });

    it("visits each item exactly once", () => {
        const plan = resolveInstallPlan(registry, "components", "DataViews")!;
        const names = plan.items.map((i) => `${i.type}/${i.name}`);
        // `utils/cn` is depended on by most of the tree; the old walker copied it once per
        // importing file and printed a success line each time.
        expect(new Set(names).size).toBe(names.length);
    });

    it("returns null for an unregistered item, so the caller can say so", () => {
        expect(resolveInstallPlan(registry, "components", "NoSuchComponent")).toBeNull();
    });
});

describe("stylesheet wiring", () => {
    it("writes the block, keeping the tailwind import first", () => {
        const root = tmp();
        mkdirSync(path.join(root, "app"), { recursive: true });
        const css = path.join(root, "app", "globals.css");
        writeFileSync(css, '@import "tailwindcss";\n\nbody { margin: 0; }\n');

        expect(wireStylesheet(false, root).status).toBe("written");

        const out = readFileSync(css, "utf-8");
        expect(out).toContain(MARKER);
        // The ordering rule: a bundler drops an @import that follows an @plugin.
        expect(out.indexOf('@import "tailwindcss"')).toBeLessThan(out.indexOf("@plugin"));
        // Exactly one tailwind import — not a second one bolted on.
        expect(out.match(/@import "tailwindcss"/g)).toHaveLength(1);
        // The project's own CSS survives.
        expect(out).toContain("body { margin: 0; }");
        rmSync(root, { recursive: true, force: true });
    });

    it("is a no-op the second time", () => {
        const root = tmp();
        mkdirSync(path.join(root, "app"), { recursive: true });
        const css = path.join(root, "app", "globals.css");
        writeFileSync(css, '@import "tailwindcss";\n');

        wireStylesheet(false, root);
        const after = readFileSync(css, "utf-8");
        expect(wireStylesheet(false, root).status).toBe("already");
        expect(readFileSync(css, "utf-8")).toBe(after);
        rmSync(root, { recursive: true, force: true });
    });

    it("reports when there is no stylesheet rather than writing one", () => {
        const root = tmp();
        expect(wireStylesheet(false, root).status).toBe("not-found");
        rmSync(root, { recursive: true, force: true });
    });
});
