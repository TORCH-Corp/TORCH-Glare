import { LabeledRadio } from "@/components/LabeledRadio";
import { RadioGroup } from "@/components/Radio";
import { cn } from "@/utils/cn";
import { useState } from "react";

export default function RadioLabelExample() {
  const [sizes] = useState<string[]>(["S", "M", "L"]);

  return (
    <>
      <h1 className={cn("text-xl font-bold mb-8", "text-content-system-global-primary")}>
        LabeledRadio Preview
      </h1>
      <RadioGroup>
        {sizes.map((size: string, idx: number) => (
          <LabeledRadio label={`Label ${size}`} id={`radio-${size}`} key={idx} value={size} />
        ))}
      </RadioGroup>
    </>
  );
}

/* 
        <div key={size} className="flex flex-col gap-2 w-full">
          <span
            className={cn(
              "text-sm",
              "text-content-system-global-primary"
            )}
          >
            Size: {size}
          </span>
          <LabeledRadio
            requiredLabel="Required"
            secondaryLabel="Secondary Label"
            label={"Label"}
            key={size}
            id={`radio-${size}`}
            size={size}
            name={`radio-label`}
          ></LabeledRadio>
        </div>
*/
