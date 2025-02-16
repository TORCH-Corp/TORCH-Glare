import { ButtonHTMLAttributes } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/utils";

export const formBarItemStyles = cva(
  [
    "flex",
    "items-center",
    "justify-center",
    "text-ellipsis",
    "overflow-hidden",
    "whitespace-nowrap",
    "rounded-[4px]",
    "border-transparent",
    "outline-none",
    "transition-all",
    "duration-300",
    "ease-in-out",
    "text-[--content-presentation-global-primary]",
  ],
  {
    variants: {
      componentType: {
        side: [
          "px-[8px]",
          "h-[36px]",
          "w-full",
          "border",
          "px-[8px]",
          "justify-start",
          "bg-[--background-presentation-tab-sidebar-primary]",
          "border-[--border-presentation-tab-sidebar-primary]",
          "hover:bg-[--border-presentation-tab-sidebar-primary]",
          "hover:border-[--border-presentation-tab-sidebar-primary]",
          "hover:px-[16px]",
          "focus:bg-[--background-presentation-tab-sidebar-selected] focus:hover:bg-[--background-presentation-tab-sidebar-selected]",
          "focus:text-[--content-presentation-action-dark-primary] focus:hover:text-[--content-presentation-action-dark-primary]",
          "focus:border-transparent focus:hover:border-transparent",
          "focus:px-[8px] focus:hover:px-[8px]",
          "active:text-[--content-presentation-action-dark-primary] active:hover:text-[--content-presentation-action-dark-primary]",
          "active:border-transparent active:hover:border-transparent",
          "active:px-[8px] active:hover:px-[8px]",
        ],
        top: [
          "px-[24px]",
          "h-[28px]",
          "bg-[--background-presentation-tab-topbar-primary]",
          "hover:bg-[var(--background-presentation-tab-topbar-hover)]",
          "hover:text-[var(--content-presentation-tab-action-hover)]",
          "hover:border-[var(--border-presentation-tab-topbar-hover)]",
          "focus:bg-[--background-presentation-tab-topbar-selected] focus:hover:bg-[--background-presentation-tab-topbar-selected]",
          "focus:text-[var(--content-presentation-tab-action-selected)] focus:hover:text-[var(--content-presentation-tab-action-selected)]",
          "focus:border-[var(--border-presentation-tab-topbar-selected)] focus:hover:border-[var(--border-presentation-tab-topbar-selected)]",
          "active:bg-[--background-presentation-tab-topbar-selected] active:hover:bg-[--background-presentation-tab-topbar-selected]",
          "active:text-[var(--content-presentation-tab-action-selected)] active:hover:text-[var(--content-presentation-tab-action-selected)]",
          "active:border-[var(--border-presentation-tab-topbar-selected)] active:hover:border-[var(--border-presentation-tab-topbar-selected)]",
        ],
      },
      active: {
        true: "",
      },
      buttonType: {
        button: "",
        icon: "h-[28px] w-[28px] !p-0 [&_i]:text-inherit justify-center",
      },
    },
    defaultVariants: {
      componentType: "side",
      buttonType: "button",
    },
    compoundVariants: [
      {
        componentType: "side",
        active: true,
        className: [
          "bg-[--background-presentation-tab-sidebar-selected] hover:bg-[--background-presentation-tab-sidebar-selected]",
          "text-[--content-presentation-action-dark-primary] hover:text-[--content-presentation-action-dark-primary]",
          "border-transparent hover:border-transparent",
          "px-[8px] hover:px-[8px]",
        ],
      },
      {
        componentType: "top",
        active: true,
        className: [
          "bg-[--background-presentation-tab-topbar-selected] hover:bg-[--background-presentation-tab-topbar-selected]",
          "text-[var(--content-presentation-tab-action-selected)] hover:text-[var(--content-presentation-tab-action-selected)]",
          "border-[var(--border-presentation-tab-topbar-selected)] hover:border-[var(--border-presentation-tab-topbar-selected)]",
        ],
      },
    ],
  }
);
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  componentType: "top" | "side"; // component type and style see on the figma design file
  active?: boolean;
  buttonType?: "icon" | "button";
  theme?: "dark" | "light" | "default";
}

const TabFormItem: React.FC<Props> = ({
  componentType,
  active,
  buttonType,
  theme,
  ...props
}) => {
  return (
    <button
      data-theme={theme}
      {...props}
      className={cn(
        formBarItemStyles({ componentType, active, buttonType }),
        props.className
      )}
    >
      {props.children}
    </button>
  );
};

export default TabFormItem;
