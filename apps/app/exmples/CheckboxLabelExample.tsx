import { LabeledCheckBox } from "@/components/LabeledCheckBox";
import { cn } from "@/utils/cn";
import { useState } from "react";

export default function CheckboxLabelExample() {
  const [sizes] = useState<any>(["S", "M", "L"]);

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          "text-content-system-global-primary"
        )}
      >
        LabeledCheckBox Preview
      </h1>
      {sizes.map((size: any) => (
        <div key={size} className="flex flex-col gap-2 w-full">
          <span
            className={cn(
              "text-sm",
              "text-content-system-global-primary"
            )}
          >
            Size: {size}
          </span>
          <LabeledCheckBox
            key={size}
            id={`checkbox-${size}`}
            size={size}
            label="Label"
          >
            <span>Label</span>
          </LabeledCheckBox>
        </div>
      ))}
    </>
  );
}
