import { InputField } from "@/components/base/InputField";
import { PasswordLevel } from "@/components/base/PasswordLevel";
import { cn } from "@/components/base/utils";
import { useTheme } from "@/providers/ThemeProvider";
import { useState } from "react";

export default function PasswordLevelExample() {
  const [value, setValue] = useState<any>("");
  const { theme } = useTheme();

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          theme === "light" ? "text-black" : "text-white"
        )}
      >
        PasswordLevel Preview
      </h1>
      <div className="flex flex-col gap-2 w-full">
        <span
          className={cn(
            "text-sm",
            theme === "light" ? "text-black" : "text-white"
          )}
        ></span>
        <InputField
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter password"
          popoverChildren={<PasswordLevel value={value} />}
        />
      </div>
    </>
  );
}
