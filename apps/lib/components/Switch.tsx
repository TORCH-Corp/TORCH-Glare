'use client'
import { cn } from "../utils/cn";
import * as SwitchPrimitives from "@radix-ui/react-switch"
import React from "react";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex w-[48px] h-[28px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-background-presentation-switcher-active data-[state=unchecked]:bg-background-presentation-switcher-disabled",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block w-[24px] h-[24px] rounded-full bg-background-presentation-switcher-knob shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }



/* interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
  activeLabel?: string;
  disabledLabel?: string;
  theme?: "dark" | "light" | "default";
}

function Switchers({
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
} */