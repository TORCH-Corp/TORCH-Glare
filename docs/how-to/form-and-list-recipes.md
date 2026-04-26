---
title: Form & List Page Recipes
description: Production-tested patterns for building create dialogs, list pages, journal-line grids, and login layouts with TORCH Glare. Captures the "what actually ships" decisions for app-builders.
keywords: [recipes, patterns, form, list, dialog, journal, line-items, login, filter-bar, grid]
---

# Form & List Page Recipes

Battle-tested layouts and component combinations from production frontend work.
Use these as the starting point for create dialogs, list/filter pages,
line-item grids, and login flows.

> All examples use the `presentation` color tokens. Never substitute
> `*-system-*` tokens or `variant="SystemStyle"` — see the rules banner at
> the top of every doc response.

---

## Recipe 1 — Multi-column form row with consistent baselines

**Use case:** A row in a create dialog that mixes `InputField`, `Select`, and
date inputs. Default heights don't match across components, so you have to
opt in to alignment explicitly.

```tsx
<div className="grid grid-cols-3 gap-4">
  <div className="flex flex-col gap-1.5">
    <Label>Voucher Type *</Label>
    <Select
      className="w-full h-10"
      value={type}
      onValueChange={setType}
      options={typeOptions}
      placeholder="Select type"
    />
  </div>

  <div className="flex flex-col gap-1.5">
    <Label>Date *</Label>
    <InputField
      className="h-10"
      type="date"
      icon={<i className="ri-calendar-line text-base" />}
      {...register("date")}
    />
  </div>

  <div className="flex flex-col gap-1.5">
    <Label>Fiscal Period *</Label>
    <Select
      className="w-full h-10"
      value={period}
      onValueChange={setPeriod}
      options={periodOptions}
      placeholder="Select period"
    />
  </div>
</div>
```

Key rules:

- **Every form control gets `h-10`** — both `InputField` and `Select` (which
  also needs `w-full`).
- **Wrap each field in `flex flex-col gap-1.5`**, not `space-y-1.5`, so labels
  sit cleanly at the top of the row.
- **Use `<InputField type="date">`** instead of a native `<input type="date">`
  so you keep the icon slot and consistent styling.

---

## Recipe 2 — List page with filter bar + data table

**Use case:** Every list page (vouchers, accounts, bank accounts, etc.) needs
the same filter bar — a search input + one or more select filters above a
data table.

```tsx
{/* Filter bar */}
<div className="flex items-center gap-3">
  <div className="flex-1 max-w-sm">
    <InputField
      className="h-10"
      icon={<i className="ri-search-line text-base" />}
      placeholder="Search..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>

  <SimpleSelect
    className="w-48 h-10"
    value={statusFilter || "ALL"}
    onValueChange={(val) => setStatusFilter(val === "ALL" ? "" : val)}
    options={[
      { value: "ALL", label: "All Statuses" },
      { value: "DRAFT", label: "Draft" },
      { value: "POSTED", label: "Posted" },
    ]}
    placeholder="All Statuses"
  />
</div>

{/* Data table */}
<Card className="p-0 overflow-hidden">
  <CardContent className="p-0 overflow-x-auto">
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead>Number</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Total Debit</TableHead>
          <TableHead className="text-right">Total Credit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={4}
              childrenClassName="flex flex-col items-center justify-center gap-3 py-12 w-full min-w-0 text-content-presentation-global-secondary"
            >
              <i className="ri-inbox-line text-4xl opacity-60" />
              <p className="typography-body-medium-regular">No vouchers</p>
              <p className="typography-body-small-regular opacity-80">
                Try adjusting your filters
              </p>
            </TableCell>
          </TableRow>
        ) : (
          rows.map((v) => (
            <TableRow key={v.id}>
              <TableCell className="whitespace-nowrap">{v.number}</TableCell>
              <TableCell>{v.status}</TableCell>
              <TableCell className="text-right font-mono whitespace-nowrap">
                {v.totalDebit}
              </TableCell>
              <TableCell className="text-right font-mono whitespace-nowrap">
                {v.totalCredit}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </CardContent>
</Card>
```

Key rules:

- **Never use a native `<select>`** — `SimpleSelect` keeps styling consistent
  with the rest of your forms.
- **Never manually position a search icon with absolute positioning** —
  `InputField`'s `icon` prop is built for this.
- **Numeric columns get `text-right` on both `TableHead` and `TableCell`**,
  plus `font-mono` on the cell so digits line up.
- **Empty states use `childrenClassName`** on `TableCell` to bypass the
  default `flex-row justify-start min-w-[200px]` wrapper. See `Table.md`
  → "TableCell force-wraps children" for why.
- **The "All / Any" filter option needs a sentinel value** (`"ALL"` here)
  because Radix forbids `value=""`. See `SimpleSelect.md` for details.

---

## Recipe 3 — Journal lines / line-item grid (display: contents)

**Use case:** A repeating-row layout (journal lines, invoice line items,
purchase order rows) with a header, N data rows, and a totals row — where
columns must align across all rows.

The naïve approach (each row is its own `display: grid`) breaks: short
footer content collapses to a different width than long input content,
and columns drift across rows. The fix is **one parent grid** with
`className="contents"` on each row wrapper so the row's children become
direct grid items of the parent.

