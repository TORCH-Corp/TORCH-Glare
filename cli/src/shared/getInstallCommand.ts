/**
 * Generate the installation command based on the package manager.
 * @param {string} packageManager - The package manager (pnpm, yarn, or npm).
 * @param {Set<string>} dependencies - Set of dependencies to install.
 * @returns {string} - The installation command.
 */
export function getInstallCommand(packageManager: string, dependencies: Set<string>): string {
    const deps = [...dependencies].join(" ");
    switch (packageManager) {
        case "pnpm":
            return `pnpm add ${deps}`;
        case "yarn":
            return `yarn add ${deps}`;
        // `detectPackageManager` recognises bun.lockb but there was no case for it here, so a Bun
        // project silently had its dependencies installed by npm — which writes a package-lock.json
        // beside the bun.lockb and leaves the project with two lockfiles disagreeing.
        case "bun":
            return `bun add ${deps}`;
        default:
            return `npm install ${deps}`;
    }
}

