import { ButtonHTMLAttributes } from "react";
import { cn } from "../utils/cn";
import { Label } from "./Label";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
  activeLabel?: string;
  disabledLabel?: string;
  theme?: "dark" | "light" | "default";
}

export function Switcher({
  active,
  activeLabel,
  disabledLabel,
  theme,
  className,
  ...props
}: Props) {
  return (
    <section data-theme={theme} className={cn("flex justify-center items-center w-fit h-[28px] gap-[6px] overflow-hidden", className)}>
      <button
        {...props}
        className={cn(
          "flex p-[2px] items-center w-[48px] h-[28px] rounded-full bg-background-presentation-switcher-disabled relative transition-all duration-200 overflow-hidden",
          {
            "bg-background-presentation-switcher-active": active,
          }
        )}
      >
        <div
          className={cn(
            "absolute left-[2px] w-[24px] h-[24px] rounded-full bg-background-presentation-switcher-knob shadow-[0px_0px_0px_1px_rgba(0,0,0,0.04),0px_3px_8px_0px_rgba(0,0,0,0.15),0px_3px_1px_0px_rgba(0,0,0,0.06)] transition-all duration-200",
            {
              "left-[22px]": active,
            }
          )}
        />
      </button>

      {activeLabel && (
        <section
          className={cn(
            "flex justify-center items-start flex-col gap-[10px] translate-y-[-15px] transition-all duration-300 ease-in-out",
            {
              "translate-y-[15px]": active,
            }
          )}
        >
          <Label className="h-[20px]" size="M" label={activeLabel} />
          <Label className="h-[20px]" size="M" label={disabledLabel} />
        </section>
      )}
    </section>
  );
}
