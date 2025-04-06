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
        default:
            return `npm install ${deps}`;
    }
}

