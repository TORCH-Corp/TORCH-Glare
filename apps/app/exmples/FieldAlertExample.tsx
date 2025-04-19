import { FieldHint } from "@/components/FieldHint";
import { cn } from "@/utils/cn";
import { useState } from "react";

export function FieldAlertExample() {
  const [variants] = useState<any>(["info", "warning", "error", "success"]);

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          "text-content-system-global-primary"
        )}
      >
        FieldAlert Preview
      </h1>
      {variants.map((variant: any) => (
        <div key={variant} className="flex flex-col gap-2 w-full">
          <span
            className={cn(
              "text-sm",
              "text-content-system-global-primary"
            )}
          >
            Variant: {variant}
          </span>
          <FieldHint
            label={`FieldHint with variant: ${variant}`}
            state={variant}
          ></FieldHint>
        </div>
      ))}
    </>
  );
}
