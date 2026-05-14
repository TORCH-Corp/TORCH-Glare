"use client"

import { useState } from "react"
import { DataViewsLayout, type FieldConfig, type ViewVisibility } from "@/components/DataViews"

const orders = [
  { id: 1, customer: "Acme Inc.",     status: "Pending",  priority: "High",   total: 1240, createdAt: "2025-09-10" },
  { id: 2, customer: "Globex Corp.",  status: "Shipped",  priority: "Medium", total: 480,  createdAt: "2025-09-12" },
  { id: 3, customer: "Initech",       status: "Delivered",priority: "Low",    total: 99,   createdAt: "2025-09-15" },
  { id: 4, customer: "Umbrella",      status: "Pending",  priority: "High",   total: 2890, createdAt: "2025-09-18" },
  { id: 5, customer: "Hooli",         status: "Shipped",  priority: "Medium", total: 740,  createdAt: "2025-09-20" },
  { id: 6, customer: "Stark Industries", status: "Pending", priority: "High", total: 12400, createdAt: "2025-09-22" },
  { id: 7, customer: "Wayne Enterprises", status: "Delivered", priority: "Medium", total: 5300, createdAt: "2025-09-25" },
  { id: 8, customer: "Cyberdyne",     status: "Shipped",  priority: "Low",    total: 220,  createdAt: "2025-09-28" },
]

type OrgNode = {
  id: string
  name: string
  role: string
  team: string
  headcount: number
  children?: OrgNode[]
}

const orgChart: OrgNode[] = [
  {
    id: "ceo",
    name: "Alex Morgan",
    role: "CEO",
    team: "Executive",
    headcount: 42,
    children: [
      {
        id: "cto",
        name: "Priya Raman",
        role: "CTO",
        team: "Engineering",
        headcount: 18,
        children: [
          {
            id: "eng-platform",
            name: "Diego Vargas",
            role: "Director, Platform",
            team: "Engineering",
            headcount: 7,
            children: [
              { id: "eng-backend", name: "Sara Kim", role: "Backend Lead", team: "Engineering", headcount: 3 },
              { id: "eng-infra", name: "Marcus Lee", role: "Infra Lead", team: "Engineering", headcount: 4 },
            ],
          },
          {
            id: "eng-product",
            name: "Hana Sato",
            role: "Director, Product Eng",
            team: "Engineering",
            headcount: 10,
            children: [
              { id: "eng-web", name: "Noah Patel", role: "Web Lead", team: "Engineering", headcount: 5 },
              { id: "eng-mobile", name: "Yusuf Aydin", role: "Mobile Lead", team: "Engineering", headcount: 4 },
            ],
          },
        ],
      },
      {
        id: "cmo",
        name: "Jordan Riley",
        role: "CMO",
        team: "Marketing",
        headcount: 9,
        children: [
          { id: "growth", name: "Lena Volkov", role: "Head of Growth", team: "Marketing", headcount: 4 },
          { id: "brand", name: "Theo Lambert", role: "Head of Brand", team: "Marketing", headcount: 4 },
        ],
      },
      {
        id: "cfo",
        name: "Maya Iyer",
        role: "CFO",
        team: "Finance",
        headcount: 6,
        children: [
          { id: "fin-ops", name: "Aki Tanaka", role: "Finance Ops", team: "Finance", headcount: 3 },
          { id: "fin-strat", name: "Ruth Cohen", role: "Strategic Finance", team: "Finance", headcount: 2 },
        ],
      },
    ],
  },
]

const orgFields: FieldConfig[] = [
  { path: "name", label: "Name", type: "text" },
  {
    path: "role",
    label: "Role",
    type: "text",
    filterable: true,
  },
  {
    path: "team",
    label: "Team",
    type: "enum-badge",
    variants: {
      Executive: "purple",
      Engineering: "blue",
      Marketing: "yellow",
      Finance: "green",
    },
    filterable: true,
  },
  { path: "headcount", label: "Headcount", type: "number", filterable: true },
]

const orderFields: FieldConfig[] = [
  { path: "id",       label: "Order #", type: "number" },
  { path: "customer", label: "Customer", type: "text" },
  {
    path: "status",
    label: "Status",
    type: "enum-badge",
    variants: { Pending: "yellow", Shipped: "blue", Delivered: "green" },
    filterable: true,
  },
  {
    path: "priority",
    label: "Priority",
    type: "enum-badge",
    variants: { High: "redOrange", Medium: "purple", Low: "gray" },
    filterable: true,
  },
  { path: "total", label: "Total", type: "currency", currency: "USD", filterable: true },
  { path: "createdAt", label: "Created", type: "date-format", dateFormat: "YYYY-MM-DD" },
]

type DemoMode = {
  label: string
  dataset: "orders" | "org"
  visibility: ViewVisibility
  showFilters: boolean
}

const VIEW_MODES: DemoMode[] = [
  { label: "Org chart (Tree + DnD)", dataset: "org",    visibility: { table: true, kanban: false, inbox: false, tree: true }, showFilters: true },
  { label: "All views",              dataset: "orders", visibility: { table: true, kanban: true,  inbox: true,  tree: true  }, showFilters: true },
  { label: "Table + Kanban only",    dataset: "orders", visibility: { table: true, kanban: true,  inbox: false, tree: false }, showFilters: true },
  { label: "Table only (no filters)",dataset: "orders", visibility: { table: true, kanban: false, inbox: false, tree: false }, showFilters: false },
  { label: "Kanban only",            dataset: "orders", visibility: { table: false,kanban: true,  inbox: false, tree: false }, showFilters: false },
]

export default function DataViewsDemo() {
  const [modeIdx, setModeIdx] = useState(0)
  const mode = VIEW_MODES[modeIdx]
  const isOrg = mode.dataset === "org"

  return (
    <div className="flex flex-col h-screen bg-background-presentation-body-primary">
      <div className="flex items-center gap-2 p-3 border-b border-border-presentation-global-primary bg-background-presentation-body-primary">
        <span className="text-sm text-content-presentation-global-secondary mr-2">Demo:</span>
        {VIEW_MODES.map((m, i) => (
          <button
            key={m.label}
            onClick={() => setModeIdx(i)}
            className={
              "text-xs px-3 py-1.5 rounded-md border transition-colors " +
              (i === modeIdx
                ? "border-content-presentation-action-primary bg-content-presentation-action-primary text-white"
                : "border-border-presentation-global-primary text-content-presentation-global-secondary hover:text-content-presentation-global-primary")
            }
          >
            {m.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-hidden">
        {isOrg ? (
          <OrgDemo key={mode.label} mode={mode} />
        ) : (
          <DataViewsLayout
            key={mode.label}
            title="Orders"
            description="Pick a demo mode above to toggle views / filters"
            data={orders}
            fields={orderFields}
            views={mode.visibility}
            kanbanGroupBy="status"
            showFilters={mode.showFilters}
          />
        )}
      </div>
    </div>
  )
}

function OrgDemo({ mode }: { mode: DemoMode }) {
  return (
    <DataViewsLayout
      title="Org chart"
      description="Drag rows to reparent or reorder. Use the variant switcher in the toolbar to preview Ghost / Rail / Lift."
      data={orgChart}
      fields={orgFields}
      views={mode.visibility}
      treeConfig={{
        idField: "id",
        childrenField: "children",
        nodeLabel: "name",
        defaultExpanded: "all",
        dndEnabled: true,
        defaultRightPane: "details",
      }}
      showFilters={mode.showFilters}
      config={{ defaultView: "tree" }}
    />
  )
}
