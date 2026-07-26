"use client";

import { useFormContext, useFieldArray, type FieldValues, type ArrayPath } from "react-hook-form";

import { Button } from "../../Button";
import { Card } from "../../Card";
import type { FieldArrayProps } from "../types";

/**
 * `FormBuilder.FieldArray` — a repeating list of sub-fields (RHF `useFieldArray`).
 * `children` renders one row's fields; name them `${rowName}.field`.
 */
export function FieldArray(props: FieldArrayProps) {
  const form = useFormContext<FieldValues>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: props.name as ArrayPath<FieldValues>,
  });

  if (props.hidden) return null;

  const addButton = (
    <Button
      type="button"
      size="S"
      variant="BorderStyle"
      onClick={() => append((props.defaultItem ?? {}) as never)}
    >
      <i className="ri-add-line" />
      {props.addLabel ?? "Add"}
    </Button>
  );

  return (
    <section className="grid w-full max-w-[1200px] gap-3 px-[12px] py-[16px]">
      <div className="flex items-center justify-between">
        {props.label ? (
          <span className="typography-body-medium-medium text-content-presentation-global-primary">
            {props.label}
          </span>
        ) : (
          <span />
        )}
        {addButton}
      </div>
      {props.description && (
        <p className="typography-body-small-regular text-content-presentation-global-secondary">
          {props.description}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {fields.map((f, index) => (
          <Card key={f.id} className="relative gap-3 pr-8">
            <button
              type="button"
              aria-label="Remove"
              onClick={() => remove(index)}
              className="absolute right-2 top-2 inline-flex h-[22px] w-[22px] items-center justify-center rounded-full text-content-presentation-state-negative transition-colors hover:bg-background-presentation-action-hover"
            >
              <i className="ri-close-line text-[16px]" />
            </button>
            {props.children(`${props.name}.${index}`, index, () => remove(index))}
          </Card>
        ))}
        {fields.length === 0 && (
          <p className="typography-body-small-regular text-content-presentation-global-secondary">
            No items yet.
          </p>
        )}
      </div>
    </section>
  );
}
