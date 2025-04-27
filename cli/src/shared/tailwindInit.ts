import { execSync } from "child_process";
import { detectPackageManager } from "./detectPackageManager.js";

export function tailwindInit(): void {
  const dependencies = [
    "tailwindcss-animate",
    "tailwind-scrollbar-hide",
    "glare-typography",
    "mapping-color-system",
    "glare-torch-mode",
  ];
  installDependencies(dependencies);
}


/**
 * Installs dependencies using the detected package manager.
 * @param {string[]} dependencies - List of dependencies to install.
 */
function installDependencies(dependencies: string[] = []) {
  if (!dependencies.length) {
    console.warn("⚠️ No dependencies provided to install.");
    return;
  }

  // Detect the package manager
  const packageManager = detectPackageManager();
  console.log(`📦 Detected package manager: ${packageManager}`);

  // Generate the install command based on the package manager
  let installCommand;
  const latestDeps = dependencies.map(dep => `${dep}`).join(" ");

  switch (packageManager) {
    case "pnpm":
      installCommand = `pnpm add ${latestDeps}`;
      break;
    case "yarn":
      installCommand = `yarn add ${latestDeps}`;
      break;
    case "bun":
      installCommand = `bun add ${latestDeps}`;
      break;
    default:
      installCommand = `npm install ${latestDeps}`;
  }

  try {
    // Execute the install command
    execSync(installCommand, { stdio: "inherit" });
    console.log("✅ Dependencies installed successfully.");
  } catch (error: any) {
    console.error("❌ Error installing dependencies:");
    console.error(error.message);

    // Provide additional troubleshooting tips
    if (error.message.includes("EACCES")) {
      console.error(
        "💡 It seems you don't have permission to install packages globally. Try running the command with sudo or fix your npm permissions."
      );
    } else if (error.message.includes("not found")) {
      console.error(
        "💡 The package manager might not be installed. Please ensure it is installed and available in your PATH."
      );
    } else {
      console.error("💡 Check your internet connection and try again.");
    }
  }
}


