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
import { useClickOutside } from "../hooks/useClickOutside";
import { Badge } from "./Badge";
import { Tag, useTagSelection } from "../hooks/useTagSelection";
import { cva } from "class-variance-authority";

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
  theme?: Themes;
  actionButton?: ReactNode;
  tags: Tag[];
  onValueChange?: (tags: Tag[]) => void;
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
        !inputGroupRef?.current?.contains(e?.target as Node) &&
        !popoverContentRef?.current?.contains(e?.target as Node)
      )
        setIsPopoverOpen(false);
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
      searchTags
    } = useTagSelection({
      Tags: tags,
      onTagsChange: (e) => props.onChange?.({
        target: {
          value: e
        }
      } as any),
      inputRef
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
              tabIndex={isPopoverOpen ? 0 : -1}
              onKeyDown={handleKeyDown}
              size={size === "XS" ? "S" : size}
              ref={inputGroupRef as any}
              onFocus={(e: any) => {
                setDropDownListWidth(e.currentTarget.offsetWidth);
              }}
              className={cn(
                "flex gap-1 flex-row w-full relative p-1 flex-nowrap overflow-hidden justify-end  items-center",
                {
                  "flex-wrap justify-start": isPopoverOpen,
                  "h-fit": isPopoverOpen,
                },
                className
              )}
            >
              {icon && <Icon>{icon}</Icon>}

              {selectedTagsStack.map((tag, index) => (
                <Badge
                  key={tag.id}
                  size={size}
                  color={tag.variant as any}
                  label={tag.name}
                  isClosable={true}
                  onClose={() => handleUnselectTag(tag.id)}
                  className={
                    focusedTagIndex === index ? "ring-2 ring-blue-500" : ""
                  }
                  tabIndex={focusedTagIndex === index ? 0 : -1}
                />
              ))}

              <Input
                {...props}
                value={searchTags}
                onChange={(e) => {
                  filterTagsBySearch(e.target.value);
                }}
                onFocus={(e) => {
                  props.onFocus?.(e);
                  setFocusedTagIndex(null);
                  setIsPopoverOpen(true);
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
              {actionButton && (
                <Trilling className="py-0">
                  {/* Keep the ActionButton right aligned */}
                  {actionButton}
                </Trilling>
              )}
            </Group>
          </PopoverTrigger>
        </Tooltip>

        <PopoverContent
          data-theme={theme}
          ref={popoverContentRef}
          style={{ width: dropDownListWidth }}
          variant={variant}
          onKeyDown={handleKeyDown}
          // Reuse the DropdownMenu surface so the list matches the menu design.
          className={cn(menuContentStyles({ variant: "PresentationStyle" }), "p-1")}
        >
          {filteredTags.length > 0 ? (
            filteredTags.map((tag, index) => (
              <button
                type="button"
                key={tag.id}
                onClick={() => handleSelectTag(tag.id)}
                data-highlighted={focusedPopoverIndex === index ? "" : undefined}
                tabIndex={focusedPopoverIndex === index ? 0 : -1}
                className={cn(
                  MenuItemStyles({ variant: "Default", size: "M" }),
                  "w-full"
                )}
              >
                <div>
                  <Badge size={size} color={tag.variant as any} label={tag.name} />
                </div>
              </button>
            ))
          ) : (
            <div className="px-3 py-2 typography-body-small-regular text-content-presentation-global-secondary">
              {tags.length === 0
                ? "All tags selected"
                : "No matching tags found"}
            </div>
          )}
        </PopoverContent>
      </Popover>
    );
  }
);
BadgeField.displayName = "BadgeField";

// Local copies of the menu surface styles so the dropdown list matches the
// DropdownMenu/ContextMenu design (self-contained — no shared module).
const menuContentStyles = cva(
  [
    "p-1",
    "rounded-[14px]",
    "min-w-[240px]",
    "outline-none",
    "overflow-scroll",
    "data-[state=open]:animate-in",
    "data-[state=open]:fade-in-0",
    "overflow-x-hidden",
    "scrollbar-hide",
    "backdrop-blur-[21px]",
    "flex gap-1 flex-col",
  ],
  {
    variants: {
      variant: {
        PresentationStyle: [
          "bg-[rgba(61,64,69,0.72)]",
          "shadow-[0_0_32px_2px_rgba(0,0,0,0.20),0_0_48px_2px_rgba(0,0,0,0.05)]",
        ],
      },
      defaultVariants: {
        variant: "PresentationStyle",
      },
    },
  }
);

const MenuItemStyles = cva(
  [
    "text-content-presentation-global-primary-light typography-body-medium-regular",
    "outline-none",
    "border",
    "border-transparent",
    "flex",
    "items-center",
    "justify-start",
    "text-overflow",
    "overflow-hidden",
    "p-[2px]",
    "transition-all",
    "bg-[rgba(184,192,204,0.36)]",
    "ease-in-out",
    "duration-300",
    "[&>div]:flex",
    "[&>div]:px-[12px]",
    "[&>div]:py-[4px]",
    "[&>div]:gap-2",
    "[&>div]:w-full",
    "[&>div]:rounded-[8px]",
    "[&>div]:items-center ",
    "group",
  ],
  {
    variants: {
      variant: {
        Default: [
          "text-content-presentation-global-primary-light",
          "[&>div]:hover:bg-white-50 [&>div]:hover:shadow-[0_0_16px_0_rgba(0,0,0,0.36)]",
          "[&>div]:hover:text-black-1000",
          "[&[data-highlighted]>div]:bg-white-alpha-75",
          "[&[data-highlighted]>div]:text-black-1000",
        ],
      },
      size: {
        S: ["typography-body-small-regular", "h-[24px]"],
        M: ["typography-body-medium-regular", "h-[32px]"],
      },
      defaultVariants: {
        variant: "Default",
        size: "M",
      },
    },
  }
);
