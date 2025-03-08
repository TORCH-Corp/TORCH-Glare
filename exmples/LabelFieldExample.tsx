import { Button } from "@/components/Button";
import { LabelField } from "@/components/LabelField";
import { PopoverItem } from "@/components/Popover";
import { cn } from "@/utils/cn";
import { useState } from "react";

export default function LabelFieldExample() {
  const mockIcons = [
    <i className="ri-user-line"></i>,
    <i className="ri-search-line"></i>,
  ];
  const [anotherSizes] = useState<any>(["S", "M"]);
  const [error, setError] = useState(false);
  const [value, setValue] = useState("");

  return (
    <>
      <h1
        className={cn("text-2xl", {
          "text-content-system-global-primary": true

        })}
      >
        LabelField Preview
      </h1>

      {/* Loop through variants and sizes */}
      {anotherSizes.map((size: any) => (
        <div key={`${size}-labelField`} className="">
          <h2
            className={cn("text-lg font-semibold", {
              "text-content-system-global-primary": true

            })}
          >{`Size: ${size}`}</h2>
          <LabelField
            label={`Label`}
            secondaryLabel={`Secondary Label`}
            requiredLabel={`Required`}
            size={size}
            variant={"PresentationStyle"}
            icon={mockIcons[0]}
            popoverChildren={
              <PopoverItem variant={"Default"} size={size}>
                Dropdown Content
              </PopoverItem>
            }
            errorMessage={error ? "This is an error message" : undefined}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Label Placeholder`}
          />
        </div>
      ))}

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
