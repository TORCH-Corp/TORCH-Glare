import { execFileSync } from "child_process";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

/**
 * Tag the current commit as `v<version>` and push the tag.
 *
 * This is what makes hosted-registry version pins real. `/r/v2.5.6/components/Button.json`
 * resolves to raw.githubusercontent.com at the tag `v2.5.6`, so without a tag there is no pin —
 * and the repo had zero tags and zero releases when the hosted registry was introduced.
 *
 * The clean-tree check is the point of this being a script rather than a one-liner. `pnpm run
 * deploy` regenerates registry/ before publishing; if those regenerated files are still
 * uncommitted, the tag would point at a commit whose registry/ predates the release, and every
 * pinned install would silently serve stale component source. Refuse instead.
 *
 *   node scripts/bin/tagRelease/index.js
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../../..");

const git = (...args) =>
    execFileSync("git", args, { cwd: ROOT, encoding: "utf-8" }).trim();

function main() {
    const { version } = JSON.parse(
        fs.readFileSync(path.join(ROOT, "package.json"), "utf-8")
    );
    const tag = `v${version}`;

    const dirty = git("status", "--porcelain");
    if (dirty) {
        console.error(
            `❌ Working tree is not clean, refusing to tag ${tag}.\n` +
                `   A tag must point at a commit that already contains the generated registry/,\n` +
                `   or pinned installs will serve stale source. Commit these first:\n\n` +
                dirty
                    .split("\n")
                    .map((l) => `     ${l}`)
                    .join("\n")
        );
        process.exit(1);
    }

    const existing = git("tag", "--list", tag);
    if (existing) {
        const at = git("rev-list", "-n", "1", tag);
        const head = git("rev-parse", "HEAD");
        if (at === head) {
            console.log(`ℹ️  ${tag} already exists and points at HEAD — nothing to do.`);
        } else {
            console.error(
                `❌ ${tag} already exists but points at ${at.slice(0, 8)}, not HEAD ` +
                    `(${head.slice(0, 8)}).\n` +
                    `   Published versions are immutable; bump the version instead of moving the tag.`
            );
            process.exit(1);
        }
    } else {
        git("tag", "-a", tag, "-m", tag);
        console.log(`✅ Created tag ${tag}.`);
    }

    git("push", "origin", tag);
    console.log(`✅ Pushed ${tag} — /r/${tag}/<type>/<name>.json is now pinnable.`);
}

main();
