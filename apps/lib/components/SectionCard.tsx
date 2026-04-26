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
        Gray: "bg-background-presentation-button-primary",
      },
    },
    defaultVariants: { color: "Blue" },
  },
);

export type SectionColor = NonNullable<VariantProps<typeof titleBadge>["color"]>;

export interface SectionCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  color?: SectionColor;
  title?: ReactNode;
  containerClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

export const SectionCard = forwardRef<HTMLDivElement, SectionCardProps>(
  (
    {
      children,
      color,
      title,
      className,
      containerClassName,
      headerClassName,
      bodyClassName,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex w-[1100px] pt-[6px] pb-[24px] px-0 flex-col rounded-[16px] bg-background-presentation-form-base shadow-[0_0_32px_2px_rgba(0,0,0,0.05)]",
          className,
          containerClassName,
        )}
        {...props}
      >
        {title && (
          <div className={cn("flex px-[6px] flex-col gap-[10px]", headerClassName)}>
            <div className={cn(titleBadge({ color }))}>{title}</div>
          </div>
        )}
        <div className={cn("flex px-[42px] flex-col gap-[2px]", bodyClassName)}>
          {children}
        </div>
      </div>
    );
  },
);

SectionCard.displayName = "SectionCard";
