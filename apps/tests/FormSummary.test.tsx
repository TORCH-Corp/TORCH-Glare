import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";

import { FormBuilder } from "@/components/FormBuilder";
import { FormSummary } from "@/components/FormSummary";

interface Invoice {
  qty?: number;
  price?: number;
  taxRate: number;
}

const subTotal = (v: Invoice) => (v.qty ?? 0) * (v.price ?? 0);
const totalTax = (v: Invoice) => subTotal(v) * ((v.taxRate ?? 0) / 100);
const overall = (v: Invoice) => subTotal(v) + totalTax(v);

/**
 * The panel renders OUTSIDE the form, beside it — both share one hoisted `useForm`.
 */
function InvoiceForm() {
  const form = useForm<Invoice>({ defaultValues: { qty: 0, price: 0, taxRate: 10 } });

  return (
    <div>
      <FormBuilder<Invoice> form={form} onSubmit={() => {}}>
        <FormBuilder.Number name="qty" label="Qty" />
        <FormBuilder.Currency name="price" label="Price" currencySymbol="$" />
      </FormBuilder>

      <FormSummary form={form} title="Invoice" subtitle="Summary">
        <FormSummary.Group title="Total">
          <FormSummary.Row label="Sub Total" compute={subTotal} />
          <FormSummary.Row label="Total Tax" compute={totalTax} />
          <FormSummary.Row label="Overall Total" emphasized compute={overall} />
        </FormSummary.Group>
      </FormSummary>
    </div>
  );
}

/** The value input for a summary row, found via its label. */
function rowValue(label: string): HTMLInputElement {
  const labelEl = screen.getByText(label);
  const input = labelEl.parentElement?.querySelector("input");
  if (!input) throw new Error(`no value input for row "${label}"`);
  return input as HTMLInputElement;
}

/**
 * The form's editable inputs, in order — Glare's FieldSection label isn't
 * `htmlFor`-associated, so getByLabelText can't reach them. The summary's own
 * inputs are readOnly, so filtering those out leaves exactly the form fields.
 */
function editableInputs(container: HTMLElement): HTMLInputElement[] {
  return Array.from(container.querySelectorAll("input")).filter((i) => !i.readOnly);
}

describe("FormSummary", () => {
  it("renders computed rows from the form's default values", () => {
    render(<InvoiceForm />);
    expect(rowValue("Sub Total").value).toBe("0.00");
    expect(rowValue("Total Tax").value).toBe("0.00");
    expect(rowValue("Overall Total").value).toBe("0.00");
  });

  it("recomputes every total live as the user types", async () => {
    const user = userEvent.setup();
    const { container } = render(<InvoiceForm />);

    const [qty, price] = editableInputs(container);

    // qty = 3, price = 100  ->  sub 300, tax 10% = 30, overall 330
    await user.clear(qty);
    await user.type(qty, "3");
    await user.clear(price);
    await user.type(price, "100");

    expect(rowValue("Sub Total").value).toBe("300.00");
    expect(rowValue("Total Tax").value).toBe("30.00");
    expect(rowValue("Overall Total").value).toBe("330.00");
  });

  it("renders the value fields read-only so they never enter the payload", () => {
    render(<InvoiceForm />);
    expect(rowValue("Sub Total")).toHaveAttribute("readonly");
  });
});
