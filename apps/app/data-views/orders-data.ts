import type { FieldConfig, ViewVisibility } from "@/components/DataViews"

export const orders = [
  { id: 1, customer: "Acme Inc.",     status: "Pending",  priority: "High",   total: 1240, createdAt: "2025-09-10" },
  { id: 2, customer: "Globex Corp.",  status: "Shipped",  priority: "Medium", total: 480,  createdAt: "2025-09-12" },
  { id: 3, customer: "Initech",       status: "Delivered",priority: "Low",    total: 99,   createdAt: "2025-09-15" },
  { id: 4, customer: "Umbrella",      status: "Pending",  priority: "High",   total: 2890, createdAt: "2025-09-18" },
  { id: 5, customer: "Hooli",         status: "Shipped",  priority: "Medium", total: 740,  createdAt: "2025-09-20" },
  { id: 6, customer: "Stark Industries", status: "Pending", priority: "High", total: 12400, createdAt: "2025-09-22" },
  { id: 7, customer: "Wayne Enterprises", status: "Delivered", priority: "Medium", total: 5300, createdAt: "2025-09-25" },
  { id: 8, customer: "Cyberdyne",     status: "Shipped",  priority: "Low",    total: 220,  createdAt: "2025-09-28" },
]

export const orderFields: FieldConfig[] = [
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

export const ALL_VIEWS: ViewVisibility = { table: true, kanban: true, inbox: true, tree: true }
