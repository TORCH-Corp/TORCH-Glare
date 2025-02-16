import { Textarea } from "@/components/Textarea";
import { cn } from "@/utils/utils";
import { useTheme } from "@/providers/ThemeProvider";
import { useState } from "react";

export default function TextareaExample() {
  const [dir] = useState<any>(["row", "column"]);
  const { theme } = useTheme();

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          theme === "light" ? "text-black" : "text-white"
        )}
      >
        Textarea Preview
      </h1>
      {
        dir.map((e: any) => (
          <div key={e}
            className="flex flex-col gap-2 w-full">

            <span
              className={cn(
                "text-sm",
                theme === "light" ? "text-black" : "text-white"
              )}
            >
              direction: {e}
            </span>

            <Textarea direction={e} label="Label" secondaryLabel="Secondary Label" requiredLabel="Required" />
          </div>
        ))
      }
    </>
  );
}
