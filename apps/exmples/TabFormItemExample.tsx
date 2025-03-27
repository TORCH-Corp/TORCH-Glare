import TabFormItem from "@/components/TabFormItem";
import { cn } from "@/utils/cn";
import { useState } from "react";

export function TabFormItemExample() {
  const [variants] = useState<any>(["top", "side"]);

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          "text-content-system-global-primary"
        )}
      >
        TabFormItem Preview
      </h1>
      {variants.map((variant: any) => (
        <div key={variant} className="flex flex-col gap-2 w-full">
          <span
            className={cn(
              "text-sm",
              "text-content-system-global-primary"
            )}
          >
            type: {variant}
          </span>
          <div className="flex flex-col gap-2 items-start">
            <TabFormItem componentType={variant} >Default style</TabFormItem>
            <TabFormItem componentType={variant} active>Active style</TabFormItem>
            <TabFormItem componentType={variant} buttonType={"icon"} ><i className="ri-home-3-line"></i></TabFormItem>
          </div>
        </div>
      ))}
    </>
  );
}
