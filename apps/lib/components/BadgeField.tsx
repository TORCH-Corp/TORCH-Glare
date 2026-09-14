"use client";
import {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  useRef,
  useState,
  ChangeEvent,
  FocusEvent,
} from "react";
import { cn } from "../utils/cn";
import { ToolTipSide } from "./Tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { Themes } from "../utils/types";
import { Icon, Input, Group, Trilling } from "./Input";
import { useClickOutside } from "../hooks/useClickOutside";
import { Badge, badgeStyles } from "./Badge";
import { Tag, useTagSelection } from "../hooks/useTagSelection";
import { cva, type VariantProps } from "class-variance-authority";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "variant"> {
  size?: "XS" | "S" | "M"; // this is used to change the size style of the component
  variant?: "SystemStyle" | "PresentationStyle";
  icon?: ReactNode; // to add left side icon if you pass it
  /** Marks the field invalid: any non-undefined value turns on the negative border. */
  errorMessage?: string;
  onTable?: boolean; // to change the border style of the component when it is on table
  /**
   * @deprecated Ignored. The error tooltip was removed — an invalid field is shown by its negative
   * border alone. Kept so existing call sites keep compiling; it will go in a future major.
   */
  toolTipSide?: ToolTipSide;
  label?: string;
  required?: boolean;
  theme?: Themes;
  actionButton?: ReactNode;
  tags: Tag[];
  onValueChange?: (tags: Tag[]) => void;
  addLabel?: string;
  /**
   * LOCAL PATCH (Contact Center): let the user TYPE a value and have it become a selected badge,
   * rather than only picking from `tags`. Enter or comma commits what is in the box; Backspace on
   * an empty box removes the last badge. This is what makes a free-text list (emails, aliases,
   * tags) expressible as a badge field instead of a one-column table.
   */
  creatable?: boolean;
  /** Label for the "create this text" row. Receives the typed text. */
  createLabel?: (value: string) => string;
}

