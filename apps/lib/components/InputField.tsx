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
import { ActionButton } from "./ActionButton";
import type { Themes } from "../utils/types";
import { Icon, Input, Group, Trilling } from "./Input";

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
  theme?: Themes
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
      variant = "PresentationStyle",
      toolTipSide,
      theme,
      className,
      ...props
    },
    forwardedRef
  ) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [PopoverWidth, setPopoverWidth] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      if (!forwardedRef) return;
      if (typeof forwardedRef === "function") forwardedRef(inputRef.current);
      else forwardedRef.current = inputRef.current;
    }, [forwardedRef]);
    // TODO: make the user input visible when input is focused
    return (
      <Popover onOpenChange={setIsPopoverOpen}>
        <Tooltip
          theme={theme}
          toolTipSide={toolTipSide}
          open={errorMessage !== undefined}
          text={errorMessage}
        >
          <PopoverTrigger ref={triggerRef} asChild>
            <Group
              error={errorMessage !== undefined}
              onTable={onTable}
              size={size}
              variant={variant}
              data-theme={theme}
              onFocus={(e) => {
                setPopoverWidth(e.currentTarget.offsetWidth);
                setIsPopoverOpen(!isPopoverOpen);
                inputRef.current?.focus();
              }}
              className={className}
            >
              {icon && (
                <Icon>
                  {icon}
                </Icon>
              )}
              <Input
                {...props}
                onFocus={(e) => {
                  setIsPopoverOpen(true)
                  props.onFocus?.(e)
                }}
                onBlur={(e) => {
                  setIsPopoverOpen(false)
                  props.onBlur?.(e)
                }}
                ref={inputRef}
              />

              <Trilling >
                {childrenSide}
                {popoverChildren && (
                  <PopoverActionButton size={size} variant={variant} isPopoverOpen={isPopoverOpen} disabled={props.disabled} />
                )}
              </Trilling>
            </Group>
          </PopoverTrigger>
        </Tooltip>


        {
          (popoverChildren && !props.disabled) && (
            <PopoverContent
              theme={theme}
              variant={variant}
              onOpenAutoFocus={(e: any) => e.preventDefault()}
              style={{ width: PopoverWidth }}
              onClick={(e) => {
                triggerRef.current?.click();
              }}
            >
              {popoverChildren}
            </PopoverContent>
          )
        }
      </Popover >
    );
  }
);

InputField.displayName = "InputField";

const PopoverActionButton = ({ size, variant, isPopoverOpen, disabled }: { size: "S" | "M", variant: "SystemStyle" | "PresentationStyle", isPopoverOpen: boolean, disabled?: boolean }) => {
  return (
    <ActionButton disabled={disabled} size={size}>
      <i
        className={cn(
          "ri-arrow-down-s-line",
          "transition-[transform,rotate]",
          "duration-200",
          "ease-in-out",
          { "rotate-180": (isPopoverOpen && !disabled) },
          { "!text-[16px]": size === "S" },
          { "!text-[26px]": size === "M" },
          { "text-white": variant === "SystemStyle" }
        )}
      />
    </ActionButton>
  );
};
