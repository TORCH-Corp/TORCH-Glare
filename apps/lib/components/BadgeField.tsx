"use client";
import {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../utils/cn";
import { Tooltip, ToolTipSide } from "./Tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { Themes } from "../utils/types";
import { Icon, Input, Group, Trilling } from "./Input";

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
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const [dropDownListWidth, setDropDownListWidth] = useState(0);

    useInitialLoad({
      forwardedRef,
      inputRef,
      sectionRef,
      popoverRef,
      setIsPopoverOpen,
    });

    return (
      <Popover open={isPopoverOpen}>
        <Tooltip
          toolTipSide={toolTipSide}
          open={errorMessage !== undefined}
          text={errorMessage}
        >
          <PopoverTrigger asChild>
            <Group
              error={errorMessage !== undefined}
              onTable={onTable}
              data-theme={theme}
              variant={variant}
              size={size === "XS" ? "S" : size}
              ref={sectionRef}
              onFocus={(e: any) => {
                setDropDownListWidth(e.currentTarget.offsetWidth);
                setIsPopoverOpen(true);
              }}
              className={cn(
                [
                  "flex gap-1 flex-row w-full relative p-1",
                  "flex-nowrap",
                  "overflow-hidden justify-end",
                  "h-fit items-center",
                ],
                {
                  "flex-wrap justify-start": isPopoverOpen,
                },
                className
              )}
            >
              {icon && (
                <Icon  >
                  {icon}
                </Icon>
              )}

              {badgesChildren}

              <Input
                {...props}
                onFocus={() => setIsPopoverOpen(true)}
                ref={inputRef}
                className={cn(
                  "min-w-[100px] w-full", // Added w-full to Input
                  {
                    "!h-[18px]": size === "XS",
                    "!h-[22px]": size === "S",
                    "!h-[24px]": size === "M",
                  }
                )}
              />
              {
                actionButton && (
                  <Trilling className="py-0" > {/* Keep the ActionButton right aligned */}
                    {actionButton}
                  </Trilling>
                )
              }
            </Group>
          </PopoverTrigger>
        </Tooltip>

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


const useInitialLoad = ({
  forwardedRef,
  inputRef,
  sectionRef,
  popoverRef,
  setIsPopoverOpen,
}: {
  forwardedRef: React.Ref<HTMLInputElement> | ((instance: HTMLInputElement | null) => void);
  inputRef: React.RefObject<HTMLInputElement | null>;
  sectionRef: React.RefObject<HTMLDivElement | null>;
  popoverRef: React.RefObject<HTMLDivElement | null>;
  setIsPopoverOpen: (value: boolean) => void;
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
        setIsPopoverOpen(false);
      } else {
        setIsPopoverOpen(true);
        inputRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, [sectionRef, popoverRef, setIsPopoverOpen, inputRef]);
};