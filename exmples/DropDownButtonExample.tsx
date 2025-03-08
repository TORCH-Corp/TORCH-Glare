import {
  DropDownButton,
  DropDownButtonContent,
  DropDownButtonItem,
  DropDownButtonTrigger,
  DropDownButtonValue,
} from "@/components/DropDownButton";
import { cn } from "@/utils/cn";
import { useState } from "react";

export default function DropDownButtonExample() {
  const [ButtonSizes] = useState<any>(["S", "M", "L", "XL"]);

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          "text-content-system-global-primary"
        )}
      >
        DropDownButton Preview
      </h1>
      <div className="flex flex-col gap-8 w-full">
        {ButtonSizes.map((size: any) => (
          <div key={size}>
            <p className="text-lg font-semibold my-2">Size: {size}</p>
            <DropDownButton key={size}>
              <DropDownButtonTrigger size={size}>
                <DropDownButtonValue placeholder="Select a fruit" />
              </DropDownButtonTrigger>
              <DropDownButtonContent>
                <DropDownButtonItem value="apple">Apple</DropDownButtonItem>
                <DropDownButtonItem value="banana">Banana</DropDownButtonItem>
                <DropDownButtonItem value="blueberry">
                  Blueberry
                </DropDownButtonItem>
                <DropDownButtonItem value="grapes">Grapes</DropDownButtonItem>
                <DropDownButtonItem value="pineapple">
                  Pineapple
                </DropDownButtonItem>
              </DropDownButtonContent>
            </DropDownButton>
          </div>
        ))}
      </div>
    </>
  );
}
