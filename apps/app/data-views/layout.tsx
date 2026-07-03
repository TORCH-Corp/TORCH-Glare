"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { DataViewsLayout } from "@/components/DataViews"
import { orders, orderFields, ALL_VIEWS } from "./orders-data"

export default function DataViewsRouteLayout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ id?: string }>()
  const selectedId = params?.id

  const [search, setSearch] = useState("")

  // Replace this local filter with a fetch to your endpoint when ready.
  const visibleOrders = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return orders
    return orders.filter((o) =>
      [o.id, o.customer, o.status, o.priority, o.total, o.createdAt]
        .map((v) => String(v).toLowerCase())
        .some((s) => s.includes(q)),
    )
  }, [search])

  return (
    <div className="flex h-screen flex-col bg-background-presentation-body-primary">
      <div className="flex-1 overflow-hidden">
        <DataViewsLayout
          title="Orders"
          data={visibleOrders}
          fields={orderFields}
          views={ALL_VIEWS}
          config={selectedId ? { defaultView: "inbox" } : undefined}
          kanbanGroupBy="status"
          showFilters
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search orders..."
          inboxItemHref={(_item, id) => `/data-views/${id}`}
          inboxSelectedId={selectedId}
          inboxRenderDetail={selectedId ? () => children : undefined}
        />
      </div>
    </div>
  )
}
