import { ButtonHTMLAttributes } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../utils/cn";
import { Slot } from "@radix-ui/react-slot";

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
    "text-content-presentation-global-primary",
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
          "bg-background-presentation-tab-sidebar-primary",
          "border-border-presentation-tab-sidebar-primary",
          "hover:bg-border-presentation-tab-sidebar-primary",
          "hover:border-border-presentation-tab-sidebar-primary",
          "hover:px-[16px]",
          "focus:bg-background-presentation-tab-sidebar-selected focus:hover:bg-background-presentation-tab-sidebar-selected",
          "focus:text-content-presentation-action-dark-primary focus:hover:text-content-presentation-action-dark-primary",
          "focus:border-transparent focus:hover:border-transparent",
          "focus:px-[8px] focus:hover:px-[8px]",
          "active:text-content-presentation-action-dark-primary active:hover:text-content-presentation-action-dark-primary",
          "active:border-transparent active:hover:border-transparent",
          "active:px-[8px] active:hover:px-[8px]",
        ],
        top: [
          "px-[24px]",
          "h-[28px]",
          "bg-background-presentation-tab-topbar-primary",
          "hover:bg-background-presentation-tab-topbar-hover",
          "hover:text-content-presentation-tab-action-hover",
          "hover:border-border-presentation-tab-topbar-hover",
          "focus:bg-background-presentation-tab-topbar-selected focus:hover:bg-background-presentation-tab-topbar-selected",
          "focus:text-content-presentation-tab-action-selected focus:hover:text-content-presentation-tab-action-selected",
          "focus:border-border-presentation-tab-topbar-selected focus:hover:border-border-presentation-tab-topbar-selected",
          "active:bg-background-presentation-tab-topbar-selected active:hover:bg-background-presentation-tab-topbar-selected",
          "active:text-content-presentation-tab-action-selected active:hover:text-content-presentation-tab-action-selected",
          "active:border-border-presentation-tab-topbar-selected active:hover:border-border-presentation-tab-topbar-selected",
        ],
        tree: [
          "px-[8px]",
          "h-[36px]",
          "w-full",
          "border",
          "px-[8px]",
          "justify-start",
          "hover:bg-border-presentation-tab-sidebar-primary",
          "hover:px-[16px]",
          "focus:bg-background-presentation-tab-sidebar-selected focus:hover:bg-background-presentation-tab-sidebar-selected",
          "focus:text-content-presentation-action-dark-primary focus:hover:text-content-presentation-action-dark-primary",
          "focus:border-transparent focus:hover:border-transparent",
          "focus:px-[8px] focus:hover:px-[8px]",
          "active:text-content-presentation-action-dark-primary active:hover:text-content-presentation-action-dark-primary",
          "active:border-transparent active:hover:border-transparent",
          "active:px-[8px] active:hover:px-[8px]",
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
          "bg-background-presentation-tab-sidebar-selected hover:bg-background-presentation-tab-sidebar-selected",
          "text-content-presentation-action-dark-primary hover:text-content-presentation-action-dark-primary",
          "border-transparent hover:border-transparent",
          "px-[8px] hover:px-[8px]",
        ],
      },
      {
        componentType: "top",
        active: true,
        className: [
          "bg-background-presentation-tab-topbar-selected hover:bg-background-presentation-tab-topbar-selected",
          "text-content-presentation-tab-action-selected hover:text-content-presentation-tab-action-selected",
          "border-border-presentation-tab-topbar-selected hover:border-border-presentation-tab-topbar-selected",
        ],
      },
      {
        componentType: "tree",
        active: true,
        className: [
          "bg-background-presentation-tab-topbar-selected hover:bg-background-presentation-tab-topbar-selected",
          "text-content-presentation-tab-action-selected hover:text-content-presentation-tab-action-selected",
        ],
      },

    ],
  }
);
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  componentType: "top" | "side" | "tree"; // component type and style see on the figma design file
  active?: boolean;
  buttonType?: "icon" | "button";
  theme?: "dark" | "light" | "default";
  asChild?: boolean;
  as?: React.ElementType;
}


const TabFormItem: React.FC<Props> = ({
  componentType,
  active,
  buttonType,
  theme,
  asChild,
  className,
  as: Tag = "button",
  ...props
}) => {

  const Component = asChild ? Slot : Tag;

  return (
    <Component
      data-theme={theme}
      {...props}
      className={cn(
        formBarItemStyles({ componentType, active, buttonType }),
        className
      )}
    >
      {props.children}
    </Component>
  );
};

export default TabFormItem;
