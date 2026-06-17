import { ReactNode, HTMLAttributes } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import { Themes } from "../utils/types";

const SOLID_TEXT =
  "text-content-presentation-global-primary-light [&_i]:text-content-presentation-global-primary-light";

const solidCompoundVariants = [
  {
    badgeStyle: "solid" as const,
    color: "gray" as const,
    className: `bg-background-presentation-badge-gray-solid ${SOLID_TEXT}`,
  },
  {
    badgeStyle: "solid" as const,
    color: "slate" as const,
    className: `bg-background-presentation-badge-slate-solid ${SOLID_TEXT}`,
  },
  {
    badgeStyle: "solid" as const,
    color: "red" as const,
    className: `bg-background-presentation-badge-red-solid ${SOLID_TEXT}`,
  },
  {
    badgeStyle: "solid" as const,
    color: "orange" as const,
    className: `bg-background-presentation-badge-orange-solid ${SOLID_TEXT}`,
  },
  {
    badgeStyle: "solid" as const,
    color: "yellow" as const,
    className: `bg-background-presentation-badge-yellow-solid ${SOLID_TEXT}`,
  },
  {
    badgeStyle: "solid" as const,
    color: "green" as const,
    className: `bg-background-presentation-badge-green-solid ${SOLID_TEXT}`,
  },
  {
    badgeStyle: "solid" as const,
    color: "ocean" as const,
    className: `bg-background-presentation-badge-ocean-solid ${SOLID_TEXT}`,
  },
  {
    badgeStyle: "solid" as const,
    color: "blue" as const,
    className: `bg-background-presentation-badge-blue-solid ${SOLID_TEXT}`,
  },
  {
    badgeStyle: "solid" as const,
    color: "purple" as const,
    className: `bg-background-presentation-badge-purple-solid ${SOLID_TEXT}`,
  },
  {
    badgeStyle: "solid" as const,
    color: "rose" as const,
    className: `bg-background-presentation-badge-rose-solid ${SOLID_TEXT}`,
  },
];

const SUBTLE_TEXT =
  "text-content-presentation-global-subtle [&>div]:mix-blend-luminosity [&_i]:text-content-presentation-global-subtle [&_i]:mix-blend-luminosity [&>button]:mix-blend-luminosity";

const subtleCompoundVariants = [
  {
    badgeStyle: "subtle" as const,
    color: "gray" as const,
    className: `bg-background-presentation-badge-gray-subtle ${SUBTLE_TEXT}`,
  },
  {
    badgeStyle: "subtle" as const,
    color: "slate" as const,
    className: `bg-background-presentation-badge-slate-subtle ${SUBTLE_TEXT}`,
  },
  {
    badgeStyle: "subtle" as const,
    color: "red" as const,
    className: `bg-background-presentation-badge-red-subtle ${SUBTLE_TEXT}`,
  },
  {
    badgeStyle: "subtle" as const,
    color: "orange" as const,
    className: `bg-background-presentation-badge-orange-subtle ${SUBTLE_TEXT}`,
  },
  {
    badgeStyle: "subtle" as const,
    color: "yellow" as const,
    className: `bg-background-presentation-badge-yellow-subtle ${SUBTLE_TEXT}`,
  },
  {
    badgeStyle: "subtle" as const,
    color: "green" as const,
    className: `bg-background-presentation-badge-green-subtle ${SUBTLE_TEXT}`,
  },
  {
    badgeStyle: "subtle" as const,
    color: "ocean" as const,
    className: `bg-background-presentation-badge-ocean-subtle ${SUBTLE_TEXT}`,
  },
  {
    badgeStyle: "subtle" as const,
    color: "blue" as const,
    className: `bg-background-presentation-badge-blue-subtle ${SUBTLE_TEXT}`,
  },
  {
    badgeStyle: "subtle" as const,
    color: "purple" as const,
    className: `bg-background-presentation-badge-purple-subtle ${SUBTLE_TEXT}`,
  },
  {
    badgeStyle: "subtle" as const,
    color: "rose" as const,
    className: `bg-background-presentation-badge-rose-subtle ${SUBTLE_TEXT}`,
  },
];

export const badgeStyles = cva(
  [
    "inline-flex items-center justify-center w-fit",
    "rounded-[6px]",
    "transition-all duration-200 ease-in-out",
    "whitespace-nowrap",
    "[&_i]:!leading-none",
    // The subtle variants blend their label/icon with `mix-blend-luminosity`.
    // `isolate` opens a new stacking context so that blend only composites
    // against the badge's own background — not against arbitrary page layers
    // behind it (semi-transparent rows, gradients, masks), which otherwise
    // ghosts/double-strokes the text in "random" places.
    "isolate",
  ],
  {
    variants: {
      badgeStyle: {
        solid: "",
        subtle: "",
      },
      color: {
        gray: "",
        slate: "",
        red: "",
        orange: "",
        yellow: "",
        green: "",
        ocean: "",
        blue: "",
        purple: "",
        rose: "",
      },
      size: {
        XS: "h-[18px] px-[6px] py-0 [&_i]:text-[12px] [&>div]:typography-body-small-medium",
        S: "h-[22px] px-[6px] py-[2px] [&_i]:text-[12px] [&>div]:typography-body-small-medium",
        M: "h-[26px] px-[8px] py-[2px] [&_i]:text-[16px] [&>div]:typography-body-medium-medium",
      },
    },
    compoundVariants: [...solidCompoundVariants, ...subtleCompoundVariants],
    defaultVariants: {
      badgeStyle: "subtle",
      color: "gray",
      size: "S",
    },
  },
);

interface BadgeProps
  extends
    Omit<HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof badgeStyles> {
  label?: string;
  badgeIcon?: ReactNode;
  showIcon?: boolean;
  isClosable?: boolean;
  onClose?: () => void;
  theme?: Themes;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  badgeIcon,
  showIcon = true,
  isClosable,
  onClose,
  theme,
  badgeStyle,
  color,
  size,
  className,
  ...props
}) => {
  return (
    <span
      {...props}
      data-theme={theme}
      className={cn(
        badgeStyles({ badgeStyle, color, size }),
        { "cursor-default": isClosable },
        className,
      )}
    >
      {showIcon && (
        <div className="flex items-center justify-center">
          {badgeIcon ?? <i className="ri-circle-fill !text-[8px]" />}
        </div>
      )}

      {label && <div className="px-[3px]">{label}</div>}

      {isClosable && (
        <button
          type="button"
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onClose?.();
            }
          }}
          className={cn(
            "rounded-[4px]",
            "flex items-center justify-center cursor-pointer",
            "hover:bg-background-presentation-action-secondary",
            "transition-colors duration-150",
            size === "M"
              ? "w-[16px] h-[16px]"
              : size === "S"
                ? "w-[14px] h-[14px]"
                : "w-[12px] h-[12px]",
          )}
          aria-label="Remove badge"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6.00002 5.33336L8.33334 3L9 3.66667L6.66668 6.00002L9 8.33334L8.33334 9L6.00002 6.66668L3.66667 9L3 8.33334L5.33336 6.00002L3 3.66667L3.66667 3L6.00002 5.33336Z"
              fill="currentColor"
            />
          </svg>
        </button>
      )}
    </span>
  );
};
