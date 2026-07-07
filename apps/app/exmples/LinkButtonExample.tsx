import { LinkButton } from "@/components/LinkButton";
import { cn } from "@/utils/cn";
import { useState } from "react";

export default function LinkButtonExample() {
  const [sizes] = useState<("S" | "M")[]>(["S", "M"]);

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          "text-content-system-global-primary"
        )}
      >
        LinkButton Preview
      </h1>
      {sizes.map((size) => (
        <div key={size} className="flex flex-col gap-2 w-full">
          <span
            className={cn(
              "text-sm",
              "text-content-system-global-primary"
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
