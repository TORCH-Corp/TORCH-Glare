import { cn } from "../utils/cn";
import React, { ButtonHTMLAttributes } from "react";
import { cva } from "class-variance-authority";
import { Themes } from "../utils/types";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  collapse?: boolean; // to collapse the item
  theme?: Themes

}

export const glareFeedbackItem = cva(
  [
    "h-[40px] w-full flex justify-center items-center  px-2 ",
    "text-content-system-global-primary typography-body-small-medium ",
    "border border-transparent outline-none bg-background-system-body-base",
    "hover:bg-background-system-action-primary-hover hover:border-border-system-action-primary-hover hover:rounded-[4px]",
    "focus:bg-background-system-action-primary-selected",
    "active:bg-background-system-action-primary-hover active:border-border-system-action-primary-hover active:rounded-[4px]",
    "transition-all duration-200 ease-in-out",
  ],
  {
    variants: {
      collapsed: {
        true: "w-10",
      },
    },
  }
);
export const SideBarFooterItem: React.FC<Props> = ({ theme, collapse = false, ...props }) => {
  return (
    <button
      data-theme={theme}
      {...props}
      className={cn(glareFeedbackItem({ collapsed: collapse }), props.className)}
    >
    </button>
  );
};
