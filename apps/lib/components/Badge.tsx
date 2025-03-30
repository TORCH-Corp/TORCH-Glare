import { ReactNode, HTMLAttributes } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import { Themes } from "../utils/types";

export const badgeBase = cva(
  [
    "px-[6px]",
    "[&_div]:text-content-presentation-action-light-primary",
    "[&_i]:!leading-0",
    "flex",
    "justify-center",
    "items-center",
    "border",
    "rounded-[6px]",
    "transition-all",
    "duration-300",
    "ease-in-out",
    "w-fit",
    "cursor-pointer",
    "[&_i]:leading-0",
  ],
  {
    variants: {
      size: {
        XS: "h-[18px] [&_i]:text-[12px] [&_div]:typography-body-small-medium",
        S: "h-[22px] [&_i]:text-[12px] [&_div]:typography-body-small-medium",
        M: "h-[26px] [&_i]:text-[16px] [&_div]:typography-body-medium-medium",
      },
      variant: {
        highlight: ["h-[20px] [&_i]:text-[12px] [&_div]:typography-body-small-medium",
          "bg-background-presentation-badge-gray border-transparent px-[3px]"
        ],
        green: "border-border-presentation-badge-green bg-background-presentation-badge-green [&_i]:text-content-presentation-badge-green",
        greenLight: "border-border-presentation-badge-green-light bg-background-presentation-badge-green-light [&_i]:text-content-presentation-badge-green-light",
        cocktailGreen: "border-border-presentation-badge-cocktail-green bg-background-presentation-badge-cocktail-green [&_i]:text-content-presentation-badge-cocktail-green",
        yellow: "border-border-presentation-badge-yellow bg-background-presentation-badge-yellow [&_i]:text-content-presentation-badge-yellow",
        redOrange: "border-border-presentation-badge-red-orange bg-background-presentation-badge-red-orange [&_i]:text-content-presentation-badge-red-orange",
        redLight: "border-border-presentation-badge-red bg-background-presentation-badge-red [&_i]:text-content-presentation-badge-red",
        rose: "border-border-presentation-badge-rose bg-background-presentation-badge-rose [&_i]:text-content-presentation-badge-rose",
        purple: "border-border-presentation-badge-purple bg-background-presentation-badge-purple [&_i]:text-content-presentation-badge-purple",
        bluePurple: "border-border-presentation-badge-blue-purple bg-background-presentation-badge-blue-purple [&_i]:text-content-presentation-badge-blue-purple",
        blue: "border-border-presentation-badge-blue bg-background-presentation-badge-blue [&_i]:text-content-presentation-badge-blue",
        navy: "border-border-presentation-badge-navy bg-background-presentation-badge-navy [&_i]:text-content-presentation-badge-navy",
        gray: "border-border-presentation-badge-gray bg-background-presentation-badge-gray [&_i]:text-content-presentation-badge-gray",
      },
    },
    defaultVariants: {
      size: "S",
      variant: "green",
    },
  }
);

interface BadgeProps extends HTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof badgeBase> {
  label?: string;
  onUnselect?: () => void;
  isSelected?: boolean;
  badgeIcon?: ReactNode;
  className?: string;
  theme?: Themes
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  onUnselect,
  isSelected,
  badgeIcon,
  theme,
  size = "S",
  variant = "green",
  className,
  ...props
}) => {
  return (
    <span
      {...props}
      data-theme={theme}
      className={cn(
        badgeBase({ size, variant }),
        {
          "cursor-default": isSelected,
        },
        className
      )}
    >
      <div className={"flex justify-center items-center"}>
        {!badgeIcon ? (
          <i className={cn("ri-circle-fill !text-[8px]", { "hidden": variant === "highlight" })}></i>
        ) : (
          badgeIcon
        )}
      </div>

      <div className="px-[3px] whitespace-nowrap">{label}</div>
      {isSelected && (
        <button
          onClick={onUnselect}
          className="rounded-[2px] flex justify-center items-center cursor-pointer"
          tabIndex={0}
          role="button"
          aria-label="Remove badge"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onUnselect?.();
            }
          }}
        >
          <i className="ri-close-line !text-content-presentation-action-light-primary"></i>
        </button>
      )}
    </span>
  );
};
