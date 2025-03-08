import { Badge } from "@/components/Badge";
import { cn } from "@/utils/cn";
import { useState } from "react";

export function BadgeExample() {
  const [variants] = useState<any>(["green", "greenLight", "cocktailGreen", "yellow", 'redOrange', 'redLight', 'rose', 'purple', 'bluePurple', 'blue', 'navy', 'gray']);

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          "text-content-system-global-primary"
        )}
      >
        Badge Preview
      </h1>
      {variants.map((variant: any) => (
        <div key={variant} className="flex flex-col gap-2 w-full">
          <span
            className={cn(
              "text-sm",
              "text-content-system-global-primary"
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
