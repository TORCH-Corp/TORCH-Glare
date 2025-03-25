import { Button } from "@/components/Button";
import ButtonField from "@/components/ButtonField";
import { cn } from "@/utils/cn";
import { useState } from "react";

export function ButtonFieldExample() {
  const [variants] = useState<any>([true, false]);

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          "text-content-system-global-primary"
        )}
      >
        ButtonField Preview
      </h1>
      {variants.map((variant: any) => (
        <div key={variant} className="flex flex-col gap-2 w-full">
          <span
            className={cn(
              "text-sm",
              "text-content-system-global-primary"
            )}
          >
            {variant ? "With Divider" : "Without Divider"}
          </span>
          <div className="flex gap-2 items-start">
            <ButtonField withDivider={variant} >
              <Button>OPTION 1</Button>
              <Button>OPTION 2</Button>
              <Button>OPTION 3</Button>
            </ButtonField>
          </div>
        </div>
      ))}
    </>
  );
}
