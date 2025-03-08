import { ActionButton } from "@/components/ActionButton";
import { cn } from "@/utils/cn";
import { useState } from "react";

export default function ActionButtonExample() {
  const [sizes] = useState<any>(["XS", "S", "M"]);

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          "text-content-system-global-primary"
        )}
      >
        Action Button Preview
      </h1>
      {sizes.map((size: any) => (
        <div key={size} className="flex flex-col gap-2 w-full">
          <span
            className={cn(
              "text-sm",
              "text-content-system-global-primary"
            )}
          >
            Size: {size}
          </span>
          <ActionButton size={size}>
            <i className="ri-add-circle-fill"></i>
          </ActionButton>
        </div>
      ))}
    </>
  );
}
