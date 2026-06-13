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
  addLabel?: string
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
      addLabel = "add",
      dir,
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
              dir={dir}
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
          dir={dir}
          data-theme={theme}
          ref={popoverContentRef}
          style={{ width: dropDownListWidth }}
          variant={variant}
          onKeyDown={handleKeyDown}
          className={cn(menuContentContinerStyles({ variant: "PresentationStyle" }), "p-1 rounded-[17px]")}

        // Reuse the DropdownMenu surface so the list matches the menu design.
        >
          <div
            className={cn(menuContentStyles({ variant: "PresentationStyle" }), "p-0")}

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
                    "w-full p-1 shrink-0 h-fit"
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <Badge size={size} badgeStyle={"solid"} color={tag.variant as any} label={tag.name} />

                    <div className="flex group-hover:opacity-100 opacity-0 px-[4px] py-[2px] items-center rounded-[6px] bg-white-50">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" className="rtl:rotate-180" fill="none">
                        <path d="M3.91422 5.49995H10V6.49995H3.91422L6.5962 9.1819L5.8891 9.889L2 5.99995L5.8891 2.11084L6.5962 2.81794L3.91422 5.49995Z" fill="black" />
                      </svg>
                      <p className="text-black-1000 text-right text-[12px] font-[510] leading-[148%]">
                        {addLabel}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-3 py-2 typography-body-small-regular text-white-alpha-75">
                {tags.length === 0
                  ? "All tags selected"
                  : "No matching tags found"}
              </div>
            )} </div>
        </PopoverContent>
      </Popover >
    );
  }
);
BadgeField.displayName = "BadgeField";

// Local copies of the menu surface styles so the dropdown list matches the
// DropdownMenu/ContextMenu design (self-contained — no shared module).
const menuContentStyles = cva(
  [
    "rounded-[10px]",
    "min-w-[240px]",
    "outline-none",
    "overflow-scroll",
    "data-[state=open]:animate-in",
    "data-[state=open]:fade-in-0",
    "overflow-x-hidden",
    "scrollbar-hide",
    "flex gap-[1px] flex-col",
  ],
  {
    variants: {
      variant: {
        PresentationStyle: [
        ],
      },
      defaultVariants: {
        variant: "PresentationStyle",
      },
    },
  }
);
const menuContentContinerStyles = cva(
  [
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
    "transition-all",
    "bg-[rgba(184,192,204,0.36)]",
    "ease-in-out",
    "duration-300",
    "flex",
    "p-1",
    "w-full",
    "items-center ",
    "group",
  ],
  {
    variants: {
      variant: {
        Default: [
          "hover:bg-[rgba(184,192,204,0.50)] ",
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
