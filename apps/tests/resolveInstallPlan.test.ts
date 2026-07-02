import { readFileSync } from "fs";
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
    const plan = resolveInstallPlan(registry, "components", "Select");
    // Select -> Button, Tooltip, cn, types (Button/Tooltip pull cn+types too).
    expect(refsOf(plan)).toEqual(
      expect.arrayContaining([
        "components/Select",
        "components/Button",
        "components/Tooltip",
        "utils/cn",
        "utils/types",
      ]),
    );
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
});
