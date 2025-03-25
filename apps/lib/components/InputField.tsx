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
import { Themes } from "../utils/types";
import { Icon, Input, InputGroup, Trilling } from "./InputGroup";

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
        <Tooltip
          theme={theme}
          toolTipSide={toolTipSide}
          open={errorMessage !== undefined}
          text={errorMessage}
        >
          <PopoverTrigger asChild>
            <div>
              <InputGroup
                size={size}
                data-theme={theme}
                onFocus={(e) => {
                  setDropDownListWidth(e.currentTarget.offsetWidth);
                  setFucus(!fucus);
                  inputRef.current?.focus();
                }}
              >
                {icon && (
                  <Icon>
                    {icon}
                  </Icon>
                )}
                <Input
                  {...props}
                  data-error={errorMessage !== undefined}
                  data-table-input={onTable}
                  onFocus={(e) => {
                    setFucus(true)
                    props.onFocus?.(e)
                  }}
                  onBlur={(e) => {
                    setFucus(false)
                    props.onBlur?.(e)
                  }}
                  variant={variant}
                  size={size}
                  ref={inputRef}
                />

                <Trilling >
                  {childrenSide}
                  {popoverChildren && (
                    <DropDownActionButton size={size} variant={variant} fucus={fucus} />
                  )}
                </Trilling>
              </InputGroup>
            </div>
          </PopoverTrigger>
        </Tooltip>


        {
          popoverChildren && (
            <PopoverContent
              theme={theme}
              variant={variant}
              onOpenAutoFocus={(e: any) => e.preventDefault()}
              style={{ width: dropDownListWidth }}
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




const DropDownActionButton = ({ size, variant, fucus }: { size: "S" | "M", variant: "SystemStyle" | "PresentationStyle", fucus: boolean }) => {
  return (
    <ActionButton size={size}>
      <i
        className={cn(
          "ri-arrow-down-s-line",
          "transition-[transform,rotate]",
          "duration-200",
          "ease-in-out",
          { "rotate-180": fucus },
          { "!text-[16px]": size === "S" },
          { "!text-[26px]": size === "M" },
          { "text-white": variant === "SystemStyle" }
        )}
      />
    </ActionButton>
  );
};
