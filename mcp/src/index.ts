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
import { DocsLoader } from "./docs-loader.js";
import { ComponentRegistry } from "./component-registry.js";
import { extractSection, extractCodeExamples } from "./markdown-utils.js";

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

  // 2. Build component registry
  const registry = new ComponentRegistry();
  registry.buildFromDocs(loader.getAllComponents());

  // 3. Create MCP server
  const server = new McpServer({
    name: "torch-glare-docs",
    version: "1.0.0",
  });

  // ─── TOOLS ───────────────────────────────────────────────────────────

  // Tool 1: List components
  server.tool(
    "list-components",
    "List all TORCH Glare components, optionally filtered by category. Categories: buttons, forms, layout, dataDisplay, overlays, dateTime, feedback, labels, advanced",
    { category: z.string().optional().describe("Filter by category (e.g., 'buttons', 'forms', 'overlays')") },
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
    "Search TORCH Glare components by name, description, or tags",
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
