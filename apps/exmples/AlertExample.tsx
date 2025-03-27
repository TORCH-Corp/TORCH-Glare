import Alert from "@/components/Alert";
import { cn } from "@/utils/cn";
import { useState } from "react";

export function AlertExample() {
  const [variants] = useState<any>(["info", "warning", "error", "success"]);

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          "text-content-system-global-primary"
        )}
      >
        Alert Preview
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
          <Alert
            label={`Alert with variant: ${variant}`}
            state={variant}
          ></Alert>
        </div>
      ))}
    </>
  );
}
