"use client";

import { FormRenderer } from "@/components/FormRenderer";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { DemoHeader } from "../_shared";

// A display-only **detail page**: `FormRenderer.Sidebar` is the tab rail (where a stepper's nav would
// go); each `FormRenderer.Sidebar.Item` swaps in its matching `FormRenderer.Tab` — panels of read-only
// `FormRenderer.Section` blocks (`FormRenderer.Grid` + `.Row` lay out the label/value display cells).
// No form, no submit — the sidebar just changes what's rendered.

const NAV = [
  { value: "overview", label: "Overview", icon: "ri-layout-grid-line" },
  { value: "items", label: "Items Table", icon: "ri-table-line" },
  { value: "matching", label: "Matching", icon: "ri-git-merge-line" },
  { value: "documents", label: "Documents", icon: "ri-file-list-2-line" },
  { value: "activity", label: "Activity log", icon: "ri-pulse-line" },
];

const Grid = FormRenderer.Grid;
const Row = FormRenderer.Row;

export default function SidebarDetailExample() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <DemoHeader
        title="Detail tabs (sidebar)"
        blurb="A display-only detail page — the sidebar rail swaps FormRenderer.Section panels, sitting where a stepper's nav would. Built on the same Radix Tabs primitive as shadcn."
      />

      <FormRenderer
        className="min-h-0 flex-1"
        header={{ title: "Order DE-344", variant: "detail" }}
        actions={
          <>
            <Button variant="BorderStyle">
              <i className="ri-printer-line" />
              Print
            </Button>
            <Button>
              <i className="ri-check-line" />
              Approve
            </Button>
          </>
        }
      >
        {/* The rail — one Item per tab. */}
        <FormRenderer.Sidebar>
          {NAV.map((n) => (
            <FormRenderer.Sidebar.Item
              key={n.value}
              value={n.value}
              icon={<i className={n.icon} />}
            >
              {n.label}
            </FormRenderer.Sidebar.Item>
          ))}
        </FormRenderer.Sidebar>

        {/* One panel per tab — read-only Section blocks. */}
        <FormRenderer.Tab value="overview">
          <FormRenderer.Section title="Main Information" color="Blue">
            <Grid>
              <Row label="PO Number" value="PO-000123" />
              <Row label="Status" value={<Badge label="Submitted" color="yellow" />} />
              <Row label="Display Name" value="Global Office Inc." />
              <Row label="PO Date" value="March 20, 2026" />
              <Row label="Created By" value="Ahmed Hassan" />
              <Row label="Created Date" value="March 20, 2026" />
            </Grid>
          </FormRenderer.Section>

          <FormRenderer.Section title="Customer & Delivery" color="Red">
            <Grid>
              <Row label="Customer" value="Global Office Inc. (sup-001)" />
              <Row label="Warehouse" value="Dubai Main Warehouse (wh-001)" />
              <Row label="Expected Delivery Date" value="April 5, 2026" />
            </Grid>
          </FormRenderer.Section>

          <FormRenderer.Section title="Financial Information" color="Purple">
            <Grid>
              <Row label="Currency" value="AED" />
              <Row label="Cost Center" value="CC-ADM-001" />
              <Row label="Subtotal" value="AED 45,000.00" />
              <Row label="Tax Total" value="AED 2,250.00" />
              <Row
                label="Total Amount"
                value={
                  <span className="typography-body-large-medium text-content-presentation-global-primary">
                    AED 47,250.00
                  </span>
                }
              />
            </Grid>
          </FormRenderer.Section>

          <FormRenderer.Section title="Notes" color="Green">
            <p className="typography-body-medium-regular text-content-presentation-global-secondary">
              Urgent order for Q1 office supplies. Please prioritize delivery.
            </p>
          </FormRenderer.Section>
        </FormRenderer.Tab>

        <FormRenderer.Tab value="items">
          <FormRenderer.Section title="Items Table" color="Blue">
            <Grid>
              <Row label="Line 1" value="Ergonomic Chair × 20 — AED 18,000.00" />
              <Row label="Line 2" value="Standing Desk × 15 — AED 22,500.00" />
              <Row label="Line 3" value="Monitor Arm × 30 — AED 4,500.00" />
              <Row label="Total lines" value="3" />
            </Grid>
          </FormRenderer.Section>
        </FormRenderer.Tab>

        <FormRenderer.Tab value="matching">
          <FormRenderer.Section title="Matching" color="Purple">
            <Grid>
              <Row label="PO ↔ Receipt" value={<Badge label="Matched" color="green" />} />
              <Row label="PO ↔ Invoice" value={<Badge label="Pending" color="yellow" />} />
            </Grid>
          </FormRenderer.Section>
        </FormRenderer.Tab>

        <FormRenderer.Tab value="documents">
          <FormRenderer.Section title="Documents" color="Red">
            <Grid>
              <Row label="Purchase Order" value="PO-000123.pdf" />
              <Row label="Quotation" value="QT-000089.pdf" />
            </Grid>
          </FormRenderer.Section>
        </FormRenderer.Tab>

        <FormRenderer.Tab value="activity">
          <FormRenderer.Section title="Activity log" color="Green">
            <Grid>
              <Row label="Created" value="Ahmed Hassan · March 20, 2026" />
              <Row label="Submitted" value="Ahmed Hassan · March 20, 2026" />
              <Row label="Approved" value="Mazen Maher · March 21, 2026" />
            </Grid>
          </FormRenderer.Section>
        </FormRenderer.Tab>
      </FormRenderer>
    </div>
  );
}
