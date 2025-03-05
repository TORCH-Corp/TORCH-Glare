import { Button } from "@/components/Button";
import { InputField } from "@/components/InputField";
import { PopoverItem } from "@/components/Popover";
import { cn } from "@/utils/cn";
import { useTheme } from "@/providers/ThemeProvider";
import { useState } from "react";

export default function InputFieldExample() {
  const { theme } = useTheme();
  const mockIcons = [
    <i className="ri-user-line"></i>,
    <i className="ri-search-line"></i>,
  ];
  const [anotherSizes] = useState<any>(["S", "M"]);
  const variants = ["PresentationStyle", "SystemStyle"];
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
        InputField Preview
      </h1>

      {/* Loop through variants and sizes */}
      {anotherSizes.map((size: any) =>
        variants.map((variant: any, idx: any) => (
          <form autoComplete="off" key={`${size}-${variant}`} className="">
            <h2
              className={cn("text-lg font-semibold", {
                "text-black": theme === "light",
                "text-white": theme === "dark",
              })}
            >{`Variant: ${variant}, Size: ${size}`}</h2>
            <InputField
              type="password"
              size={size}
              variant={variant}
              icon={mockIcons[idx % mockIcons.length]}
              popoverChildren={
                <PopoverItem
                  variant={variant == "SystemStyle" ? "SystemStyle" : "Default"}
                  size={size}
                >
                  Dropdown Content
                </PopoverItem>
              }
              errorMessage={error ? "This is an error message" : undefined}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`InputField`}
            />
          </form>
        ))
      )}

      {/* Toggle Error State */}
      <Button
        onClick={() => setError((prev) => !prev)}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Toggle Error State
      </Button>
    </>
  );
}
