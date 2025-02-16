import { cn } from "./utils";
import React, { ButtonHTMLAttributes } from "react";
import { cva } from "class-variance-authority";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  collapse?: boolean; // to collapse the item
  theme?: "dark" | "light" | "default";

}

export const glareFeedbackItem = cva(
  [
    "h-10 w-full flex justify-center items-center rounded px-2",
    "transition-all duration-200 ease-in-out border-none outline outline-1 outline-transparent bg-transparent",
    "focus:bg-[var(--background-system-action-selected-primary)]",
    "active:bg-[var(--background-system-action-selected-primary)]",
    "hover:bg-[var(--background-system-action-hover-primary,#181323)]",
  ],
  {
    variants: {
      collapsed: {
        true: "w-10 !important",
      },
    },
  }
);
export const SideBarFooterItem: React.FC<Props> = ({ theme, collapse, ...props }) => {
  return (
    <button
      data-theme={theme}
      {...props}
      className={cn(glareFeedbackItem({ collapsed: collapse }))}
    >
      {props.children}
    </button>
  );
};
