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
import { cn } from "../utils/cn";
import { Tooltip, ToolTipSide } from "./Tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { cva } from "class-variance-authority";
import { LabelLessSection } from "./LabelLessInput";
import { Themes } from "../utils/types";

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
  theme?: Themes
}

export const inputFieldStyles = cva(
  [
    // Base styles
    'flex',
    'flex-1',
    'flex-col',
    'items-center',
    'overflow-hidden',
    'justify-center',
    'typography-body-small-regular',
    'border',
    'transition-[background,background-color,color,border,box-shadow] duration-100 ease-in-out', // Simplified transition property
    'hover:shadow-[0px_1px_6px_0px_rgba(0,0,0,0.30)]',
  ],
  {
    variants: {
      variant: {
        PresentationStyle: [
          'border-border-presentation-action-primary',
          'bg-background-presentation-form-field-primary',
          'hover:bg-background-presentation-form-field-hover',
          'hover:border-border-presentation-action-hover',
          'hover:text-content-presentation-action-light-primary',
          'hover:caret-content-presentation-action-information-hover',
        ],
        SystemStyle: [
          'border-border-system-global-secondary',
          'bg-background-presentation-form-field-primary',
          'hover:border-[#9748FF]',
          'hover:bg-purple-alpha-10',
        ],
      },
      focus: {
        true: [
          'border-border-presentation-state-focus',
          'bg-background-presentation-form-field-primary',
          'shadow-[0px_1px_6px_0px_rgba(0,0,0,0.30)]',
          'hover:border-border-presentation-state-focus',
          'caret-border-presentation-state-focus',
          'hover:caret-border-presentation-state-focus',
        ],
      },
      onTable: {
        true: ['border-transparent', 'bg-transparent', 'h-[26px]'], // Combined onTable styles
      },
      error: {
        true: [
          'border-border-presentation-state-negative',
          'caret-border-presentation-state-negative',
          'hover:border-border-presentation-state-negative',
          'hover:caret-border-presentation-state-negative',
        ],
      },
      disabled: {
        true: [
          'border-border-presentation-action-disabled',
          'bg-background-presentation-action-disabled',
          'hover:border-border-presentation-action-disabled', // Added hover styles for disabled state
          'hover:bg-background-presentation-action-disabled',  // Added hover styles for disabled state
        ],
      },
      size: {
        XS: ['rounded-[6px]'],
        S: ['rounded-[6px]'],
        M: ['rounded-[8px]'],
      },
    },
    defaultVariants: {
      focus: false,
      disabled: false,
      error: false,
      onTable: false,
      size: 'M',
      variant: 'PresentationStyle', // added default variant
    },
  }
);



export const iconContainerStyles = cva(
  [
    "flex items-center justify-center",
    "transition-[background,background-color,border] duration-200 ease-in-out",
    "leading-none",
    "text-[16px]",
    "text-content-presentation-action-light-secondary",
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
      theme, ...props
    },
    forwardedRef
  ) => {
    const [fucus, setFucus] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const [dropDownListWidth, setDropDownListWidth] = useState(0);

    useEffect(() => {
      if (!forwardedRef) return;
      if (typeof forwardedRef === "function") forwardedRef(inputRef.current);
      else forwardedRef.current = inputRef.current;
    }, [forwardedRef]);

    useEffect(() => {
      const handleOutsideClick = (event: MouseEvent) => {
        if (
          sectionRef.current &&
          !sectionRef.current.contains(event.target as Node) &&
          !popoverRef.current?.contains(event.target as Node)
        ) {
          setFucus(false);
        } else {
          setFucus(true);
          inputRef.current?.focus();
        }
      };

      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("pointerdown", handleOutsideClick);
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
        document.removeEventListener("pointerdown", handleOutsideClick);
      };
    }, []);

    return (
      <Popover open={fucus}>
        <PopoverTrigger asChild>
          <section
            data-theme={theme}
            ref={sectionRef}
            onFocus={(e: any) => {
              setDropDownListWidth(e.currentTarget.offsetWidth);
            }}
            className={cn(
              inputFieldStyles({
                variant: variant,
                focus: fucus,
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
                      {icon}
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
                  onFocus={() => setFucus(true)}
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
            data-theme={theme}
            ref={popoverRef}
            style={{ width: dropDownListWidth }}
            onOpenAutoFocus={(e: any) => e.preventDefault()}
            variant={variant}
          >
            {popoverChildren}
          </PopoverContent>
        )}
      </Popover>
    );
  }
);

BadgeField.displayName = "BadgeField";
