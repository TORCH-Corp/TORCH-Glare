"use client"

import { useState } from "react"
import { TreeFolder, type TreeFolderNode } from "@/components/TreeFolder"

const initial: TreeFolderNode[] = [
  {
    id: "header",
    name: "Header",
    type: "frame",
    children: [
      { id: "logo", name: "Logo", type: "image" },
      {
        id: "nav",
        name: "Nav",
        type: "group",
        children: [
          { id: "nav-home", name: "Home", type: "text" },
          { id: "nav-pricing", name: "Pricing", type: "text" },
          { id: "nav-docs", name: "Docs", type: "text" },
          { id: "nav-login", name: "Login", type: "component" },
        ],
      },
    ],
  },
  {
    id: "frame-3991",
    name: "Frame 3991",
    type: "frame",
    children: [
      {
        id: "frame-3976",
        name: "Frame 3976",
        type: "frame",
        children: [
          { id: "nav-inner", name: "Nav", type: "frame", children: [
            { id: "frame-3994", name: "Frame 3994", type: "frame" },
            { id: "tab-holder", name: "TabHolder-Container", type: "container" },
          ] },
          { id: "body", name: "Body", type: "container" },
        ],
      },
      { id: "frame-3989", name: "Frame 3989", type: "frame" },
    ],
  },
  {
    id: "screenshots",
    name: "Screenshots",
    type: "folder",
    children: [
      { id: "ss-1", name: "Screenshot 2025-11-13 at 6.10.19 PM", type: "image", meta: "1,512 × 982" },
      { id: "ss-2", name: "Screenshot 2025-11-13 at 6.10.34 PM", type: "image", meta: "1,512 × 982" },
      { id: "ss-3", name: "Screenshot 2025-11-13 at 6.10.52 PM", type: "image", meta: "1,512 × 982" },
      { id: "ss-4", name: "Screenshot 2025-11-13 at 6.11.34 PM", type: "image", meta: "1,512 × 982" },
      { id: "ss-5", name: "Screenshot 2025-11-13 at 6.12.17 PM", type: "image", meta: "1,512 × 982" },
    ],
  },
  { id: "list", name: "List", type: "section" },
  { id: "mail-accounts", name: "mail.accounts", type: "link" },
  { id: "bank-1", name: "Bank intergration", type: "image", meta: "1,920 × 1,080" },
  { id: "bank-2", name: "Bank intergration", type: "image", meta: "1,920 × 1,080" },
  { id: "inv-1", name: "Sales Invoice", type: "file" },
  { id: "inv-2", name: "Sales Invoice", type: "file" },
  { id: "inv-3", name: "Sales Invoice", type: "file" },
  { id: "inv-4", name: "Sales Invoice", type: "file" },
  { id: "inv-5", name: "Sales Invoice", type: "file" },
  { id: "inv-6", name: "Sales Invoice", type: "file" },
  { id: "inv-7", name: "Sales Invoice", type: "file" },
  { id: "inv-8", name: "Sales Invoice", type: "file" },
  { id: "po-1", name: "Purchase Order", type: "file" },
  { id: "po-2", name: "Purchase Order", type: "file" },
  { id: "po-3", name: "Purchase Order", type: "file" },
  { id: "po-4", name: "Purchase Order", type: "file" },
  { id: "po-5", name: "Purchase Order", type: "file" },
  { id: "rcpt-1", name: "Receipt", type: "file" },
  { id: "rcpt-2", name: "Receipt", type: "file" },
  { id: "rcpt-3", name: "Receipt", type: "file" },
  { id: "rcpt-4", name: "Receipt", type: "file" },
  { id: "rcpt-5", name: "Receipt", type: "file" },
  { id: "stmt-1", name: "Statement", type: "file" },
  { id: "stmt-2", name: "Statement", type: "file" },
  { id: "stmt-3", name: "Statement", type: "file" },
  {
    id: "deeply-nested",
    name: "Deeply Nested Examples (very-long-name-to-force-horizontal-scrolling)",
    type: "folder",
    children: [
      {
        id: "dn-a",
        name: "Marketing Campaigns / Q4 2025 Holiday Promotions",
        type: "section",
        children: [
          {
            id: "dn-a-1",
            name: "Black Friday Hero Banner Variant 03 (final approved by stakeholder)",
            type: "frame",
            children: [
              {
                id: "dn-a-1-1",
                name: "Background / Gradient Mesh / Layer 02 / Mask 01",
                type: "vector",
                children: [
                  {
                    id: "dn-a-1-1-1",
                    name: "Inner Glow Shape — radial blur 24px / opacity 0.65",
                    type: "vector",
                    children: [
                      {
                        id: "dn-a-1-1-1-1",
                        name: "Path 4096 (svg compound exported from Illustrator workflow)",
                        type: "vector",
                      },
                      {
                        id: "dn-a-1-1-1-2",
                        name: "Path 4097 / clip-rule:evenodd / fill-rule:nonzero",
                        type: "vector",
                      },
                    ],
                  },
                ],
              },
              {
                id: "dn-a-1-2",
                name: "Headline Typography — Inter Display 96/108 Tight",
                type: "text",
              },
              {
                id: "dn-a-1-3",
                name: "CTA Button (Primary) — hover state with focus ring spec attached",
                type: "component",
              },
            ],
          },
        ],
      },
      {
        id: "dn-b",
        name: "Newsletter Templates — September edition with multiple breakpoints",
        type: "section",
        children: [
          { id: "dn-b-1", name: "header-with-very-very-long-component-name-for-overflow-test", type: "component" },
          { id: "dn-b-2", name: "body / hero / featured-article-card / image-block / fallback", type: "container" },
          { id: "dn-b-3", name: "footer / social-icons-row / unsubscribe-link / preference-center", type: "container" },
        ],
      },
    ],
  },
]

export default function TreeFolderDemo() {
  const [data, setData] = useState<TreeFolderNode[]>(initial)
  const [selected, setSelected] = useState<string | null>("nav-inner")

  return (
    <div className="flex h-screen bg-background-presentation-body-primary text-content-presentation-global-primary">
      <aside className="w-[320px] shrink-0 border-r border-border-presentation-global-primary flex flex-col min-h-0 overflow-hidden">
        <TreeFolder
          title="Layers"
          data={data}
          selectedId={selected}
          onSelectionChange={setSelected}
          onDataChange={setData}
          defaultExpanded="all"
        />
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-xl font-semibold mb-2">TreeFolder demo</h1>
        <p className="text-sm text-content-presentation-global-secondary max-w-prose">
          A standalone, reusable tree component modeled after Figma&apos;s layers panel.
          Native HTML5 drag-and-drop — drag rows to reparent or reorder. The breadcrumb
          at the top of the panel shows the selected node&apos;s path; ancestor rows are
          subtly highlighted so you can see “what&apos;s inside what.”
        </p>
        <div className="mt-6 text-xs text-content-presentation-global-tertiary">
          Selected: <span className="text-content-presentation-global-primary">{selected ?? "none"}</span>
        </div>
      </main>
    </div>
  )
}

