import { existsSync, readFileSync } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { resolveInstallPlan } from "../../cli/src/shared/resolveInstallPlan";
import type { Registry } from "../../cli/src/types/main";

// Tests run with cwd = apps (via `pnpm -C apps run test`).
const registry: Registry = JSON.parse(
  readFileSync(path.resolve(process.cwd(), "lib/registry.json"), "utf-8"),
);

const refsOf = (plan: ReturnType<typeof resolveInstallPlan>) =>
  plan!.items.map((i) => `${i.type}/${i.name}`).sort();

describe("resolveInstallPlan", () => {
  it("returns null for an unknown item", () => {
    expect(resolveInstallPlan(registry, "components", "DoesNotExist")).toBeNull();
  });

  it("includes the entry item itself", () => {
    const plan = resolveInstallPlan(registry, "components", "Select");
    expect(refsOf(plan)).toContain("components/Select");
  });

  it("resolves the transitive closure of internal dependencies", () => {
    // Asserted as a property rather than a snapshot of Select's dependency list. The previous
    // version hardcoded `Button` and `Tooltip`, which Select stopped importing when it moved to
    // DropdownMenu — so the test failed on a library change that was entirely correct.
    const byRef = new Map(registry.items.map((i) => [`${i.type}/${i.name}`, i]));
    const refs = refsOf(resolveInstallPlan(registry, "components", "Select"));

    expect(refs).toContain("components/Select");
    expect(refs.length).toBeGreaterThan(1);

    // Closed under registryDependencies: nothing in the plan may depend on something outside it.
    const missing: string[] = [];
    for (const ref of refs) {
      for (const dep of byRef.get(ref)!.registryDependencies) {
        if (!refs.includes(dep)) missing.push(`${ref} -> ${dep}`);
      }
    }
    expect(missing).toEqual([]);

    // And minimal: every member is reachable from the entry.
    const reachable = new Set<string>();
    const stack = ["components/Select"];
    while (stack.length) {
      const ref = stack.pop()!;
      if (reachable.has(ref)) continue;
      reachable.add(ref);
      stack.push(...(byRef.get(ref)?.registryDependencies ?? []));
    }
    expect(refs.filter((r) => !reachable.has(r))).toEqual([]);
  });

  it("unions npm dependencies across the whole closure", () => {
    const plan = resolveInstallPlan(registry, "components", "Select")!;
    const npm = [...plan.npmDependencies];
    expect(npm).toContain("@radix-ui/react-select");
    // clsx + tailwind-merge come transitively from utils/cn.
    expect(npm).toEqual(expect.arrayContaining(["clsx", "tailwind-merge"]));
    // Peers are never listed as installable deps.
    expect(npm).not.toContain("react");
  });

  it("pulls transitive deps that the entry does not import directly", () => {
    // DatePicker imports Calendar; date-fns comes via Calendar/dateFormat, not DatePicker itself.
    const plan = resolveInstallPlan(registry, "components", "DatePicker")!;
    expect(refsOf(plan)).toContain("components/Calendar");
    expect([...plan.npmDependencies]).toEqual(
      expect.arrayContaining(["date-fns", "react-day-picker"]),
    );
  });

  it("produces a deduplicated item set", () => {
    const plan = resolveInstallPlan(registry, "components", "DatePicker")!;
    const refs = plan.items.map((i) => `${i.type}/${i.name}`);
    expect(new Set(refs).size).toBe(refs.length);
  });
});

describe("registry integrity", () => {
  it("has no dangling registry dependencies", () => {
    const known = new Set(registry.items.map((i) => `${i.type}/${i.name}`));
    const dangling: string[] = [];
    for (const item of registry.items) {
      for (const ref of item.registryDependencies) {
        if (!known.has(ref)) dangling.push(`${item.type}/${item.name} -> ${ref}`);
      }
    }
    expect(dangling).toEqual([]);
  });

  it("excludes work-in-progress -dev components", () => {
    expect(registry.items.some((i) => i.name.endsWith("-dev"))).toBe(false);
  });

  it("lists the files of every item, including folder components", () => {
    // The hosted registry ships exactly what `files` lists, so an item missing it installs as
    // nothing. Directory-valued paths are the ones at risk: `components/DataViews` is 34 files,
    // and nothing but this array enumerates them.
    const empty = registry.items.filter((i) => !i.files || i.files.length === 0);
    expect(empty.map((i) => `${i.type}/${i.name}`)).toEqual([]);
  });

  it("lists only files that exist, each inside its own item", () => {
    const bad: string[] = [];
    for (const item of registry.items) {
      for (const file of item.files ?? []) {
        if (!existsSync(path.resolve(process.cwd(), "lib", file))) {
          bad.push(`${item.type}/${item.name}: missing ${file}`);
        } else if (file !== item.path && !file.startsWith(`${item.path}/`)) {
          bad.push(`${item.type}/${item.name}: ${file} is outside ${item.path}`);
        }
      }
    }
    expect(bad).toEqual([]);
  });

  it("ships the ambient declarations a component needs to compile", () => {
    // Excluded by the generator until 2.5.7, which made the installed TextEditor fail to
    // typecheck: every `@editorjs/*` import resolved to an implicit any.
    const textEditor = registry.items.find((i) => i.name === "TextEditor");
    expect(textEditor?.files).toContain("components/TextEditor/editorjs.d.ts");
  });
});

describe("hosted registry", () => {
  const dir = path.resolve(process.cwd(), "../registry");
  const hosted = existsSync(dir);

  it.skipIf(!hosted)("serves one payload per index item, with matching files", () => {
    const problems: string[] = [];

    for (const item of registry.items) {
      const file = path.join(dir, item.type, `${item.name}.json`);
      if (!existsSync(file)) {
        problems.push(`${item.type}/${item.name}: not served`);
        continue;
      }
      const payload = JSON.parse(readFileSync(file, "utf-8"));
      const served = payload.files.map((f: { path: string }) => f.path);
      if (JSON.stringify(served) !== JSON.stringify(item.files)) {
        problems.push(`${item.type}/${item.name}: files differ from the index`);
      }
      // Content must actually be there — an empty string would install a blank file.
      if (payload.files.some((f: { content: string }) => !f.content)) {
        problems.push(`${item.type}/${item.name}: empty file content`);
      }
    }

    expect(problems).toEqual([]);
  });

  it.skipIf(!hosted)("matches the library source byte for byte", () => {
    const differing: string[] = [];
    for (const item of registry.items) {
      const payload = JSON.parse(
        readFileSync(path.join(dir, item.type, `${item.name}.json`), "utf-8"),
      );
      for (const f of payload.files as { path: string; content: string }[]) {
        const onDisk = readFileSync(path.resolve(process.cwd(), "lib", f.path), "utf-8");
        if (onDisk !== f.content) differing.push(f.path);
      }
    }
    expect(differing).toEqual([]);
  });
});
