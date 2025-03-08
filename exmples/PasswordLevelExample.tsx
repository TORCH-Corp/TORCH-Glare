import { InputField } from "@/components/InputField";
import { PasswordLevel } from "@/components/PasswordLevel";
import { cn } from "@/utils/cn";
import { useState } from "react";

export default function PasswordLevelExample() {
  const [value, setValue] = useState<any>("");

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          "text-content-system-global-primary"
        )}
      >
        PasswordLevel Preview
      </h1>
      <div className="flex flex-col gap-2 w-full">
        <span
          className={cn(
            "text-sm",
            "text-content-system-global-primary"
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
