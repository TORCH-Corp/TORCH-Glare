import { LinkButton } from "@/components/base/LinkButton";
import { cn } from "@/utils/utils";
import { useTheme } from "@/providers/ThemeProvider";
import { useState } from "react";

export default function LinkButtonExample() {
  const [sizes] = useState<any>(["S", "M"]);
  const { theme } = useTheme();

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          theme === "light" ? "text-black" : "text-white"
        )}
      >
        LinkButton Preview
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
          <LinkButton size={size}>
            {size === "S" ? "Small Link" : "Medium Link"}
          </LinkButton>
        </div>
      ))}
    </>
  );
}
