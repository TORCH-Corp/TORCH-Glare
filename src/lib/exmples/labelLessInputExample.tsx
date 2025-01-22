import { Button } from "@/components/base/Button";
import { LabelLessInput } from "@/components/base/LabelLessInput";
import { MenuItem } from "@/components/base/MenuItem";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/themeProvider";
import { useState } from "react";

export default function LabelLessInputExample() {
  const { theme } = useTheme();

  const [anotherSizes] = useState<any>(["S", "M"]);
  const variants = ["default", "SystemStyle"];
  const [error, setError] = useState(false);
  const [value, setValue] = useState("");

  return (
    <>
      <h1
        className={cn("text-2xl", {
          "text-black": theme === "light",
          "text-white": theme === "dark",
        })}
      >
        LabelLessInput Preview
      </h1>

      {/* Loop through sizes and variants */}
      {anotherSizes.map((size: any) =>
        variants.map((variant: any, idx: any) => (
          <div key={`${size}-${variant}`} className="">
            <h2
              className={cn("text-lg font-semibold", {
                "text-black": theme === "light",
                "text-white": theme === "dark",
              })}
            >
              {`Variant: ${variant}, Size: ${size}`}
            </h2>

            {/* Render the LabelLessInput component for each size and variant */}
            <LabelLessInput
              label={`Label`}
              required
              toolTipSide={"top"}
              size={size}
              variant={variant === "default" ? undefined : variant}
              popoverChildren={
                <MenuItem
                  variant={variant == "SystemStyle" ? "SystemStyle" : "Default"}
                  size={size}
                >
                  Dropdown Content
                </MenuItem>
              }
              errorMessage={error ? "This is an error message" : undefined}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`(${size} - ${variant})`}
            />
          </div>
        ))
      )}

      {/* Toggle Error State Button */}
      <Button
        onClick={() => setError((prev) => !prev)}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Toggle Error State
      </Button>
    </>
  );
}
