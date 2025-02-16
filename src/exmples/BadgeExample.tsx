import { Badge } from "@/components/base/Badge";
import { cn } from "@/utils/utils";
import { useTheme } from "@/providers/ThemeProvider";
import { useState } from "react";

export function BadgeExample() {
  const [variants] = useState<any>(["green", "greenLight", "cocktailGreen", "yellow", 'redOrange', 'redLight', 'rose', 'purple', 'bluePurple', 'blue', 'navy', 'gray']);
  const { theme } = useTheme();

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          theme === "light" ? "text-black" : "text-white"
        )}
      >
        Badge Preview
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
          <div className="flex gap-2 items-start">
            <Badge label={`${variant} size: XS`} variant={variant} size={"XS"} isSelected />
            <Badge label={`${variant} size: S`} variant={variant} size="S" isSelected />
            <Badge label={`${variant} size: M`} variant={variant} size="M" isSelected />
          </div>
        </div>
      ))}
    </>
  );
}
