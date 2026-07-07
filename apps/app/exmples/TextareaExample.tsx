import { Textarea } from "@/components/Textarea";
import { cn } from "@/utils/cn";
import { useState } from "react";

export default function TextareaExample() {
  const [dir] = useState<("row" | "column")[]>(["row", "column"]);

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          "text-content-system-global-primary"
        )}
      >
        Textarea Preview
      </h1>
      {
        dir.map((e) => (
          <div key={e}
            className="flex flex-col gap-2 w-full">

            <span
              className={cn(
                "text-sm",
                "text-content-system-global-primary"
              )}
            >
              direction: {e}
            </span>

            <Textarea direction={e} label="Label" secondaryLabel="Secondary Label" requiredLabel="Required" />
          </div>
        ))
      }
    </>
  );
}
