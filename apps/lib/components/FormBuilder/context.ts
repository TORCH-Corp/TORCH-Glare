"use client";

import { createContext, useContext } from "react";

/**
 * How a field row lays out its label against its control.
 *
 * `"flexible"` is the responsive one: stacked, then label-beside-control once the field row itself
 * is past the container `md` breakpoint. It is what you get by leaving `fieldDirection` unset — and
 * it is assignable so you can ask for it back where something else defaults you away from it, most
 * notably a `FormRenderer` drawer, which pins `"vertical"`.
 */
export type FieldDirection = "horizontal" | "vertical" | "flexible";

/** Loading flag — drives the Submit spinner and disables inputs. */
export const LoadingContext = createContext<boolean>(false);
export const useLoading = () => useContext(LoadingContext);

/**
 * The `<form>`'s `id`. Provided by the FormBuilder root so a `FormBuilder.Submit` rendered
 * **outside** the `<form>` element — the absolute header's action pill, or the drawer header —
 * can still submit it via native `form={id}` association without the caller wiring an id by hand.
 */
export const FormIdContext = createContext<string | undefined>(undefined);
export const useFormId = () => useContext(FormIdContext);

/**
 * Field row direction — set via `FormBuilder`'s `fieldDirection` prop. `undefined` (the default)
 * means "don't force one": `FieldSection` then uses its own responsive `flexible` layout, which
 * stacks on small screens and goes two-column at `lg`. Only set this to pin a direction.
 */
export const DirectionContext = createContext<FieldDirection | undefined>(undefined);
export const useDirection = () => useContext(DirectionContext);

/**
 * Field chrome mode — how much layout a field draws around its control.
 *
 * - `false` (the default) — the full `FieldSection` row: label, required marker, stacked hint.
 * - `"table"` — a `FormBuilder.Table` cell: no row chrome, errors as a tooltip on the control,
 *   and the control takes the flush table border treatment via `onTable`.
 * - `"bare"` — chrome-less anywhere else, e.g. a `DataViews` filter or config panel: no row and
 *   no stacked hint, but the control keeps its normal standalone border.
 *
 * The two chrome-less modes are deliberately distinct: dropping the label row and taking the
 * table border are different decisions, and only a real table cell wants both.
 */
export type CellMode = "table" | "bare" | false;

export const CellContext = createContext<CellMode>(false);

/** The raw mode. Prefer `useBare` / `useOnTable` — they express the two real questions. */
export const useCellMode = () => useContext(CellContext);
/** True when the field renders without `FieldSection` chrome — `"table"` **or** `"bare"`. */
export const useBare = () => useContext(CellContext) !== false;
/** True only inside a `FormBuilder.Table` cell — drives the control's `onTable` border style. */
export const useOnTable = () => useContext(CellContext) === "table";

/**
 * Step registry — a `FormRenderer.Step` provides this so the fields rendered inside it can
 * register their `name`, and the stepper validates just those names before advancing. `null`
 * when not inside a stepper.
 *
 * The stepper itself lives in `FormRenderer` — it is chrome. This registry stays here because
 * the *fields* are what register into it (see `fields/FieldShell.tsx`), and FormBuilder must
 * stand alone without FormRenderer installed. FormRenderer's `StepSlot` imports it from here;
 * the dependency never points the other way.
 */
export interface StepRegistry {
  register: (name: string) => void;
  unregister: (name: string) => void;
}
export const StepContext = createContext<StepRegistry | null>(null);
export const useStepRegistry = () => useContext(StepContext);
