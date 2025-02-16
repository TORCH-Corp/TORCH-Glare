import Alert from "@/components/base/Alert";
import { cn } from "@/utils/utils";
import { useTheme } from "@/providers/ThemeProvider";
import { useState } from "react";

export function AlertExample() {
  const [variants] = useState<any>(["info", "warning", "error", "success"]);
  const { theme } = useTheme();

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          theme === "light" ? "text-black" : "text-white"
        )}
      >
        Alert Preview
      </h1>
      {variants.map((variant: any) => (
        <div key={variant} className="flex flex-col gap-2 w-full">
          <span
            className={cn(
              "text-sm",
              theme === "light" ? "text-black" : "text-white"
            )}
          >
            Variant: {variant}
          </span>
          <Alert
            label={`Alert with variant: ${variant}`}
            state={variant}
          ></Alert>
        </div>
      ))}
    </>
  );
}
