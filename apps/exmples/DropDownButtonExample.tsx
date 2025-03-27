import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import { cn } from "@/utils/cn";
import { useState } from "react";

export default function SelectExample() {
  const [ButtonSizes] = useState<any>(["S", "M", "L", "XL"]);

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          "text-content-system-global-primary"
        )}
      >
        Select Preview
      </h1>
      <div className="flex flex-col gap-8 w-full">
        {ButtonSizes.map((size: any) => (
          <div key={size}>
            <p className="text-lg font-semibold my-2">Size: {size}</p>
            <Select key={size}>
              <SelectTrigger size={size}>
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">
                  Blueberry
                </SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">
                  Pineapple
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </>
  );
}
