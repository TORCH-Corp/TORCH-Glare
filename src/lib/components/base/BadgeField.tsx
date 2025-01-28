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
import { cva } from "class-variance-authority";
import { LabelLessSection } from "./LabelLessInput";

export interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "variant"> {
  size?: "XS" | "S" | "M"; // this is used to change the size style of the component
  variant?: "SystemStyle" | "PresentationStyle";
  icon?: ReactNode; // to add left side icon if you pass it
  popoverChildren?: ReactNode; // to add drop down list if you pass it
  errorMessage?: string; // to show tooltip component when error_message not null
  onTable?: boolean; // to change the border style of the component when it is on table
  toolTipSide?: ToolTipSide;
  badgesChildren?: ReactNode;
  label?: string;
  required?: boolean;
}

export const inputFieldStyles = cva(
  [
    "flex ",
    "flex-1",
    "flex-col",
    "items-center",
    "overflow-hidden",
    "justify-center",
    "typography-body-small-regular",
    "border border-[--border-presentation-action-primary]",
    "bg-[--background-presentation-form-field-primary]",
    "transition-[background,background-color,color,border,box-shadow] duration-100 ease-in-out",
    "hover:shadow-[0px_1px_6px_0px_rgba(0,0,0,0.30)]",
    "hover:bg-[--background-presentation-form-field-hover]",
    "hover:border-[--border-presentation-action-hover]",
    "hover:text-[--content-presentation-action-light-primary]",
    "hover:caret-[--content-presentation-action-information-hover]",
  ],
  {
    variants: {
      variant: {
        PresentationStyle: [""],
        SystemStyle: [
          "border-[--border-system-global-secondary]",
          "bg-[--background-presentation-form-field-primary]",
          "hover:border-[#9748FF]",
          "hover:bg-[--purple-alpha-10]",
        ],
      },
      fucus: {
        true: [
          "border-[--border-presentation-state-focus]",
          "bg-[--background-presentation-form-field-primary]",
          "shadow-[0px_1px_6px_0px_rgba(0,0,0,0.30)]",
          "hover:border-[--border-presentation-state-focus]",
          "caret-[--border-presentation-state-focus]",
          "hover:caret-[--border-presentation-state-focus]",
        ],
      },
      onTable: {
        true: ["border-transparent", "bg-transparent"],
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
        ],
      },
      size: {
        XS: ["rounded-[6px]"],
        S: ["rounded-[6px]"],
        M: ["rounded-[8px]"],
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
        disabled: true,
        className: [
          "border-[--border-presentation-action-disabled]",
          "bg-[--background-presentation-action-disabled]",
          "hover:border-[--border-presentation-action-disabled]",
          "hover:bg-[--background-presentation-action-disabled]",
        ],
      },
      {
        onTable: true,
        className: ["h-[26px]"],
      },
      {
        variant: "PresentationStyle",
        fucus: true,
      },
    ],
  }
);

export const iconContainerStyles = cva(
  [
    "flex items-center justify-center",
    "transition-[background,background-color,border] duration-200 ease-in-out",
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
        XS: ["text-[16px]"],
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

export const BadgeField = forwardRef<HTMLInputElement, Props>(
  (
    {
      size = "M",
      label,
      required,
      icon,
      popoverChildren,
      errorMessage,
      onTable,
      variant = "PresentationStyle",
      toolTipSide,
      className,
      badgesChildren,
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
            onContextMenu={(e) => e.stopPropagation()}
            onClick={(e) => {
              setDropDownListWidth(e.currentTarget.offsetWidth);
              setFucus(true);
              inputRef.current?.focus();
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
              <section
                className={cn(
                  [
                    "gap-1 w-full ",
                    " flex flex-row ",
                    "overflow-hidden",
                    "px-[4px] ",
                  ],
                  {
                    "content-start flex-wrap": fucus,
                    "justify-start items-center ": !fucus,
                    "[mask-image:linear-gradient(to_right,black_0%,black_0%,black_85%,transparent_100%)] rtl:[mask-image:linear-gradient(to_left,black_0%,black_0%,black_85%,transparent_100%)]":
                      !fucus,
                    "pl-2 rtl:pr-2 rtl:pl-1": size === "M" && !label,
                  },

                  {
                    "py-[4px]":
                      (fucus && size === "S") || (fucus && size === "XS"),
                    "py-[7px]": fucus && size === "M",
                  }
                )}
              >
                {icon ||
                  (label && (
                    <div
                      className={cn(
                        iconContainerStyles({
                          size: size,
                          variant: variant,
                          fucus: fucus,
                        })
                      )}
                    >
                      {!label && icon ? icon : null}
                      <LabelLessSection
                        fucus={fucus}
                        label={label}
                        required={required}
                      />
                    </div>
                  ))}

                {badgesChildren}

                <Input
                  {...props}
                  variant={variant}
                  focusSetter={setFucus}
                  ref={inputRef}
                  size={size}
                  className={cn(
                    "group p-0 flex-1 min-w-[100px] transition-none",
                    {
                      "h-[18px]": fucus && size === "XS",
                      "h-[22px]": fucus && size === "S",
                      "h-[26px]": fucus && size === "M",
                    }
                  )}
                />
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

BadgeField.displayName = "BadgeField";
