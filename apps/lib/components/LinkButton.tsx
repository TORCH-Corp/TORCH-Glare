import React, { AnchorHTMLAttributes, HTMLAttributes, SVGProps } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../utils/cn";
import { Themes } from "../utils/types";
import { Slot } from "@radix-ui/react-slot";

// Link button base styles
export const linkButtonStyles = cva(
  [
    "bg-background-presentation-action-link-primary w-fit",
    "flex items-center justify-center",
    "rounded-[6px]",
    "p-[2px]",
    "text-content-presentation-action-link",
    "hover:bg-background-presentation-action-link-hover hover:px-[2px]",
    "transition-all duration-250 ease-in-out",
    "group", // Add group class here
  ],
  {
    variants: {
      size: {
        S: "h-[24px] typography-body-small-semibold",
        M: "h-[26px] typography-body-medium-semibold",
      },
    },
    defaultVariants: {
      size: "S",
    },
  }
);

interface Props extends HTMLAttributes<HTMLAnchorElement | HTMLSpanElement> {
  size?: "S" | "M"; // this props will change the button style size see on figma design file
  theme?: Themes
  asChild?: boolean
  href?: string
}

export const LinkButton: React.FC<Props> = ({ theme, className, size = "S", asChild, ...props }) => {
  const Component = asChild ? Slot : props.href ? "a" : "span";
  return (
    <Component
      {...props}
      data-theme={theme}
      className={cn(
        linkButtonStyles({
          size: size,
        }),
        className
      )}
    >
      <div className="px-[3px] whitespace-nowrap break-keep">{props.children}</div>
      <div
        className={cn(
          "rounded-[4px]",
          "bg-background-presentation-state-information-primary",
          "transition-all duration-[100] ease-in-out",
          "h-0 w-0  p-0",
          "opacity-0 group-hover:opacity-100 group-hover:p-[3px]",
          {
            "group-hover:w-[20px] group-hover:h-[20px]": size === "S",
            "group-hover:w-[22px] group-hover:h-[22px]": size === "M",
          }
        )}
      >
        <Arrow
          className={cn("rtl:rotate-[260deg]", {
            "group-hover:w-[14px] group-hover:h-[14px]": size === "S",
            "group-hover:w-[16px] group-hover:h-[16px]": size === "M",
          })}
        />
      </div>
    </Component>
  );
};

const Arrow = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1.81582 1.58451L3.2807 0.119629L9.12479 0.875203L9.88037 6.71929L8.41549 8.18417L7.78584 3.31409L3.35267 7.74727L2.25272 6.64733L6.6859 2.21415L1.81582 1.58451Z"
      fill="#F9F9F9"
    />
    <path
      d="M0.325211 8.57478L1.48169 7.4183L2.58164 8.51824L1.42515 9.67472L0.325211 8.57478Z"
      fill="#F9F9F9"
    />
  </svg>
);
