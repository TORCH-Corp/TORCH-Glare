/**
 * Writing installed files, and pinning the npm packages they need.
 *
 * Both of these take their input from the network, so both are tested against a registry that
 * misbehaves — a hostile `target`, and an index that forgot to pin.
 */
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from "fs";
import { tmpdir } from "os";
import path from "path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { installFromPlan } from "../../cli/src/shared/installFromPlan";
import { resetItemMemo } from "../../cli/src/shared/registryClient";
import { resetRegistryCache } from "../../cli/src/shared/loadRegistry";
import type { Registry, RegistryItemPayload } from "../../cli/src/types/main";

// Record the specs chosen instead of shelling out to a package manager. What matters here is
// *which* version range is picked, not that npm can install it — and a real install would make
// these tests need the network and take seconds each.
vi.mock("../../cli/src/shared/installDependencies", () => ({
    installNpmPackages: (packages: Iterable<string>) => [...packages],
}));

const tmp = () => mkdtempSync(path.join(tmpdir(), "glare-install-"));

/** An index with one item, plus whatever npmVersions the case wants to test. */
function index(npmVersions: Record<string, string>, npmDependencies: string[] = []): Registry {
    return {
        version: "2.5.6",
        generatedBy: "test",
        npmVersions,
        items: [
            {
                name: "Button",
                type: "components",
                path: "components/Button.tsx",
                files: ["components/Button.tsx"],
                npmDependencies,
                registryDependencies: [],
            },
        ],
    };
}

function payload(files: { target: string; content?: string }[], dependencies: string[] = []) {
    return {
        version: "2.5.6",
        name: "Button",
        type: "components",
        dependencies,
        registryDependencies: [],
        files: files.map((f) => ({
            path: f.target,
            target: f.target,
            content: f.content ?? "export const Button = () => null;\n",
        })),
    } as RegistryItemPayload;
}

/** Serve the index and the single item over a stubbed `fetch`. */
function serve(reg: Registry, item: RegistryItemPayload) {
    vi.stubGlobal("fetch", async (url: string) => ({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(url.endsWith("index.json") ? reg : item),
    }));
}

let cwd: string;
let root: string;

beforeEach(() => {
    resetItemMemo();
    resetRegistryCache();
    vi.unstubAllGlobals();
    root = tmp();
    cwd = process.cwd();
    process.chdir(root);
    // installNpmPackages reads the project's package.json; without one it exits the process.
    writeFileSync(path.join(root, "package.json"), JSON.stringify({ name: "t", dependencies: {} }));
});

afterEach(() => {
    process.chdir(cwd);
    rmSync(root, { recursive: true, force: true });
});

const config = { path: "./src" };

describe("write targets", () => {
    it("writes a legitimate target", async () => {
        serve(index({}), payload([{ target: "components/Button.tsx" }]));
        const result = await installFromPlan("components", "Button", config, false);

        expect(result?.installed).toEqual(["components/Button"]);
        expect(existsSync(path.join(root, "src/components/Button.tsx"))).toBe(true);
    });

    // Every one of these must be rejected, not merely fail later. `path.join` normalises a leading
    // slash away, so an "absolute" target lands inside the project — that is fine, and the test
    // records it rather than pretending otherwise.
    const hostile = ["..", "../escaped.tsx", "../../escaped.tsx", "", "."];

    for (const target of hostile) {
        it(`rejects target ${JSON.stringify(target)}`, async () => {
            serve(index({}), payload([{ target }]));
            await expect(installFromPlan("components", "Button", config, false)).rejects.toThrow(
                /outside the install directory/,
            );
        });
    }

    it("never writes anything outside the install root", async () => {
        const sentinel = path.join(root, "escaped.tsx");
        serve(index({}), payload([{ target: "../escaped.tsx" }]));

        await expect(installFromPlan("components", "Button", config, false)).rejects.toThrow();
        expect(existsSync(sentinel)).toBe(false);
    });

    it("keeps a normalised absolute-looking target inside the project", async () => {
        serve(index({}), payload([{ target: "/components/Button.tsx" }]));
        await installFromPlan("components", "Button", config, false);
        expect(existsSync(path.join(root, "src/components/Button.tsx"))).toBe(true);
    });
});

