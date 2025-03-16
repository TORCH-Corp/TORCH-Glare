import { Button } from "@/components/Button";
import { LabelLessInput } from "@/components/LabelLessInput";
import { PopoverItem } from "@/components/Popover";
import { cn } from "@/utils/cn";
import { useState } from "react";

export default function LabelLessInputExample() {

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
        LabelLessInput Preview
      </h1>

      {/* Loop through sizes and variants */}
      {anotherSizes.map((size: any) => (
        <div key={`${size}-labelLessInput`} className="">
          <h2
            className={cn("text-lg font-semibold", {
              "text-content-system-global-primary": true

            })}
          >
            {`Size: ${size}`}
          </h2>

          {/* Render the LabelLessInput component for each size and variant */}
          <LabelLessInput
            label={`Label`}
            required
            toolTipSide={"top"}
            size={size}
            popoverChildren={
              <PopoverItem variant={"Default"} size={size}>
                Dropdown Content
              </PopoverItem>
            }
            errorMessage={error ? "This is an error message" : undefined}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`labelless input`}
          />
        </div>
      ))}

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
