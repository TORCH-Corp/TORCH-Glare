"use client";
import {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  useRef,
  useState,
} from "react";
import { cn } from "../utils/cn";
import { Tooltip, ToolTipSide } from "./Tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { Themes } from "../utils/types";
import { Icon, Input, Group, Trilling } from "./Input";
import { useClickOutside } from "@/hooks/useClickOutside";
import { Badge } from "./Badge";
import { Tag, useTagSelection } from "@/hooks/useTagSelection";


interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "variant"> {
  size?: "XS" | "S" | "M"; // this is used to change the size style of the component
  variant?: "SystemStyle" | "PresentationStyle";
  icon?: ReactNode; // to add left side icon if you pass it
  errorMessage?: string; // to show tooltip component when error_message not null
  onTable?: boolean; // to change the border style of the component when it is on table
  toolTipSide?: ToolTipSide;
  label?: string;
  required?: boolean;
  theme?: Themes
  actionButton?: ReactNode
  tags: Tag[]
  onValueChange?: (tags: Tag[]) => void
}


export const BadgeField = forwardRef<HTMLInputElement, Props>(
  (
    {
      size = "M",
      label,
      required,
      icon,
      errorMessage,
      onTable,
      variant = "PresentationStyle",
      toolTipSide,
      className,
      actionButton,
      theme,
      tags,
      onValueChange,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const [dropDownListWidth, setDropDownListWidth] = useState(0);
    const popoverContentRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    // this is used to close the popover when the user clicks outside the input group
    const inputGroupRef = useClickOutside((e) => {
      if (
        !inputGroupRef?.current?.contains(e.target as Node) &&
        !popoverContentRef?.current?.contains(e.target as Node)
      ) setIsPopoverOpen(false);
      else setIsPopoverOpen(true);
    });

    // this is used to handle the tag selection and the search and filter and keyboard navigation functionality
    const {
      selectedTagsStack,
      handleSelectTag,
      handleUnselectTag,
      handleKeyDown,
      setFocusedTagIndex,
      filterTagsBySearch,
      filteredTags,
      focusedTagIndex,
      focusedPopoverIndex,
      isPopoverOpen,
      setIsPopoverOpen,
    } = useTagSelection({ Tags: tags, onTagsChange: onValueChange, inputRef });

    return (
      <Popover open={isPopoverOpen}>
        <Tooltip
          toolTipSide={toolTipSide}
          open={errorMessage !== undefined}
          text={errorMessage}
        >
          <PopoverTrigger asChild
          >
            <Group
              error={errorMessage !== undefined}
              onTable={onTable}
              data-theme={theme}
              variant={variant}
              tabIndex={isPopoverOpen ? 0 : -1}
              onKeyDown={handleKeyDown}
              size={size === "XS" ? "S" : size}
              ref={inputGroupRef}
              onFocus={(e: any) => {
                setDropDownListWidth(e.currentTarget.offsetWidth);
              }}
              className={cn("flex gap-1 flex-row w-full relative p-1 flex-nowrap overflow-hidden justify-end h-fit items-center",
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

              {
                selectedTagsStack.map((tag, index) => (
                  <Badge
                    key={tag.id}
                    size={size}
                    variant={tag.variant as any}
                    label={tag.name}
                    isSelected={true}
                    onUnselect={() => handleUnselectTag(tag.id)}
                    className={focusedTagIndex === index ? "ring-2 ring-blue-500" : ""}
                    tabIndex={focusedTagIndex === index ? 0 : -1}
                  />
                ))
              }

              <Input
                {...props}
                onChange={(e) => {
                  props.onChange?.(e)
                  filterTagsBySearch(e.target.value)
                }}
                onFocus={(e) => {
                  props.onFocus?.(e)
                  setFocusedTagIndex(null);
                  setIsPopoverOpen(true)
                }}
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

        <PopoverContent
          data-theme={theme}
          ref={popoverContentRef}
          style={{ width: dropDownListWidth }}
          variant={variant}
          onKeyDown={handleKeyDown}
        >
          <>
            {filteredTags.length > 0 ? (
              filteredTags.map((tag, index) => (
                <Badge
                  key={tag.id}
                  size={size}
                  variant={tag.variant as any}
                  label={tag.name}
                  onClick={() => handleSelectTag(tag.id)}
                  className={`outline-none  ${focusedPopoverIndex === index ? "ring-2 ring-blue-500" : ""} ${index !== 0 ? "mt-1" : ""}`}
                  tabIndex={focusedPopoverIndex === index ? 0 : -1}
                />
              ))
            ) : (
              <div className="text-sm text-gray-500 py-1 px-2">
                {tags.length === 0 ? "All tags selected" : "No matching tags found"}
              </div>
            )}
          </>
        </PopoverContent>
      </Popover>
    );
  }
);
BadgeField.displayName = "BadgeField";
