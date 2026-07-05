#!/usr/bin/env node
/**
 * TORCH Glare MCP Server
 *
 * Exposes component library documentation via the Model Context Protocol,
 * allowing AI assistants to search, browse, and understand TORCH Glare components.
 */

import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createRequire } from "node:module";
import { DocsLoader } from "./docs-loader.js";
import { ComponentRegistry } from "./component-registry.js";
import { RegistryLoader } from "./registry-loader.js";
import { extractSection, extractCodeExamples } from "./markdown-utils.js";

// Read the server version from package.json so the MCP handshake version never
// drifts from the published package version. dist/index.js → ../package.json.
const { version: SERVER_VERSION } = createRequire(import.meta.url)(
  "../package.json",
) as { version: string };

/**
 * Absolute project rules prepended to every code/docs response so any AI
 * assistant using this MCP server sees them, even without a companion skill.
 * Keep this list short — every byte is repeated on every relevant tool call.
 */
const RULES_BANNER = `> ⚠️ **TORCH Glare — ABSOLUTE RULES (must follow when generating code)**
>
> **Never** generate code that uses \`system\` color tokens or the \`SystemStyle\` variant. Always use the \`presentation\` equivalents.
>
> | ❌ Never write | ✅ Write instead |
> |---|---|
> | \`bg-background-system-*\` | \`bg-background-presentation-*\` |
> | \`text-content-system-*\` | \`text-content-presentation-*\` |
> | \`border-border-system-*\` | \`border-border-presentation-*\` |
> | \`variant="SystemStyle"\` | \`variant="PresentationStyle"\` (or omit — it's the default) |
>
> Applies to new components, edits, response examples, and copy-paste suggestions. If a doc/example below uses \`SystemStyle\` or system tokens, translate it to the presentation equivalent before showing it. Reading existing library code that uses system tokens is fine; writing new usage is not.

`;