```tsx
<div className="grid w-full grid-cols-[32px_minmax(0,2.5fr)_minmax(0,3fr)_minmax(0,1.5fr)_minmax(0,1.5fr)_36px] gap-x-3 gap-y-2 px-2">
  {/* Header cells (direct grid items) */}
  <div>#</div>
  <div>Account</div>
  <div>Description</div>
  <div>Debit</div>
  <div>Credit</div>
  <div />

  {/* Data rows — wrapper uses className="contents" so its children become
      direct grid items of the parent grid */}
  {lines.map((line, idx) => (
    <div key={line.key} className="contents">
      <div>{idx + 1}</div>
      <Select
        className="w-full h-10"
        value={line.accountId}
        onValueChange={(v) => updateLine(line.key, { accountId: v })}
        options={accountOptions}
      />
      <InputField
        className="h-10"
        value={line.description}
        onChange={(e) => updateLine(line.key, { description: e.target.value })}
      />
      <InputField
        className="h-10 text-right font-mono"
        type="number"
        value={line.debit}
        onChange={(e) => updateLine(line.key, { debit: e.target.value })}
      />
      <InputField
        className="h-10 text-right font-mono"
        type="number"
        value={line.credit}
        onChange={(e) => updateLine(line.key, { credit: e.target.value })}
      />
      <button onClick={() => removeLine(line.key)} aria-label="Delete row">
        <i className="ri-delete-bin-line" />
      </button>
    </div>
  ))}

  {/* Totals row — direct grid items, no wrapper */}
  <div />
  <div />
  <div className="text-right">Totals</div>
  <div className="text-right font-mono">{totalDebit}</div>
  <div className="text-right font-mono">{totalCredit}</div>
  <div />
</div>
```

Key rules:

- **`className="contents"`** on the row wrapper is the critical trick. The
  wrapper renders nothing of its own, so its children become direct grid
  items of the parent.
- **`minmax(0, Xfr)`** columns prevent content-driven blowout when a single
  cell has a long value.
- **Fixed-width columns** (the `32px` row-number column, the `36px` delete
  column) are absolute pixel widths; flexible columns use `fr`.
- **Header alignment**: Debit/Credit headers are `text-left` because the
  column starts at the input's left edge — right-aligning the header would
  visually disconnect it from the column. The values inside the input are
  right-aligned via `text-right font-mono` on the input itself.

---

## Recipe 4 — `DialogTitle` with icon

**Use case:** Plain `<DialogTitle>Create Account</DialogTitle>` lacks visual
hierarchy. Adding a relevant icon makes dialogs instantly recognizable.

```tsx
<DialogHeader>
  <DialogTitle>
    <div className="flex items-center gap-2">
      <i className="ri-bank-line text-content-presentation-state-information" />
      <span>Create Account</span>
    </div>
  </DialogTitle>
</DialogHeader>
```

Pick an icon that matches the entity:

| Entity | Icon |
|---|---|
| Account | `ri-bank-line` |
| Fiscal period / year | `ri-calendar-line` |
| Voucher / journal | `ri-receipt-line` |
| Number series | `ri-hashtag` |
| Posting rule | `ri-settings-3-line` |
| Exchange rate | `ri-exchange-line` |
| Bank / cash account | `ri-bank-card-line` |

---

## Recipe 5 — Two-column login layout

**Use case:** A login page with brand panel on the left and form on the right.
Communicates product identity better than a single centered card.

```tsx
import { Card, CardContent } from "@/components/Card";
import { InputField } from "@/components/InputField";
import { LoginButton } from "@/components/LoginButton";

export function LoginPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Brand panel — hidden on mobile */}
      <div
        className={[
          "hidden lg:flex flex-col justify-center gap-6 p-12",
          "bg-linear-to-br from-background-presentation-action-primary/20",
          "via-background-presentation-form-base",
          "to-background-presentation-state-information/10",
        ].join(" ")}
      >
        <h1 className="typography-headers-large-medium">
          Welcome to Torch Finance
        </h1>
        <ul className="flex flex-col gap-3">
          {features.map((f) => (
            <li key={f.title} className="flex items-start gap-3">
              <span
                className={[
                  "mt-0.5 inline-flex h-6 w-6 items-center justify-center",
                  "rounded-full bg-background-presentation-state-success-primary",
                  "text-content-presentation-action-dark-primary",
                ].join(" ")}
              >
                <i className="ri-check-line" />
              </span>
              <div>
                <p className="typography-body-medium-medium">{f.title}</p>
                <p className="typography-body-small-regular text-content-presentation-global-secondary">
                  {f.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col gap-4 p-8">
            <h2 className="typography-headers-medium-medium">Sign in</h2>

            <InputField
              className="h-10"
              type="email"
              icon={<i className="ri-mail-line text-base" />}
              placeholder="Email"
              errorMessage={errors.email?.message}
              {...register("email")}
            />

            <InputField
              className="h-10"
              type={showPassword ? "text" : "password"}
              icon={<i className="ri-lock-line text-base" />}
              childrenSide={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i className={showPassword ? "ri-eye-off-line" : "ri-eye-line"} />
                </button>
              }
              placeholder="Password"
              errorMessage={errors.password?.message}
              {...register("password")}
            />

            <LoginButton isLoading={isSubmitting} type="submit">
              Sign in
            </LoginButton>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

Key rules:

- **`hidden lg:flex`** hides the brand panel on mobile; the form panel
  stretches to full width below the breakpoint.
- **`bg-linear-to-br from-* via-* to-*`** is Tailwind v4 gradient syntax. For
  v3 use `bg-gradient-to-br`.
- **`LoginButton` has a built-in `isLoading` prop** — wire it to your form's
  submitting state instead of writing your own loading spinner.
- **Use `InputField`'s `childrenSide`** for the password show/hide toggle —
  the slot is built for trailing actions like this.
