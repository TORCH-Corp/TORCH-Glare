import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

/**
 * Refuse to publish while the CLI's registry URL points anywhere but the default branch.
 *
 * The URL gets pointed at a feature branch to test the registry before it reaches `main`. That is
 * a useful thing to do and an easy thing to forget: a release carrying a branch URL installs every
 * component from that branch, and breaks for everyone the day the branch is deleted — long after
 * anyone would connect the two.
 *
 * Runs as part of `pnpm run deploy`, immediately before `npm publish`.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../../..");
const SOURCE = path.join(ROOT, "cli", "src", "shared", "registryClient.ts");

const EXPECTED_REF = "main";

function main() {
    const source = fs.readFileSync(SOURCE, "utf-8");

    // `https://raw.githubusercontent.com/<org>/<repo>/<ref>/registry`, where <ref> may contain
    // slashes — which is exactly why a branch URL is hard to spot by eye.
    const match = /raw\.githubusercontent\.com\/[^/]+\/[^/]+\/(.+?)\/registry/s.exec(source);

    if (!match) {
        console.error(
            `❌ Could not find the registry URL in ${path.relative(ROOT, SOURCE)}.\n` +
                `   This guard exists to stop a feature-branch URL from shipping; if the constant ` +
                `moved, update the guard rather than removing it.`
        );
        process.exit(1);
    }

    const ref = match[1].replace(/\s|"|\n|\+/g, "");

    if (ref !== EXPECTED_REF) {
        console.error(
            `❌ The registry URL points at "${ref}", not "${EXPECTED_REF}".\n\n` +
                `   Publishing now would ship a CLI that installs every component from that ref.\n` +
                `   When it is deleted, every install breaks.\n\n` +
                `   Fix: set REGISTRY_URL back to "${EXPECTED_REF}" in ` +
                `${path.relative(ROOT, SOURCE)}, re-run the tests, and publish again.`
        );
        process.exit(1);
    }

    console.log(`✅ Registry URL is on "${EXPECTED_REF}".`);
}

main();
