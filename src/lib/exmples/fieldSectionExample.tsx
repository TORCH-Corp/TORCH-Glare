import { Alert } from "@/components/base/Alert";
import { FieldSection } from "@/components/base/FieldSection";
import { InputField } from "@/components/base/InputField";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/ThemeProvider";
import { useState } from "react";

export default function FieldSectionExample() {
  const [ButtonSizes] = useState<any>(["S", "M", "L"]);
  const { theme } = useTheme();

  return (
    <>
      <h1
        className={cn("text-xl font-bold mb-4", {
          "text-black": theme === "light",
          "text-white": theme === "dark",
        })}
      >
        FieldSection Styles Preview
      </h1>

      {ButtonSizes.map((size: any) => (
        <div key={size} className="">
          <h2 className="text-lg font-semibold">Size: {size}</h2>
          <FieldSection
            size={size}
            label={`Label`}
            secondaryLabel={`Secondary Label`}
            requiredLabel={`Required`}
            childrenUnderLabel={
              <>
                <Alert label={"Warning"} state={"warning"}></Alert>
                <Alert label={"Error"} state={"error"}></Alert>
                <Alert label={"Info"} state={"info"}></Alert>
                <Alert label={"Success"} state={"success"}></Alert>
              </>
            }
          >
            <section className="flex flex-wrap flex-1 gap-[12px]">
              <InputField
                size={size !== "L" ? size : "M"}
                placeholder="Input Field"
              />
              <InputField
                size={size !== "L" ? size : "M"}
                placeholder="Input Field"
              />
              <InputField
                size={size !== "L" ? size : "M"}
                placeholder="Input Field"
              />
              <InputField
                size={size !== "L" ? size : "M"}
                placeholder="Input Field"
              />
            </section>
          </FieldSection>
        </div>
      ))}
    </>
  );
}
