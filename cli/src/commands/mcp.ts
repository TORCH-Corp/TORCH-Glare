import fs from "fs";
import path from "path";
import os from "os";
import inquirer from "inquirer";

const MCP_CONFIG = {
  "torch-glare-docs": {
    command: "npx",
    args: ["-y", "torch-glare-mcp"],
  },
};

interface McpJson {
  mcpServers?: Record<string, unknown>;
  [key: string]: unknown;
}

const clients = [
  {
    name: "Claude Code",
    value: "claude-code",
    configPath: () => path.join(process.cwd(), ".mcp.json"),
    description: "Adds to .mcp.json in your project root",
  },
  {
    name: "Claude Desktop",
    value: "claude-desktop",
    configPath: () => {
      const platform = os.platform();
      if (platform === "darwin") {
        return path.join(
          os.homedir(),
          "Library",
          "Application Support",
          "Claude",
          "claude_desktop_config.json"
        );
      } else if (platform === "win32") {
        return path.join(
          os.homedir(),
          "AppData",
          "Roaming",
          "Claude",
          "claude_desktop_config.json"
        );
      }
      return path.join(os.homedir(), ".config", "claude", "claude_desktop_config.json");
    },
    description: "Adds to Claude Desktop config",
  },
  {
    name: "Cursor",
    value: "cursor",
    configPath: () => path.join(process.cwd(), ".cursor", "mcp.json"),
    description: "Adds to .cursor/mcp.json in your project",
  },
];

export async function setupMcp(): Promise<void> {
  console.log("\n🔧 TORCH Glare MCP Server Setup\n");

  const { selectedClients } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "selectedClients",
      message: "Which AI clients do you use?",
      choices: clients.map((c) => ({
        name: `${c.name} — ${c.description}`,
        value: c.value,
      })),
      validate: (answer: string[]) => {
        if (answer.length === 0) return "Select at least one client.";
        return true;
      },
    },
  ]);

  for (const clientValue of selectedClients) {
    const client = clients.find((c) => c.value === clientValue)!;
    const configPath = client.configPath();

    try {
      // Ensure parent directory exists
      const dir = path.dirname(configPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Read existing config or create empty
      let config: McpJson = {};
      if (fs.existsSync(configPath)) {
        const raw = fs.readFileSync(configPath, "utf-8");
        config = JSON.parse(raw);
      }

      // Add MCP server entry
      if (!config.mcpServers) {
        config.mcpServers = {};
      }

      if (config.mcpServers["torch-glare-docs"]) {
        console.log(`⚠️  ${client.name}: torch-glare-docs already configured, skipping.`);
        continue;
      }

      config.mcpServers["torch-glare-docs"] = MCP_CONFIG["torch-glare-docs"];

      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      console.log(`✅ ${client.name}: Added torch-glare-docs to ${configPath}`);
    } catch (err) {
      console.error(`❌ ${client.name}: Failed to write config — ${(err as Error).message}`);
    }
  }

  console.log("\n🎉 Done! Restart your AI client to activate the MCP server.\n");
}
