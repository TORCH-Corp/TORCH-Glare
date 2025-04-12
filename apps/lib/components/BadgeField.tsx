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
import { useClickOutside } from "@/hooks/useClickOutside";
import { Badge } from "./Badge";

export interface Tag {
  id: string;
  name: string;
  variant?: string;
  value?: string;
  isSelected: boolean;
  [key: string]: any;
}

export interface Props
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
  onTagChange?: (tags: Tag[]) => void
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
      onTagChange,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [dropDownListWidth, setDropDownListWidth] = useState(0);
    const popoverContentRef = useRef<HTMLDivElement>(null);
    const inputGroupRef = useClickOutside((e) => {
      if (
        !inputGroupRef?.current?.contains(e.target as Node) &&
        !popoverContentRef?.current?.contains(e.target as Node)
      ) setIsPopoverOpen(false);
      else setIsPopoverOpen(true);
    });
    const {
      selectedTagsStack,
      searchInput,
      handleSelectTag,
      handleUnselectTag,
      handleKeyDown,
      setFocusedTagIndex,
      setSearchInput,
      filteredTags,
      focusedTagIndex,
      focusedPopoverIndex
    } = useHandleBadges({ isPopoverOpen, setIsPopoverOpen, Tags: tags });

    // 
    useEffect(() => {
      if (onTagChange) {
        onTagChange(selectedTagsStack)
      }
    }, [selectedTagsStack])


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
                value={searchInput}
                onChange={(e) => {
                  props.onChange?.(e)
                  setSearchInput(e.target.value)
                }}
                onFocus={(e) => {
                  props.onFocus?.(e)
                  setFocusedTagIndex(null);
                  setIsPopoverOpen(true)
                }}
                onKeyDown={handleKeyDown}
                ref={forwardedRef}
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
                  className={`${focusedPopoverIndex === index ? "ring-2 ring-blue-500" : ""}`}
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



const useHandleBadges = ({ isPopoverOpen, setIsPopoverOpen, Tags }: { isPopoverOpen: boolean, setIsPopoverOpen: (isPopoverOpen: boolean) => void, Tags: any[] }) => {
  // Product tags with categories and colors

  const [tags, setTags] = useState<any[]>(Tags);
  // Separate array for selected tags (as a stack)
  const [selectedTagsStack, setSelectedTagsStack] = useState<any[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [focusedTagIndex, setFocusedTagIndex] = useState<number | null>(null);
  const [focusedPopoverIndex, setFocusedPopoverIndex] = useState<number | null>(null);

  // Filter tags based on search input
  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  // Handle selecting a tag - add to stack
  const handleSelectTag = (id: string) => {
    const tagToSelect = tags.find(tag => tag.id === id);
    if (tagToSelect) {
      // Add to selected stack
      setSelectedTagsStack(prev => [...prev, {
        id: tagToSelect.id,
        name: tagToSelect.name,
        variant: tagToSelect.variant,
        ...tagToSelect
      }]);

      // Remove from available tags
      setTags(prev => prev.filter(tag => tag.id !== id));
    }
    setSearchInput('');
    setFocusedPopoverIndex(null);
  };

  // Handle unselecting a tag - remove from stack
  const handleUnselectTag = (id: string) => {
    const tagToUnselect = selectedTagsStack.find(tag => tag.id === id);
    if (tagToUnselect) {
      // Remove from selected stack
      setSelectedTagsStack(prev => prev.filter(tag => tag.id !== id));

      // Add back to available tags
      setTags(prev => [...prev, {
        id: tagToUnselect.id,
        name: tagToUnselect.name,
        variant: tagToUnselect.variant,
        isSelected: false,
        ...tagToUnselect
      }]);
    }
    setFocusedTagIndex(null);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Navigation within selected tags
    if (focusedTagIndex !== null && !isPopoverOpen) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setFocusedTagIndex((prev: any) => (prev === 0 ? selectedTagsStack.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setFocusedTagIndex((prev: any) => (prev === selectedTagsStack.length - 1 ? 0 : prev + 1));
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        const tagToRemove = selectedTagsStack[focusedTagIndex];
        handleUnselectTag(tagToRemove.id);
        if (selectedTagsStack.length > 1) {
          setFocusedTagIndex(Math.min(focusedTagIndex, selectedTagsStack.length - 2));
        } else {
          setFocusedTagIndex(null);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setFocusedTagIndex(null);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setIsPopoverOpen(true);
        setFocusedPopoverIndex(0);
        setFocusedTagIndex(null);
      }
    }
    // Navigation within popover items
    else if (isPopoverOpen && filteredTags.length > 0) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (focusedPopoverIndex === 0 || focusedPopoverIndex === null) {
          // Move focus back to selected tags if available
          if (selectedTagsStack.length > 0) {
            setIsPopoverOpen(false);
            setFocusedTagIndex(0);
            setFocusedPopoverIndex(null);
          } else {
            setFocusedPopoverIndex(filteredTags.length - 1);
          }
        } else {
          setFocusedPopoverIndex(prev => (prev === null ? 0 : prev - 1));
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedPopoverIndex(prev =>
          prev === null ? 0 : (prev === filteredTags.length - 1 ? 0 : prev + 1)
        );
      } else if (e.key === 'Enter' && focusedPopoverIndex !== null) {
        e.preventDefault();
        handleSelectTag(filteredTags[focusedPopoverIndex].id);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setIsPopoverOpen(false);
        setFocusedPopoverIndex(null);
      }
    }
    // Initial focus handling
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      if (selectedTagsStack.length > 0) {
        e.preventDefault();
        setFocusedTagIndex(e.key === 'ArrowLeft' ? selectedTagsStack.length - 1 : 0);
      }
    } else if (e.key === 'ArrowDown' && !isPopoverOpen) {
      if (filteredTags.length > 0) {
        e.preventDefault();
        setIsPopoverOpen(true);
        setFocusedPopoverIndex(0);
      }
    }
  };

  return {
    tags,
    selectedTagsStack,
    searchInput,
    handleSelectTag,
    handleUnselectTag,
    handleKeyDown,
    setFocusedTagIndex,
    setFocusedPopoverIndex,
    setSearchInput,
    filteredTags,
    focusedTagIndex,
    focusedPopoverIndex,
    isPopoverOpen
  };
}
