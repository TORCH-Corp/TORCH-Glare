import { Switcher } from "@/components/base/Switcher";
import { cn } from "@/utils/utils";
import { useTheme } from "@/providers/ThemeProvider";
import { useState } from "react";

export default function SwitcherExample() {
  const [isActive, setISActive] = useState<any>(false);
  const { theme } = useTheme();

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          theme === "light" ? "text-black" : "text-white"
        )}
      >
        Switcher Preview
      </h1>
      <div className="flex flex-col gap-2 w-full">
        <Switcher onClick={() => setISActive(!isActive)} active={isActive} activeLabel="ON" disabledLabel="OFF">
        </Switcher>
      </div>
    </>
  );
}
