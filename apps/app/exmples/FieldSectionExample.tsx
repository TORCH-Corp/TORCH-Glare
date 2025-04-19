import { FieldHint } from "@/components/FieldHint";
import { FieldSection } from "@/layouts/FieldSection";
import { InputField } from "@/components/InputField";
import { cn } from "@/utils/cn";
import { useState } from "react";

export default function FieldSectionExample() {
  const [ButtonSizes] = useState<any>(["S", "M", "L"]);

  return (
    <>
      <h1
        className={cn("text-xl font-bold mb-4", {
          "text-content-system-global-primary": true

        })}
      >
        FieldSection Styles Preview
      </h1>

      {ButtonSizes.map((size: any) => (
        <div key={size} className="flex-1">
          <h2 className="text-lg font-semibold">Size: {size}</h2>
          <FieldSection
            size={size}
            label={`Label`}
            secondaryLabel={`Secondary Label`}
            requiredLabel={`Required`}
            childrenUnderLabel={
              <>
                <FieldHint label={"Warning"} state={"warning"}></FieldHint>
                <FieldHint label={"Error"} state={"error"}></FieldHint>
                <FieldHint label={"Info"} state={"info"}></FieldHint>
                <FieldHint label={"Success"} state={"success"}></FieldHint>
              </>
            }
          >
            <InputField
              size={size !== "L" ? size : "M"}
              placeholder="Input Field"
              className="w-full shrink-shrink-0"
            />
            <InputField
              size={size !== "L" ? size : "M"}
              placeholder="Input Field"
              className="w-full shrink-shrink-0"
            />
            <InputField
              size={size !== "L" ? size : "M"}
              placeholder="Input Field"
              className="w-full shrink-shrink-0"
            />
            <InputField
              size={size !== "L" ? size : "M"}
              placeholder="Input Field"
              className="w-full shrink-shrink-0"
            />
            <InputField
              size={size !== "L" ? size : "M"}
              placeholder="Input Field"
              className="w-full shrink-shrink-0"
            />
          </FieldSection>
        </div>
      ))}
    </>
  );
}
