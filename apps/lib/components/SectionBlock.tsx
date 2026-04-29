import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const titleBadge = cva(
  "flex pt-2 pb-2 pl-[16px] pr-[22px] justify-center items-center gap-[6px] rounded-[10px] self-start typography-headers-medium-medium text-[#F4F4F4]",
  {
    variants: {
      color: {
        Blue: "bg-blue-sparkle-900",
        Yellow: "bg-yellow-950",
        Green: "bg-green-cyan-900",
        Red: "bg-medium-red-900",
        Orange: "bg-red-orange-900",
        Purple: "bg-violet-900",
        Pink: "bg-medium-violet-red-900",
        Gray: "bg-background-presentation-badge-gray",
      },
    },
    defaultVariants: { color: "Blue" },
  },
);

export type SectionColor = NonNullable<
  VariantProps<typeof titleBadge>["color"]
>;

export interface SectionBlockProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "title"
> {
  color?: SectionColor;
  title?: ReactNode;
  icon?: ReactNode;
  containerClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

export const SectionBlock = forwardRef<HTMLDivElement, SectionBlockProps>(
  (
    {
      children,
      color,
      title,
      className,
      containerClassName,
      headerClassName,
      bodyClassName,
      icon,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex  w-full pt-[6px] pb-[24px] px-0 flex-col rounded-[16px] bg-background-presentation-form-base shadow-[0_0_32px_2px_rgba(0,0,0,0.05)]",
          className,
          containerClassName,
        )}
        {...props}
      >
        {title && (
          <div
            className={cn("flex px-[6px] flex-col gap-[10px]", headerClassName)}
          >
            <div className={cn(titleBadge({ color }))}>
              <span className="flex items-center gap-1.5">
                {icon}
                {title}
              </span>
            </div>
          </div>
        )}
        <div
          className={cn(
            "flex px-[42px] flex-col gap-[2px] px-[42px]",
            bodyClassName,
          )}
        >
          <div className="flex w-full divide-y divide-gray-300 min-w-[300px]  flex-col items-start ">
            {children}
          </div>
        </div>
      </div>
    );
  },
);

SectionBlock.displayName = "SectionBlock";
