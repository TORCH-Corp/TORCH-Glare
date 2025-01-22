import { ActionButton } from "@/components/base/ActionButton";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/ThemeProvider";
import { useState } from "react";

export default function ActionButtonExample() {
  const [sizes] = useState<any>(["XS", "S", "M"]);
  const { theme } = useTheme();

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          theme === "light" ? "text-black" : "text-white"
        )}
      >
        Action Button Preview
      </h1>
      {sizes.map((size: any) => (
        <div key={size} className="flex flex-col gap-2 w-full">
          <span
            className={cn(
              "text-sm",
              theme === "light" ? "text-black" : "text-white"
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
