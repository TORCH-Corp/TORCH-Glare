"use client";
import { cn } from "../utils/cn";
import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes, ReactNode, useEffect, useState } from "react";

const TreeDropDownVariants = cva(
  [
    "cursor-pointer flex px-[6px] h-[40px] gap-2 justify-start items-center w-full",
    "text-content-system-global-primary border-s-[2px] border-transparent outline-none",
    "hover:bg-white-alpha-075 hover:border-black-300 hover:text-content-system-action-primary-hover hover:gap-[14px]",
    "rounded-e-[4px] text-start whitespace-nowrap transition-all duration-150 ease-in-out",
  ],
  {
    variants: {
      variant: {
        secondary: "",
        default: "",
      },
      active: {
        true: "hover:gap-[8px]",
      },
    },
    // The active row is a fixed dark slab, so its colours are pinned locally rather than taken from
    // the theme. Previously the fill was theme-invariant while the text was not: on a light-themed
    // page the row rendered near-black with near-black text, and the label was unreadable. The
    // values below are exactly what the dark sidebar already rendered, so its look is unchanged.
    compoundVariants: [
      {
        active: true,
        variant: "default",
        className: [
          "bg-purple-1000 border-purple-600 [&_button]:bg-purple-alpha-15",
          "hover:bg-purple-1000 hover:border-purple-600",
          // Descendants carry their own theme-driven text colours (headings, badges), so the
          // foreground has to be forced here or it follows the page instead of the slab.
          "text-content-presentation-global-primary-light",
          "[&_*]:!text-content-presentation-global-primary-light",
        ],
      },
      {
        active: true,
        variant: "secondary",
        className: [
          "bg-wavy-navy-1000 border-blue-sparkle-600 [&_button]:bg-blue-sparkle-alpha-15",
          "hover:bg-wavy-navy-1000 hover:border-blue-sparkle-600",
          "text-content-presentation-global-primary-light",
          "[&_*]:!text-content-presentation-global-primary-light",
        ],
      },
    ],
    defaultVariants: {}, //
  },
);

interface Props extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof TreeDropDownVariants> {
  theme?: "dark" | "light" | "default";
  treeLabel: ReactNode;
  open?: boolean;
  variant?: "secondary" | "default";
  childrenContainerClassName?: string;
}

export const TreeDropDown = ({
  childrenContainerClassName,
  className,
  variant = "secondary",
  treeLabel,
  open,
  theme,
  ...props
}: Props) => {
  const [isActive, setIsActive] = useState(open);
  useEffect(() => {
    setIsActive(open);
  }, [open]);
  return (
    <div {...props} className={cn("flex h-fit flex-col transition-all ease-in-out duration-500")}>
      <div
        onClick={() => setIsActive(!isActive)}
        data-theme={theme}
        className={cn(TreeDropDownVariants({ variant, active: isActive }), className)}
      >
        <button
          className={cn(
            "cursor-pointer outline-none border-none flex-0 leading-0 transition-transform ease-in-out flex justify-center items-center bg-background-system-body-tertiary h-[28px] w-[28px] rounded-full text-[20px] text-content-system-global-primary",
            { "rotate-180": isActive },
          )}
        >
          <i className={cn("leading-none ri-arrow-down-s-line ")}></i>
        </button>
        <div
          className={cn(
            "text-content-system-global-primary typography-body-medium-medium transition-all ease-in-out duration-100 flex-1 cursor-pointer",
          )}
        >
          {treeLabel}
        </div>
      </div>
      <div
        className={cn(
          "mt-0 ps-[22px] relative overflow-auto scrollbar-hide transition-all duration-500 ease-in-out",
          {
            "max-h-[20000px] mt-1": isActive,
            "max-h-0": !isActive,
          },
        )}
      >
        <span className="h-full w-[1px] bg-border-system-global-primary absolute start-[21px] top-0 rounded-sm z-10" />
        <div className={cn("h-full flex flex-col gap-1 w-full", childrenContainerClassName)}>
          {props.children}
        </div>
      </div>
    </div>
  );
};
