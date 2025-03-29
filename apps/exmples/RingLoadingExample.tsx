import { SpinLoading } from "@/components/SpinLoading";
import { cn } from "@/utils/cn";
import { useState } from "react";

export default function RingLoadingExample() {
  const [sizes] = useState<any>(["S", "M", "L"]);

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          "text-content-system-global-primary"
        )}
      >
        RingLoading Preview
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
          <SpinLoading size={size}>
            <span
              className={cn(
                "text-sm",
                "text-content-system-global-primary"
              )}
            >
              But Anything Here
            </span>
          </SpinLoading>
        </div>
      ))}
    </>
  );
}
