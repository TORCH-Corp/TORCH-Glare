"use client";
import {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { Input } from "./Input";
import { cn } from "./utils";
import { Tooltip, ToolTipSide } from "./Tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { ActionButton } from "./ActionButton";

export interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "variant"> {
  size?: "S" | "M"; // this is used to change the size style of the component
  variant?: "SystemStyle" | "PresentationStyle";
  icon?: ReactNode; // to add left side icon if you pass it
  childrenSide?: ReactNode; // to add action button to the end of the input
  popoverChildren?: ReactNode; // to add drop down list if you pass it
  errorMessage?: string; // to show tooltip component when error_message not null
  onTable?: boolean; // to change the border style of the component when it is on table
  toolTipSide?: ToolTipSide;
}

import { cva } from "class-variance-authority";

export const inputFieldStyles = cva(
  [
    "flex flex-1 min-w-0",
    "flex-col",
    "typography-body-small-regular",
    "border ",
    "transition-all duration-200 ease-in-out",
    "hover:shadow-[0px_1px_6px_0px_rgba(0,0,0,0.30)]",
  ],
  {
    variants: {
      variant: {
        PresentationStyle: [
          "bg-[--background-presentation-form-field-primary]",
          "border-[--border-presentation-action-primary]",
          "hover:bg-[--background-presentation-form-field-hover]",
          "hover:border-[--border-presentation-action-hover]",
          "hover:text-[--content-presentation-action-light-primary]",
        ],
        SystemStyle: [
          "bg-[--black-alpha-20]",
          "text-white",
          "border-[#2C2D2E]",
          "hover:border-[#9748FF]",
          "hover:bg-[--purple-alpha-10]",
        ],
      },
      fucus: {
        true: "",
      },
      onTable: {
        true: ["border-transparent", "bg-transparent", "h-[26px]"],
      },
      error: {
        true: [
          "border-[--border-presentation-state-negative]",
          "caret-[--border-presentation-state-negative]",
          "hover:border-[--border-presentation-state-negative]",
          "hover:caret-[--border-presentation-state-negative]",
        ],
      },
      disabled: {
        true: [
          "border-[--border-presentation-action-disabled]",
          "bg-[--background-presentation-action-disabled]",
          "hover:border-[--border-presentation-action-disabled]",
          "hover:bg-[--background-presentation-action-disabled]",
        ],
      },
      size: {
        S: ["h-[30px]", "rounded-[6px]"],
        M: ["h-[40px]", "rounded-[8px]"],
      },
    },
    defaultVariants: {
      fucus: false,
      disabled: false,
      error: false,
      onTable: false,
      size: "M",
    },
    compoundVariants: [
      {
        fucus: true,
        variant: "PresentationStyle",
        className: [
          "border-[--border-presentation-state-focus]",
          "bg-[--background-presentation-form-field-primary]",
          "shadow-[0px_1px_6px_0px_rgba(0,0,0,0.30)]",
          "hover:border-[--border-presentation-state-focus]",
          "caret-[--border-presentation-state-focus]",
          "hover:caret-[--border-presentation-state-focus]",
        ],
      },
      {
        fucus: true,
        variant: "SystemStyle",
        className: [
          "border-[--border-presentation-state-focus]",
          "shadow-[0px_1px_6px_0px_rgba(0,0,0,0.30)]",
          "hover:border-[--border-presentation-state-focus]",
          "caret-[--border-presentation-state-focus]",
          "hover:caret-[--border-presentation-state-focus]",
        ],
      },
      {
        onTable: true,
        className: ["h-[26px]"],
      },
    ],
  }
);

export const iconContainerStyles = cva(
  [
    "flex items-center justify-center",
    "transition-all duration-200 ease-in-out",
    "leading-0",
    "text-[16px]",
    "text-[--content-presentation-action-light-secondary]",
  ],
  {
    variants: {
      variant: {
        SystemStyle: [""],
        PresentationStyle: [""],
      },
      fucus: {
        true: "",
      },
      size: {
        S: ["text-[16px]"],
        M: ["text-[18px]", "px-[2px]"],
      },
    },
    compoundVariants: [
      {
        variant: "SystemStyle",
        fucus: true,
        className: ["text-white"],
      },
    ],
    defaultVariants: {
      size: "M",
      variant: "PresentationStyle",
    },
  }
);

export const InputField = forwardRef<HTMLInputElement, Props>(
  (
    {
      size = "M",
      icon,
      childrenSide,
      popoverChildren,
      errorMessage,
      onTable,
      variant = "PresentationStyle",
      toolTipSide,
      className,
      ...props
    },
    forwardedRef
  ) => {
    const [fucus, setFucus] = useState(false);
    const [dropDownListWidth, setDropDownListWidth] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (!forwardedRef) return;
      if (typeof forwardedRef === "function") forwardedRef(inputRef.current);
      else forwardedRef.current = inputRef.current;
    }, [forwardedRef]);
    // TODO: make the user input visible when input is focused
    return (
      <Popover open={fucus}>
        <PopoverTrigger asChild>
          <section
            onFocus={(e) => {
              setDropDownListWidth(e.currentTarget.offsetWidth);
              setFucus(true);
              inputRef.current?.focus();
            }}
            className={cn(
              inputFieldStyles({
                variant,
                fucus,
                error: errorMessage !== undefined,
                disabled: props.disabled,
                size: size,
                onTable: onTable,
              }),
              className
            )}
          >
            <Tooltip
              toolTipSide={toolTipSide}
              open={errorMessage !== undefined}
              text={errorMessage}
            >
              <section className="flex flex-1  px-[4px] overflow-hidden relative">
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
                  ref={inputRef}
                  className="group"
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
            variant={variant}
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
