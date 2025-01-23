import { Button } from "@/components/base/Button";
import { cn } from "@/components/base/utils";
import { useTheme } from "@/providers/ThemeProvider";
import { useState } from "react";

export default function ButtonExample() {
  const [ButtonButtonVariants] = useState<any>([
    "PrimeStyle",
    "BlueSecStyle",
    "YelSecStyle",
    "RedSecStyle",
    "BorderStyle",
    "PrimeContStyle",
    "BlueContStyle",
    "RedContStyle",
  ]);
  const [ButtonSizes] = useState<any>(["S", "M", "L"]);

  const { theme } = useTheme();

  return (
    <>
      <h1
        className={cn("text-xl font-bold", {
          "text-black": theme === "light",
          "text-white": theme === "dark",
        })}
      >
        Button Variants Preview
      </h1>

      {ButtonButtonVariants.map((variant: any) => (
        <div key={variant} className="mb-8 w-full">
          <h2
            className={cn(
              "text-lg font-semibold mb-4",
              theme === "light" ? "text-black" : "text-white"
            )}
          >
            {variant}
          </h2>
          <div className="flex gap-4 items-center mb-4">
            {ButtonSizes.map((size: any) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <span
                  className={cn(
                    "text-sm",
                    theme === "light" ? "text-black" : "text-white"
                  )}
                >
                  Size: {size}
                </span>
                <Button variant={variant} size={size}>
                  Button Text
                </Button>
              </div>
            ))}
          </div>

          {/* Icon button ButtonVariants */}
          <div className="flex gap-4 items-center w-full">
            {ButtonSizes.map((size: any) => (
              <div
                key={`icon-${size}`}
                className="flex flex-col items-center gap-2"
              >
                <span
                  className={cn(
                    "text-sm",
                    theme === "light" ? "text-black" : "text-white"
                  )}
                >
                  Icon {size}
                </span>
                <Button variant={variant} size={size} buttonType="icon">
                  <i className="ri-add-circle-fill"></i>
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Loading state examples */}
      <div className="mt-8 w-full">
        <h2
          className={cn(
            "text-lg font-semibold mb-4",
            theme === "light" ? "text-black" : "text-white"
          )}
        >
          Loading State
        </h2>
        <div className="flex gap-4">
          {ButtonSizes.map((size: any) => (
            <Button key={size} size={size} is_loading>
              Loading
            </Button>
          ))}
        </div>
      </div>

      {/* Disabled state examples */}
      <div className="mt-8 w-full">
        <h2
          className={cn(
            "text-lg font-semibold mb-4",
            theme === "light" ? "text-black" : "text-white"
          )}
        >
          Disabled State
        </h2>
        <div className="flex gap-4">
          {ButtonSizes.map((size: any) => (
            <Button key={size} size={size} disabled>
              Disabled
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}
