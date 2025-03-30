import { Switch } from "@/components/Switch";
import { cn } from "@/utils/cn";
import { useState } from "react";

export default function SwitcherExample() {
  const [isActive, setISActive] = useState<any>(false);

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          "text-content-system-global-primary"
        )}
      >
        Switcher Preview
      </h1>
      <div className="flex flex-col gap-2 w-full">
        <Switch
          checked={isActive}
          onCheckedChange={setISActive}
        >
        </Switch>
      </div>
    </>
  );
}
