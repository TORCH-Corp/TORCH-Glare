import { Button } from "@/components/Button";
import { cn } from "@/utils/cn";
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
  const [ButtonSizes] = useState<any>(["S", "M", "L", "XL"]);


  return (
    <>
      <h1
        className={cn("text-xl font-bold", {
          "text-content-system-global-primary": true

        })}
      >
        Button Variants Preview
      </h1>

      {ButtonButtonVariants.map((variant: any) => (
        <div key={variant} className="mb-8 w-full">
          <h2
            className={cn(
              "text-lg font-semibold mb-4",
              "text-content-system-global-primary"
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
                    "text-content-system-global-primary"
                  )}
                >
                  Size: {size}
                </span>
                <Button variant={variant} size={size}>
                  Button
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
                    "text-content-system-global-primary"
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
            "text-content-system-global-primary"
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
            "text-content-system-global-primary"
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
