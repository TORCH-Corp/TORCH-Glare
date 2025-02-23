import { ReactNode, HTMLAttributes } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

export const badgeBase = cva(
  [
    "px-[6px]",
    "[&_p]:text-[--content-presentation-action-light-primary]",
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
        XS: "h-[18px] [&_i]:text-[12px] [&_p]:typography-body-small-medium",
        S: "h-[22px] [&_i]:text-[12px] [&_p]:typography-body-small-medium",
        M: "h-[26px] [&_i]:text-[16px] [&_p]:typography-body-medium-medium",
      },
      variant: {
        highlight: ["h-[20px] [&_i]:text-[12px] [&_p]:typography-body-small-medium",
          "bg-background-presentation-badge-gray border-transparent"
        ],
        green:
          "border-[var(--border-presentation-badge-green)] bg-[var(--background-presentation-badge-green)] [&_i]:text-[var(--content-presentation-badge-green)]",
        greenLight:
          "border-[var(--border-presentation-badge-green-light)] bg-[var(--background-presentation-badge-green-light)] [&_i]:text-[var(--content-presentation-badge-green-light)]",
        cocktailGreen:
          "border-[var(--border-presentation-badge-cocktail-green)] bg-[var(--background-presentation-badge-cocktail-green)] [&_i]:text-[var(--content-presentation-badge-cocktail-green)]",
        yellow:
          "border-[var(--border-presentation-badge-yellow)] bg-[var(--background-presentation-badge-yellow)] [&_i]:text-[var(--content-presentation-badge-yellow)]",
        redOrange:
          "border-[var(--border-presentation-badge-red-orange)] bg-[var(--background-presentation-badge-red-orange)] [&_i]:text-[var(--content-presentation-badge-red-orange)]",
        redLight:
          "border-[var(--border-presentation-badge-red)] bg-[var(--background-presentation-badge-red)] [&_i]:text-[var(--content-presentation-badge-red)]",
        rose: "border-[var(--border-presentation-badge-rose)] bg-[var(--background-presentation-badge-rose)] [&_i]:text-[var(--content-presentation-badge-rose)]",
        purple:
          "border-[var(--border-presentation-badge-purple)] bg-[var(--background-presentation-badge-purple)] [&_i]:text-[var(--content-presentation-badge-purple)]",
        bluePurple:
          "border-[var(--border-presentation-badge-blue-purple)] bg-[var(--background-presentation-badge-blue-purple)] [&_i]:text-[var(--content-presentation-badge-blue-purple)]",
        blue: "border-[var(--border-presentation-badge-blue)] bg-[var(--background-presentation-badge-blue)] [&_i]:text-[var(--content-presentation-badge-blue)]",
        navy: "border-[var(--border-presentation-badge-navy)] bg-[var(--background-presentation-badge-navy)] [&_i]:text-[var(--content-presentation-badge-navy)]",
        gray: "border-[var(--border-presentation-badge-gray)] bg-[var(--background-presentation-badge-gray)] [&_i]:text-[var(--content-presentation-badge-gray)]",
      },
    },
    defaultVariants: {
      size: "S",
      variant: "green",
    },
  }
);

interface BadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "className">,
  VariantProps<typeof badgeBase> {
  label?: string;
  onUnselect?: () => void;
  isSelected?: boolean;
  badgeIcon?: ReactNode;
  className?: string;
  theme?: "dark" | "light" | "default"
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
      <span className={"flex justify-center items-center"}>
        {!badgeIcon ? (
          <i className={cn("ri-circle-fill !text-[8px]", { "hidden": variant === "highlight" })}></i>
        ) : (
          badgeIcon
        )}
      </span>

      <p className="px-[3px] whitespace-nowrap">{label}</p>
      {isSelected && (
        <button
          onClick={onUnselect}
          className={" rounded-[2px] flex justify-center items-center "}
        >
          <i className="ri-close-line  !text-[--content-presentation-action-light-primary]"></i>
        </button>
      )}
    </span>
  );
};
