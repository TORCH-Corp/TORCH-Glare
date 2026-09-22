/**
 * The published registry contract.
 *
 * `registry/schema.json` is the generator's contract, so two things have to hold: what the
 * generator emits must satisfy it, and the schema must be strict enough for that to mean
 * something. The negative controls below exist for the second half — a validator that accepts
 * everything would make the first half pass while proving nothing.
 */
import { existsSync, readFileSync, readdirSync } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

const REGISTRY_DIR = path.resolve(process.cwd(), "../registry");
const hosted = existsSync(REGISTRY_DIR);
const read = (p: string) => JSON.parse(readFileSync(p, "utf-8"));

const schema = hosted ? read(path.join(REGISTRY_DIR, "schema.json")) : null;

type Schema = Record<string, any>;

/**
 * A validator for the draft-07 subset the schema uses: $ref, oneOf, type, enum, required,
 * properties, additionalProperties, items, minItems and pattern.
 *
 * Deliberately not a dependency. `ajv` is only present here transitively via eslint, and pulling a
 * direct one in for a single test is a poor trade when the subset is this small — provided the
 * validator itself is tested, which is what `rejects` below does.
 */
function validate(value: unknown, node: Schema, root: Schema, at = "$"): string[] {
    if (node.$ref) {
        const target = node.$ref.replace(/^#\//, "").split("/").reduce((o: any, k) => o?.[k], root);
        return validate(value, target, root, at);
    }

    if (node.oneOf) {
        const passes = node.oneOf.filter((alt: Schema) => validate(value, alt, root, at).length === 0);
        return passes.length === 1 ? [] : [`${at}: matched ${passes.length} of oneOf, expected 1`];
    }

    const errors: string[] = [];

    if (node.enum && !node.enum.includes(value as never)) {
        errors.push(`${at}: ${JSON.stringify(value)} not in enum`);
    }

    if (node.type === "string") {
        if (typeof value !== "string") return [`${at}: expected string`];
        if (node.pattern && !new RegExp(node.pattern).test(value)) {
            errors.push(`${at}: ${JSON.stringify(value)} fails ${node.pattern}`);
        }
    }

    if (node.type === "array") {
        if (!Array.isArray(value)) return [`${at}: expected array`];
        if (node.minItems !== undefined && value.length < node.minItems) {
            errors.push(`${at}: fewer than ${node.minItems} items`);
        }
        if (node.items) {
            value.forEach((v, i) => errors.push(...validate(v, node.items, root, `${at}[${i}]`)));
        }
    }

    if (node.type === "object") {
        if (typeof value !== "object" || value === null || Array.isArray(value)) {
            return [`${at}: expected object`];
        }
        const obj = value as Record<string, unknown>;
        for (const key of node.required ?? []) {
            if (!(key in obj)) errors.push(`${at}: missing required "${key}"`);
        }
        for (const [key, sub] of Object.entries(node.properties ?? {})) {
            if (key in obj) errors.push(...validate(obj[key], sub as Schema, root, `${at}.${key}`));
        }
        if (node.additionalProperties && typeof node.additionalProperties === "object") {
            const declared = new Set(Object.keys(node.properties ?? {}));
            for (const [key, v] of Object.entries(obj)) {
                if (!declared.has(key)) {
                    errors.push(...validate(v, node.additionalProperties, root, `${at}.${key}`));
                }
            }
        }
    }

    return errors;
}

describe("registry schema", () => {
    it.skipIf(!hosted)("declares both served shapes", () => {
        expect(schema.$id).toBe("https://raw.githubusercontent.com/TORCH-Corp/TORCH-Glare/main/registry/schema.json");
        expect(Object.keys(schema.definitions)).toEqual(
            expect.arrayContaining(["index", "indexItem", "item", "file", "type", "ref"]),
        );
    });

    it.skipIf(!hosted)("accepts the index we actually serve", () => {
        const index = read(path.join(REGISTRY_DIR, "index.json"));
        expect(validate(index, schema.definitions.index, schema)).toEqual([]);
    });

    it.skipIf(!hosted)("accepts every item we actually serve", () => {
        const failures: string[] = [];
        let checked = 0;

        for (const type of readdirSync(REGISTRY_DIR, { withFileTypes: true })) {
            if (!type.isDirectory()) continue;
            for (const file of readdirSync(path.join(REGISTRY_DIR, type.name))) {
                const errors = validate(
                    read(path.join(REGISTRY_DIR, type.name, file)),
                    schema.definitions.item,
                    schema,
                );
                checked++;
                if (errors.length) failures.push(`${type.name}/${file}: ${errors.join("; ")}`);
            }
        }

        expect(failures).toEqual([]);
        expect(checked).toBe(92);
    });

    // The point of these: prove the validator and the schema are strict enough that the three
    // tests above are not vacuous.
    describe("rejects", () => {
        const item = () => ({
            version: "2.5.6",
            name: "Button",
            type: "components",
            dependencies: [],
            registryDependencies: ["utils/cn"],
            files: [{ path: "components/Button.tsx", target: "components/Button.tsx", content: "x" }],
        });

        const cases: [string, (i: ReturnType<typeof item>) => unknown][] = [
            ["a missing required key", (i) => ({ ...i, files: undefined, name: i.name })],
            ["an unknown type", (i) => ({ ...i, type: "blocks" })],
            ["an empty files array", (i) => ({ ...i, files: [] })],
            ["a file with no content", (i) => ({ ...i, files: [{ path: "a", target: "a" }] })],
            ["non-string content", (i) => ({ ...i, files: [{ ...i.files[0], content: 42 }] })],
            ["a malformed registry ref", (i) => ({ ...i, registryDependencies: ["cn"] })],
            ["a ref with an unknown type", (i) => ({ ...i, registryDependencies: ["blocks/x"] })],
            ["a name that starts with a dot", (i) => ({ ...i, name: ".hidden" })],
            ["dependencies as a string", (i) => ({ ...i, dependencies: "clsx" })],
        ];

        it.skipIf(!hosted)("the valid fixture, as a control", () => {
            expect(validate(item(), schema.definitions.item, schema)).toEqual([]);
        });

        for (const [label, mutate] of cases) {
            it.skipIf(!hosted)(label, () => {
                const errors = validate(mutate(item()), schema.definitions.item, schema);
                expect(errors.length).toBeGreaterThan(0);
            });
        }
    });
});