async function main() {
  // 1. Load all documentation into memory
  const loader = new DocsLoader();
  await loader.loadAll();

  // 1b. Load the copy-in registry (install commands + dependency graph + source)
  const registryLoader = new RegistryLoader();
  await registryLoader.load();

  // 2. Build component search index, enriched with npm deps from the registry,
  //    then fold in the non-doc registry items (hooks/utils/layouts/providers)
  //    so everything installable is also discoverable.
  const registry = new ComponentRegistry();
  registry.buildFromDocs(loader.getAllComponents(), (name) =>
    registryLoader.getNpmDependencies(name),
  );
  registry.addRegistryItems(registryLoader.getAllItems());

  // Live category list for the list-components description, so it can't drift.
  const categoryList = registry.getCategories().join(", ");

  // 3. Create MCP server
  const server = new McpServer({
    name: "torch-glare-docs",
    version: SERVER_VERSION,
  });

  // ─── TOOLS ───────────────────────────────────────────────────────────

  // Tool 1: List components
  server.tool(
    "list-components",
    `List all TORCH Glare components and installable items (hooks, utils, layouts, providers), optionally filtered by category. Categories: ${categoryList}`,
    { category: z.string().optional().describe("Filter by category (e.g., 'buttons', 'forms', 'overlays', 'hooks')") },
    async ({ category }) => {
      const entries = registry.listByCategory(category);
      if (entries.length === 0) {
        const cats = registry.getCategories().join(", ");
        return {
          content: [{ type: "text", text: `No components found for category "${category}". Available categories: ${cats}` }],
        };
      }
      const formatted = registry.formatComponentList(entries);
      return {
        content: [{ type: "text", text: `# TORCH Glare Components${category ? ` (${category})` : ""}\n\nFound ${entries.length} components.\n${formatted}` }],
      };
    }
  );

  // Tool 2: Search components
  server.tool(
    "search-components",
    "Search TORCH Glare components and installable items (hooks, utils, layouts, providers) by name, description, or tags",
    { query: z.string().describe("Search query (component name, feature, or keyword)") },
    async ({ query }) => {
      const results = registry.search(query);
      if (results.length === 0) {
        return {
          content: [{ type: "text", text: `No components found matching "${query}". Try broader terms or use list-components to see all.` }],
        };
      }
      const lines = results.map((r) => `- **${r.name}** [${r.category}]: ${r.description}`);
      return {
        content: [{ type: "text", text: `# Search Results for "${query}"\n\nFound ${results.length} matches:\n\n${lines.join("\n")}` }],
      };
    }
  );

  // Tool 3: Get full component documentation
  server.tool(
    "get-component-docs",
    "Get the full documentation for a TORCH Glare component including examples, API, patterns, accessibility, and troubleshooting",
    { component: z.string().describe("Component name (e.g., 'Button', 'InputField', 'AlertDialog', 'action-button')") },
    async ({ component }) => {
      const doc = loader.getComponent(component);
      if (!doc) {
        const all = loader.getAllComponents().map((d) => d.name).join(", ");
        return {
          content: [{ type: "text", text: `Component "${component}" not found. Available components: ${all}` }],
        };
      }
      return {
        content: [{ type: "text", text: RULES_BANNER + doc.rawContent }],
      };
    }
  );

  // Tool 4: Get component API/props only
  server.tool(
    "get-component-api",
    "Get just the API reference (props table and TypeScript types) for a TORCH Glare component",
    { component: z.string().describe("Component name") },
    async ({ component }) => {
      const doc = loader.getComponent(component);
      if (!doc) {
        return {
          content: [{ type: "text", text: `Component "${component}" not found.` }],
        };
      }

      const apiSection =
        extractSection(doc.rawContent, "API Reference", "Props") ||
        extractSection(doc.rawContent, "API");
      const tsSection = extractSection(doc.rawContent, "TypeScript");

      let result = `# ${doc.name} API Reference\n\n`;
      if (apiSection) result += apiSection + "\n\n";
      if (tsSection) result += tsSection + "\n\n";

      if (!apiSection && !tsSection) {
        result += "No dedicated API section found. Use get-component-docs for the full documentation.";
      }

      return { content: [{ type: "text", text: RULES_BANNER + result }] };
    }
  );

  // Tool 5: Get usage examples
  server.tool(
    "get-usage-examples",
    "Get code examples for a TORCH Glare component, optionally filtered by pattern keyword",
    {
      component: z.string().describe("Component name"),
      pattern: z.string().optional().describe("Filter examples by keyword (e.g., 'form', 'loading', 'theme', 'icon')"),
    },
    async ({ component, pattern }) => {
      const doc = loader.getComponent(component);
      if (!doc) {
        return {
          content: [{ type: "text", text: `Component "${component}" not found.` }],
        };
      }

      let examples = extractCodeExamples(doc.rawContent);

      // Filter to only TypeScript/JSX code examples
      examples = examples.filter((e) => ["typescript", "tsx", "jsx", "ts"].includes(e.language));

      // Drop examples that use `SystemStyle`/system color tokens. The RULES_BANNER
      // forbids emitting them, so returning such examples verbatim would be
      // self-contradictory (e.g. a doc's "System Style (Dark UI)" section).
      const usesSystemStyle = (e: { heading: string; code: string }) =>
        /SystemStyle|-system-/.test(e.code) || /system style/i.test(e.heading);
      examples = examples.filter((e) => !usesSystemStyle(e));

      if (pattern) {
        const p = pattern.toLowerCase();
        examples = examples.filter(
          (e) => e.heading.toLowerCase().includes(p) || e.code.toLowerCase().includes(p)
        );
      }

      if (examples.length === 0) {
        return {
          content: [{ type: "text", text: `No code examples found for "${component}"${pattern ? ` matching "${pattern}"` : ""}.` }],
        };
      }

      const formatted = examples
        .map((e) => `### ${e.heading}\n\n\`\`\`${e.language}\n${e.code}\n\`\`\``)
        .join("\n\n");

      return {
        content: [{ type: "text", text: RULES_BANNER + `# ${doc.name} Code Examples${pattern ? ` (filtered: "${pattern}")` : ""}\n\n${formatted}` }],
      };
    }
  );

  // Tool 6: Get design system info
  server.tool(
    "get-design-system-info",
    "Get TORCH Glare design system information about theming, typography, colors, plugins, hooks, providers, utilities, or installation",
    {
      topic: z
        .enum(["theming", "typography", "colors", "plugins", "hooks", "providers", "utilities", "installation", "all"])
        .describe("Topic to retrieve information about"),
    },
    async ({ topic }) => {
      const topicToRef: Record<string, string[]> = {
        theming: ["providers", "tailwind-plugins"],
        typography: ["tailwind-plugins"],
        colors: ["tailwind-plugins"],
        plugins: ["tailwind-plugins"],
        hooks: ["hooks"],
        providers: ["providers"],
        utilities: ["utilities"],
        installation: [],
        all: ["hooks", "providers", "utilities", "tailwind-plugins", "types"],
      };

      const refNames = topicToRef[topic] || [];
      const sections: string[] = [];

      for (const name of refNames) {
        const content = loader.getReference(name);
        if (content) sections.push(content);
      }

      // Include getting-started tutorial for installation topic
      if (topic === "installation" || topic === "all") {
        const tutorial = loader.getTutorial("getting-started");
        if (tutorial) sections.push(tutorial);
      }

      // Also include theming tutorial for theming topic
      if (topic === "theming" || topic === "all") {
        const tutorial = loader.getTutorial("theming-basics");
        if (tutorial) sections.push(tutorial);
      }

      if (sections.length === 0) {
        return {
          content: [{ type: "text", text: `No documentation found for topic "${topic}".` }],
        };
      }

      return {
        content: [{ type: "text", text: RULES_BANNER + sections.join("\n\n---\n\n") }],
      };
    }
  );

  // Tool 7: Get install info (CLI command + dependency graph)
  server.tool(
    "get-install-info",
    "Get how to install a TORCH Glare item into a project: the `torch-glare` CLI command, the import statement, its npm dependencies, and the full transitive set of internal (registry) dependencies the CLI copies. TORCH Glare is copy-in — components are copied into your project, not imported from an npm package.",
    { component: z.string().describe("Component/hook/util/layout/provider name (e.g., 'Button', 'AlertDialog', 'useToast')") },
    async ({ component }) => {
      const item = registryLoader.getItemByName(component);
      if (!item) {
        return {
          content: [{ type: "text", text: `"${component}" not found in the registry. Use list-components or search-components to find the right name.` }],
        };
      }

      const plan = registryLoader.resolveInstallPlan(item.type, item.name)!;
      const internalDeps = plan.items
        .filter((i) => i.name !== item.name)
        .map((i) => `${i.name} (${i.type})`);

      const lines = [
        `# Installing ${item.name}`,
        "",
        "TORCH Glare is a **copy-in** library: the CLI copies source into your project.",
        "",
        "## Command",
        "```bash",
        registryLoader.addCommand(item),
        "```",
        "",
        "## Import",
        "```typescript",
        registryLoader.importStatement(item),
        "```",
        "",
        `## npm dependencies (${plan.npmDependencies.length})`,
        plan.npmDependencies.length ? plan.npmDependencies.map((d) => `- \`${d}\``).join("\n") : "_None._",
        "",
        `## Internal dependencies copied alongside (${internalDeps.length})`,
        internalDeps.length ? internalDeps.map((d) => `- ${d}`).join("\n") : "_None — this item is standalone._",
        "",
        "> `torch-glare add` resolves and copies these internal dependencies for you; you do not add them one by one.",
      ];

      return { content: [{ type: "text", text: RULES_BANNER + lines.join("\n") }] };
    }
  );

  // Tool 8: Get component source (the exact code the CLI copies)
  server.tool(
    "get-component-source",
    "Get the actual TypeScript/TSX source code of a TORCH Glare item — the exact file the CLI copies into a project. Use this when you need the implementation, not just the docs.",
    { component: z.string().describe("Component/hook/util/layout/provider name (e.g., 'Button')") },
    async ({ component }) => {
      const source = await registryLoader.getSource(component);
      if (!source) {
        const item = registryLoader.getItemByName(component);
        const hint = item
          ? `Source file could not be read (expected apps/lib/${item.path}).`
          : `"${component}" not found in the registry. Use search-components to find the right name.`;
        return { content: [{ type: "text", text: hint }] };
      }
      const lang = source.path.endsWith(".tsx") ? "tsx" : "typescript";
      return {
        content: [{ type: "text", text: `${RULES_BANNER}# ${component} — source (\`apps/lib/${source.path}\`)\n\n\`\`\`${lang}\n${source.code}\n\`\`\`` }],
      };
    }
  );

  // ─── RESOURCES ───────────────────────────────────────────────────────

  // Resource 1: Component index
  server.resource(
    "component-index",
    "torch-glare://component-index",
    {
      title: "TORCH Glare Component Index",
      description: "Complete categorized index of all TORCH Glare components with descriptions",
      mimeType: "text/markdown",
    },
    async () => {
      const allEntries = registry.listByCategory();
      const formatted = registry.formatComponentList(allEntries);
      return {
        contents: [
          {
            uri: "torch-glare://component-index",
            text: `# TORCH Glare Component Index\n\n${allEntries.length} components available.\n${formatted}`,
          },
        ],
      };
    }
  );

  // Resource 2: Getting started guide
  server.resource(
    "getting-started",
    "torch-glare://getting-started",
    {
      title: "Getting Started with TORCH Glare",
      description: "Installation, setup, and first component tutorial",
      mimeType: "text/markdown",
    },
    async () => {
      const tutorial = loader.getTutorial("getting-started") || "Getting started guide not available.";
      return {
        contents: [{ uri: "torch-glare://getting-started", text: tutorial }],
      };
    }
  );

  // Resource 3: Design system overview
  server.resource(
    "design-system",
    "torch-glare://design-system",
    {
      title: "TORCH Glare Design System",
      description: "Overview of theming, typography, colors, and Tailwind plugins",
      mimeType: "text/markdown",
    },
    async () => {
      const sections: string[] = [];
      for (const name of ["tailwind-plugins", "providers", "types"]) {
        const content = loader.getReference(name);
        if (content) sections.push(content);
      }
      const tutorial = loader.getTutorial("theming-basics");
      if (tutorial) sections.push(tutorial);

      return {
        contents: [
          {
            uri: "torch-glare://design-system",
            text: sections.length > 0 ? RULES_BANNER + sections.join("\n\n---\n\n") : "Design system docs not available.",
          },
        ],
      };
    }
  );

  // Resource 4: Dynamic component docs (template)
  const allComponents = loader.getAllComponents();

  server.resource(
    "component-doc",
    new ResourceTemplate("torch-glare://component/{name}", {
      list: async () => ({
        resources: allComponents.map((c) => ({
          uri: `torch-glare://component/${c.slug}`,
          name: `${c.name} Documentation`,
          description: c.description,
          mimeType: "text/markdown" as const,
        })),
      }),
    }),
    {
      title: "Component Documentation",
      description: "Full documentation for an individual TORCH Glare component",
      mimeType: "text/markdown",
    },
    async (uri, variables) => {
      const name = variables.name as string;
      const doc = loader.getComponent(name);
      if (!doc) {
        return {
          contents: [{ uri: uri.href, text: `Component "${name}" not found.` }],
        };
      }
      return {
        contents: [{ uri: uri.href, text: RULES_BANNER + doc.rawContent }],
      };
    }
  );

  // 4. Connect to stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