describe("npm dependency pinning", () => {
    const installed = () =>
        JSON.parse(readFileSync(path.join(root, "package.json"), "utf-8")).dependencies;

    it("uses the range the index pins", async () => {
        serve(index({ clsx: "^2.1.1" }, ["clsx"]), payload([{ target: "components/Button.tsx" }]));
        const result = await installFromPlan("components", "Button", config, false);
        expect(result?.npm).toEqual(["clsx@^2.1.1"]);
    });

    it("prefers the item's own pinned spec over the index", async () => {
        // The payload is the more specific source, and the only one a sparse index leaves.
        serve(
            index({ clsx: "^1.0.0" }, ["clsx"]),
            payload([{ target: "components/Button.tsx" }], ["clsx@^2.1.1"]),
        );
        const result = await installFromPlan("components", "Button", config, false);
        expect(result?.npm).toEqual(["clsx@^2.1.1"]);
    });

    it("falls back to the item spec when the index pins nothing", async () => {
        // The bug: this used to read the index only, so an empty npmVersions installed `clsx`
        // unpinned even though the payload said ^2.1.1.
        serve(index({}, ["clsx"]), payload([{ target: "components/Button.tsx" }], ["clsx@^2.1.1"]));
        const result = await installFromPlan("components", "Button", config, false);
        expect(result?.npm).toEqual(["clsx@^2.1.1"]);
    });

    it("keeps the scope of a scoped package intact", async () => {
        serve(
            index({}, ["@radix-ui/react-slot"]),
            payload([{ target: "components/Button.tsx" }], ["@radix-ui/react-slot@^1.1.1"]),
        );
        const result = await installFromPlan("components", "Button", config, false);
        expect(result?.npm).toEqual(["@radix-ui/react-slot@^1.1.1"]);
    });

    it("warns when nothing pins a dependency, instead of silently taking latest", async () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        serve(index({}, ["clsx"]), payload([{ target: "components/Button.tsx" }]));

        const result = await installFromPlan("components", "Button", config, false);

        expect(result?.npm).toEqual(["clsx"]);
        expect(warn).toHaveBeenCalledWith(expect.stringContaining("No version range for clsx"));
        warn.mockRestore();
    });

    it("stays quiet when everything is pinned", async () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        serve(index({ clsx: "^2.1.1" }, ["clsx"]), payload([{ target: "components/Button.tsx" }]));

        await installFromPlan("components", "Button", config, false);

        expect(warn).not.toHaveBeenCalled();
        warn.mockRestore();
    });
});

describe("skipping what is already there", () => {
    it("skips an installed item and reinstalls it with force", async () => {
        serve(index({}), payload([{ target: "components/Button.tsx" }]));
        mkdirSync(path.join(root, "src/components"), { recursive: true });
        writeFileSync(path.join(root, "src/components/Button.tsx"), "// mine\n");

        const skip = await installFromPlan("components", "Button", config, false);
        expect(skip?.skipped).toEqual(["components/Button"]);
        expect(readFileSync(path.join(root, "src/components/Button.tsx"), "utf-8")).toBe("// mine\n");

        const forced = await installFromPlan("components", "Button", config, true);
        expect(forced?.installed).toEqual(["components/Button"]);
        expect(readFileSync(path.join(root, "src/components/Button.tsx"), "utf-8")).toContain(
            "export const Button",
        );
    });

    it("returns null for an item the registry does not have", async () => {
        serve(index({}), payload([{ target: "components/Button.tsx" }]));
        expect(await installFromPlan("components", "Nope", config, false)).toBeNull();
    });
});