export const BadgeField = forwardRef<HTMLInputElement, Props>(
  ({
    size = "M",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- excluded from {...props} spread
    label,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- excluded from {...props} spread
    required,
    icon,
    errorMessage,
    onTable,
    variant = "PresentationStyle",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- deprecated no-op, destructured to keep it out of the {...props} spread
    toolTipSide,
    className,
    actionButton,
    theme,
    tags,
    addLabel = "add",
    creatable = false,
    createLabel = (value: string) => `Create "${value}"`,
    dir,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- excluded from {...props} spread
    children,
    onValueChange,
    ...props
  }) => {
    const [dropDownListWidth, setDropDownListWidth] = useState(0);
    const popoverContentRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    // this is used to close the popover when the user clicks outside the input group
    const inputGroupRef = useClickOutside<HTMLDivElement>((e) => {
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
      handleCreateTag,
      handleKeyDown,
      setFocusedTagIndex,
      filterTagsBySearch,
      filteredTags,
      focusedTagIndex,
      focusedPopoverIndex,
      isPopoverOpen,
      setIsPopoverOpen,
      searchTags,
    } = useTagSelection({
      Tags: tags,
      creatable,
      onTagsChange: (e) => {
        // Native onChange keeps the event-shaped API (Tag[] in target.value)
        // for react-hook-form / Controller; onValueChange is the typed, direct
        // callback consumers and the docs use.
        props.onChange?.({
          target: {
            value: e,
          },
        } as unknown as ChangeEvent<HTMLInputElement>);
        onValueChange?.(e);
      },
      inputRef,
    });

    // LOCAL PATCH (Contact Center): offer the typed text as a new badge, unless it already exists
    // (selected or listed) — in which case the normal rows already cover it.
    const typedValue = searchTags.trim();
    const alreadyExists = [...selectedTagsStack, ...filteredTags].some(
      (tag) => tag.name.toLowerCase() === typedValue.toLowerCase(),
    );
    const showCreateRow = creatable && typedValue !== "" && !alreadyExists;

    return (
      <Popover open={isPopoverOpen}>
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
            ref={inputGroupRef}
            onFocus={(e: FocusEvent<HTMLDivElement>) => {
              setDropDownListWidth(e.currentTarget.offsetWidth);
            }}
            className={cn(
              "flex gap-1 flex-row w-full relative p-1 flex-nowrap overflow-hidden justify-end  items-center",
              {
                "flex-wrap justify-start": isPopoverOpen,
                "h-fit": isPopoverOpen,
              },
              className,
            )}
          >
            {icon && <Icon>{icon}</Icon>}

            {selectedTagsStack.map((tag, index) => (
              <Badge
                key={tag.id}
                size={size}
                color={tag.variant as VariantProps<typeof badgeStyles>["color"]}
                label={tag.name}
                isClosable={true}
                onClose={() => handleUnselectTag(tag.id)}
                className={focusedTagIndex === index ? "ring-2 ring-blue-500" : ""}
                tabIndex={focusedTagIndex === index ? 0 : -1}
              />
            ))}

            <Input
              {...props}
              value={searchTags}
              onChange={(e) => {
                filterTagsBySearch(e.target.value);
              }}
              // LOCAL PATCH (Contact Center): commit typed text as a badge. Handled here rather
              // than in the Group's `handleKeyDown` because that one only ever navigates the
              // existing list — and because `preventDefault` on Enter has to stop the surrounding
              // `<form>` submitting before the badge is added.
              onKeyDown={(e) => {
                if (!creatable) return;
                if (e.key === "Enter" || e.key === ",") {
                  // Let Enter pick the highlighted row when the user is arrowing the list.
                  if (e.key === "Enter" && focusedPopoverIndex !== null) return;
                  if (!searchTags.trim()) return;
                  e.preventDefault();
                  e.stopPropagation();
                  handleCreateTag(searchTags);
                  return;
                }
                if (e.key === "Backspace" && searchTags === "" && selectedTagsStack.length > 0) {
                  e.preventDefault();
                  handleUnselectTag(selectedTagsStack[selectedTagsStack.length - 1].id);
                }
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
                },
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

        <PopoverContent
          dir={dir}
          data-theme={theme}
          ref={popoverContentRef}
          style={{ width: dropDownListWidth }}
          variant={variant}
          onKeyDown={handleKeyDown}
          className={cn(
            menuContentContinerStyles({ variant: "PresentationStyle" }),
            "p-1 rounded-[17px]",
          )}

          // Reuse the DropdownMenu surface so the list matches the menu design.
        >
          <div className={cn(menuContentStyles({ variant: "PresentationStyle" }), "p-0")}>
            {/* LOCAL PATCH (Contact Center): the create-from-typed-text row. */}
            {showCreateRow && (
              <button
                type="button"
                onClick={() => handleCreateTag(searchTags)}
                className={cn(
                  MenuItemStyles({ variant: "Default", size: "M" }),
                  "w-full p-1 shrink-0 h-fit",
                )}
              >
                <div className="flex items-center gap-1 w-full">
                  <i className="ri-add-line text-[14px]" />
                  <span className="truncate">{createLabel(typedValue)}</span>
                </div>
              </button>
            )}
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
                    "w-full p-1 shrink-0 h-fit",
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <Badge
                      size={size}
                      badgeStyle={"solid"}
                      color={tag.variant as VariantProps<typeof badgeStyles>["color"]}
                      label={tag.name}
                    />

                    <div className="flex group-hover:opacity-100 opacity-0 px-[4px] py-[2px] items-center rounded-[6px] bg-white-50">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        className="rtl:rotate-180"
                        fill="none"
                      >
                        <path
                          d="M3.91422 5.49995H10V6.49995H3.91422L6.5962 9.1819L5.8891 9.889L2 5.99995L5.8891 2.11084L6.5962 2.81794L3.91422 5.49995Z"
                          fill="black"
                        />
                      </svg>
                      <p className="text-black-1000 text-end text-[12px] font-[510] leading-[148%]">
                        {addLabel}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              // The create row already tells the user what will happen, so don't also say
              // "no matching tags found" underneath it.
              !showCreateRow && (
                <div className="px-3 py-2 typography-body-small-regular text-white-alpha-75">
                  {creatable
                    ? "Type a value and press Enter"
                    : tags.length === 0
                      ? "All tags selected"
                      : "No matching tags found"}
                </div>
              )
            )}{" "}
          </div>
        </PopoverContent>
      </Popover>
    );
  },
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
        PresentationStyle: [],
      },
      defaultVariants: {
        variant: "PresentationStyle",
      },
    },
  },
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
  },
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
        Default: ["hover:bg-[rgba(184,192,204,0.50)] "],
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
  },
);
