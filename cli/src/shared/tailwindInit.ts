import { execSync } from "child_process";
import { detectPackageManager } from "./detectPackageManager.js";
import { detectTailwindVersion } from "./detectFramework.js";

/**
 * Install Tailwind CSS plugin dependencies.
 * Detects Tailwind version to install correct mapping-color-system variant.
 */
export function tailwindInit(): void {
  const twVersion = detectTailwindVersion();
  const isV3 = twVersion === 3;

  const dependencies = [
    "tailwindcss-animate",
    "tailwind-scrollbar-hide",
    "glare-typography",
    isV3 ? "mapping-color-system" : "mapping-color-system-v4",
    "glare-torch-mode",
  ];
  installTailwindDependencies(dependencies);
}

/**
 * Installs dependencies using the detected package manager.
 */
function installTailwindDependencies(dependencies: string[] = []) {
  if (!dependencies.length) {
    console.warn("  ⚠️ No dependencies provided to install.");
    return;
  }

  const packageManager = detectPackageManager();
  console.log(`  📦 Detected package manager: ${packageManager}`);

  let installCommand;
  const latestDeps = dependencies.map(dep => `${dep}@latest`).join(" ");

  switch (packageManager) {
    case "pnpm":
      installCommand = `pnpm add ${latestDeps} --prefer-offline`;
      break;
    case "yarn":
      installCommand = `yarn add ${latestDeps} --ignore-engines --ignore-platform --prefer-offline`;
      break;
    case "bun":
      installCommand = `bun add ${latestDeps} --no-save && bun install`;
      break;
    default:
      installCommand = `npm install ${latestDeps} --legacy-peer-deps`;
  }

  try {
    console.log(`  Running: ${installCommand}`);
    execSync(installCommand, { stdio: "inherit" });
    console.log("  ✅ Tailwind plugins installed successfully.");
  } catch (error: any) {
    console.error("  ❌ Error installing Tailwind plugins:");
    console.error(error.message);

    if (error.message.includes("EACCES")) {
      console.error(
        "  💡 Permission error. Try running with sudo or fix your npm permissions."
      );
    } else if (error.message.includes("not found")) {
      console.error(
        "  💡 Package manager not found. Ensure it is installed and in your PATH."
      );
    } else if (error.message.includes("ERESOLVE") || error.message.includes("peer dependency conflict")) {
      console.error(
        "  💡 Dependency conflicts. Try 'npm install --force' or '--legacy-peer-deps'."
      );
    } else {
      console.error("  💡 Check your internet connection and try again.");
    }
  }
}
