"use client"

import { notFound, useParams } from "next/navigation"
import { Archive, Forward, MoreHorizontal, Reply, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/Avatar"
import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { Divider } from "@/components/Divider"
import { renderField } from "@/components/DataViews/fieldRenderers"
import { renderDetailView } from "@/utils/dataViews/nestedDataUtils"
import { getByPath } from "@/utils/dataViews/pathUtils"
import { orders, orderFields } from "../orders-data"

function getInitials(name: unknown): string {
  const s = String(name ?? "?").trim()
  if (!s) return "?"
  return (
    s
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "?"
  )
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>()
  const id = Number(params?.id)
  const order = orders.find((o) => o.id === id)

  if (!order) {
    notFound()
  }

  const titleField = orderFields[0]
  const previewField = orderFields[1]
  const columns = orderFields.map((f, i) => ({
    id: f.path,
    label: f.label ?? f.path,
    visible: true,
    order: i,
  }))

  return (
    <div className="flex h-full flex-col bg-background-presentation-form-base">
      <div className="flex items-center justify-between gap-4 p-4 border-b border-border-presentation-global-primary bg-background-presentation-form-base">
        <div className="flex items-center gap-2">
          <Button variant="BorderStyle" buttonType="icon">
            <Archive className="h-4 w-4" />
          </Button>
          <Button variant="BorderStyle" buttonType="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
          <Divider orientation="vertical" className="h-6" />
          <Button variant="BorderStyle" buttonType="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <Card>
          <div className="flex items-start gap-4 mb-6">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-background-presentation-action-primary text-content-presentation-action-primary">
                {getInitials(getByPath(order, previewField.path))}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h2 className="text-xl font-semibold text-content-presentation-global-primary mb-1">
                    {String(getByPath(order, titleField.path))}
                  </h2>
                  <p className="text-sm text-content-presentation-global-tertiary">
                    {previewField.label}:{" "}
                    <span className="text-content-presentation-global-primary">
                      {String(getByPath(order, previewField.path))}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {orderFields.slice(3).map((field) => {
                  const value = getByPath(order, field.path)
                  if (value == null) return null
                  return <span key={field.path}>{renderField(value, field, order)}</span>
                })}
              </div>
            </div>
          </div>

          <Divider className="my-6" />

          {renderDetailView(
            order,
            columns.filter((c) => c.visible),
            (value, column, row) => {
              const f = orderFields.find((field) => field.path === column.id)
              if (f) return renderField(value, f, row)
              return <span>{String(value ?? "")}</span>
            },
          )}
        </Card>
      </div>

      <div className="flex items-center gap-2 p-4 border-t border-border-presentation-global-primary bg-background-presentation-body-primary">
        <Button className="gap-2">
          <Reply className="h-4 w-4" />
          Reply
        </Button>
        <Button variant="BorderStyle" className="gap-2 bg-transparent">
          <Forward className="h-4 w-4" />
          Forward
        </Button>
      </div>
    </div>
  )
}
