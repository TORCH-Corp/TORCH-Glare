"use client";
import { forwardRef, InputHTMLAttributes, ReactNode, useState } from "react";
import { Input } from "./Input";
import { iconContainerStyles, inputFieldStyles } from "./variants";
import { cn } from "../utils";
import { Tooltip, ToolTipSide } from "../tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { ActionButton } from "../actionButton";

export interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "variant"> {
  size?: "S" | "M"; // this is used to change the size style of the component
  variant?: "SystemStyle";
  icon?: ReactNode; // to add left side icon if you pass it
  childrenSide?: ReactNode; // to add action button to the end of the input
  popoverChildren?: ReactNode; // to add drop down list if you pass it
  errorMessage?: string; // to show tooltip component when error_message not null
  onTable?: boolean; // to change the border style of the component when it is on table
  toolTipSide?: ToolTipSide;
}

export const InputField = forwardRef<HTMLInputElement, Props>(
  (
    {
      size = "M",
      icon,
      childrenSide,
      popoverChildren,
      errorMessage,
      onTable,
      variant,
      toolTipSide = "left",
      className,
      ...props
    },
    ref
  ) => {
    const [fucus, setFucus] = useState(false);
    const [dropDownListWidth, setDropDownListWidth] = useState(0);

    // TODO: make the user input visible when input is focused

    return (
      <Popover open={fucus}>
        <PopoverTrigger asChild>
          <section
            onContextMenu={(e) => e.stopPropagation()}
            onFocus={(e) => {
              setDropDownListWidth(e.currentTarget.offsetWidth);
              setFucus(true);
            }}
            className={cn(
              inputFieldStyles({
                variant: variant,
                fucus,
                error: errorMessage !== undefined,
                disabled: props.disabled,
                size: size,
                onTable: onTable,
              })
            )}
          >
            <Tooltip
              toolTipSide={toolTipSide}
              open={errorMessage !== undefined}
              text={errorMessage}
            >
              <section className="flex flex-row flex-1 px-[4px] overflow-hidden relative">
                {icon && (
                  <div
                    className={cn(
                      iconContainerStyles({
                        size: size,
                        variant: variant,
                        fucus: fucus,
                      })
                    )}
                  >
                    {icon}
                  </div>
                )}
                <Input
                  {...props}
                  variant={variant}
                  focusSetter={setFucus}
                  size={size}
                  ref={ref}
                />

                <div
                  className={cn(
                    "flex items-center justify-center h-full gap-1 py-1"
                  )}
                >
                  {childrenSide}
                  {popoverChildren && (
                    <ActionButton asChild size={onTable ? "XS" : size}>
                      <i>
                        <i
                          className={cn(
                            "ri-arrow-down-s-line",
                            "transition-[transform]",
                            "duration-400",
                            "ease-in-out",
                            { "rotate-180": fucus },
                            { "text-[16px]": size === "S" || onTable },
                            { "text-[26px]": size === "M" && !onTable },
                            { "text-white": variant === "SystemStyle" }
                          )}
                        />
                      </i>
                    </ActionButton>
                  )}
                </div>
              </section>
            </Tooltip>
          </section>
        </PopoverTrigger>

        {popoverChildren && (
          <PopoverContent
            onOpenAutoFocus={(e: any) => e.preventDefault()}
            onFocus={() => setFucus(true)}
            onBlur={() => setFucus(false)}
            variant="SystemStyle"
            style={{ width: dropDownListWidth }}
          >
            {popoverChildren}
          </PopoverContent>
        )}
      </Popover>
    );
  }
);

InputField.displayName = "InputField";
