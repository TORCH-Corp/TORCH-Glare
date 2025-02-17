import { CheckboxLabel } from "@/components/CheckboxLabel";
import { cn } from "@/utils/cn";
import { useTheme } from "@/providers/ThemeProvider";
import { useState } from "react";

export default function CheckboxLabelExample() {
  const [sizes] = useState<any>(["S", "M", "L"]);
  const { theme } = useTheme();

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          theme === "light" ? "text-black" : "text-white"
        )}
      >
        CheckboxLabel Preview
      </h1>
      {sizes.map((size: any) => (
        <div key={size} className="flex flex-col gap-2 w-full">
          <span
            className={cn(
              "text-sm",
              theme === "light" ? "text-black" : "text-white"
            )}
          >
            Size: {size}
          </span>
          <CheckboxLabel
            requiredLabel="Required"
            secondaryLabel="Secondary Label"
            label={"Label"}
            key={size}
            id={`checkbox-${size}`}
            size={size}
          ></CheckboxLabel>
        </div>
      ))}
    </>
  );
}
