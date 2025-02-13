import { Button } from "@/components/base/Button";
import ButtonField from "@/components/base/ButtonField";
import { cn } from "@/components/base/utils";
import { useTheme } from "@/providers/ThemeProvider";
import { useState } from "react";

export function ButtonFieldExample() {
  const [variants] = useState<any>([true, false]);
  const { theme } = useTheme();

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          theme === "light" ? "text-black" : "text-white"
        )}
      >
        ButtonField Preview
      </h1>
      {variants.map((variant: any) => (
        <div key={variant} className="flex flex-col gap-2 w-full">
          <span
            className={cn(
              "text-sm",
              theme === "light" ? "text-black" : "text-white"
            )}
          >
            {variant ? "With Divider" : "Without Divider"}
          </span>
          <div className="flex gap-2 items-start">
            <ButtonField withDivider={variant} >
              <Button>OPTION 1</Button>
              <Button>OPTION 2</Button>
              <Button>OPTION 3</Button>
            </ButtonField>
          </div>
        </div>
      ))}
    </>
  );
}
