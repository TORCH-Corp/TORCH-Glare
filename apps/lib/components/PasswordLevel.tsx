import type { Themes } from "../utils/types";
import { cn } from "../utils/cn"; // Assuming you have a `cn` utility
import { HTMLAttributes, useEffect, useState } from "react";

interface PassCheckProps extends HTMLAttributes<HTMLDivElement> {
  value: string; // The password value to check
  theme?: Themes
}

export function PasswordLevel({ theme, value, className, ...props }: PassCheckProps) {
  const [level, setLevel] = useState<number>(0);

  useEffect(() => {
    const symbolRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const uppercaseRegex = /[A-Z]/;
    let passwordLev = 0;
    if (value.length >= 6) passwordLev++;
    if (symbolRegex.test(value)) passwordLev++;
    if (uppercaseRegex.test(value)) passwordLev++;
    setLevel(passwordLev);
  }, [value]);

  return (
    <div
      data-theme={theme}
      {...props}
      className={cn(
        "bg-background-system-body-secondary rounded-[4px] border border-solid border-border-system-global-primary p-[4px] grid grid-cols-3 gap-[4px] w-full ",
        className
      )}
    >
      <div
        className={cn(
          "h-[4px] rounded-[8px] transition-all duration-300 ease-in-out bg-border-system-global-secondary",
          {
            "bg-border-presentation-state-negative": level >= 1,
          }
        )}
      />
      <div
        className={cn(
          "h-[4px] rounded-[8px] transition-all duration-300 ease-in-out bg-border-system-global-secondary",
          {
            "bg-border-presentation-state-warning": level >= 2,
          }
        )}
      />
      <div
        className={cn(
          "h-[4px] rounded-[8px] transition-all duration-300 ease-in-out bg-border-system-global-secondary",
          {
            "bg-border-presentation-state-success": level >= 3,
          }
        )}
      />
    </div>
  );
}
