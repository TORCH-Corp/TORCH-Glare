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
  actionButton?: ReactNode
}

export const mainContainerStyles = cva(
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
    'leading-none'
  ],
  {
    variants: {
      variant: {
        PresentationStyle: [
          'text-content-presentation-action-light-primary',
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
          'hover:border-border-presentation-action-disabled',
          'hover:bg-background-presentation-action-disabled',
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
      actionButton,
      theme,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const [fucus, setFucus] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const [dropDownListWidth, setDropDownListWidth] = useState(0);

    useInitialLoad({
      forwardedRef,
      inputRef,
      sectionRef,
      popoverRef,
      setFucus,
    });

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
              mainContainerStyles({
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
                    "gap-1 w-full relative",
                    "flex flex-row flex-nowrap",
                    "overflow-hidden justify-end",
                    "p-[4px] h-fit items-center",
                  ],
                  {
                    "flex-wrap justify-start": fucus,
                  }
                )}
              >
                {icon && (
                  <BadgeIconContainer size={size} variant={variant}>
                    {icon}
                  </BadgeIconContainer>
                )}

                {badgesChildren}

                <div className="flex-1"> {/* Add a flex-1 container for Input */}
                  <Input
                    {...props}
                    variant={variant}
                    onFocus={() => setFucus(true)}
                    ref={inputRef}
                    size={size}
                    className={cn(
                      "p-0 min-w-[100px] w-full", // Added w-full to Input
                      {
                        "h-[18px]": size === "XS",
                        "h-[22px]": size === "S",
                        "h-[26px]": size === "M",
                      }
                    )}
                  />
                </div>

                {
                  actionButton && (
                    <div > {/* Keep the ActionButton right aligned */}
                      {actionButton}
                    </div>
                  )
                }
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


const BadgeIconContainer = ({ children, size = "M", variant = "PresentationStyle" }: Props) => {
  return (
    <div data-role="icon" className={cn(["flex items-center justify-center",
      "transition-all duration-200 ease-in-out",
      "leading-none",
      "text-[16px]",
      "text-content-presentation-action-light-secondary"],
      {
        "text-white": variant === "SystemStyle",
        "text-[16px]": size === "S" || size === "XS",
        "text-[18px] px-[2px]": size === "M",
      }
    )}>
      {children}
    </div>
  )
}


const useInitialLoad = ({
  forwardedRef,
  inputRef,
  sectionRef,
  popoverRef,
  setFucus,
}: {
  forwardedRef: React.Ref<HTMLInputElement> | ((instance: HTMLInputElement | null) => void);
  inputRef: React.RefObject<HTMLInputElement | null>;
  sectionRef: React.RefObject<HTMLDivElement | null>;
  popoverRef: React.RefObject<HTMLDivElement | null>;
  setFucus: (value: boolean) => void;
}) => {

  // set the reference
  useEffect(() => {
    if (!forwardedRef) return;
    if (typeof forwardedRef === "function") {
      forwardedRef(inputRef.current);
    } else {
      forwardedRef.current = inputRef.current;
    }
  }, [forwardedRef, inputRef]);


  // detect click outside
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
  }, [sectionRef, popoverRef, setFucus, inputRef]);
};