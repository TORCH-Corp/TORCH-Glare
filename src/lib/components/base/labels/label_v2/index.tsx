import { LabelHTMLAttributes, ReactNode } from "react";
import React from "react";
import { cn } from "@/utils";
import { cva, type VariantProps } from "class-variance-authority";
import '@/styles/typography_2/index.scss';

const labelComponentVariants = cva("flex", {
  variants: {
    directions: {
      vertical: "flex-col justify-start items-start",
      horizontal: "flex-row justify-start items-center gap-1",
    }
  },
  defaultVariants: {
    directions: "horizontal",
  },
});

const mainLabelVariants = cva("text-[--content-presentation-global-primary] text-start", {
  variants: {
    size: {
      S: "Body-typography-Small-Regular",
      M: "Body-typography-Medium-Regular",
      L: "Body-typography-Large-Regular",
    }
  },
  defaultVariants: {
    size: "M",
  },
});

const secondaryLabelVariants = cva("text-[--content-presentation-global-secondary] text-start", {
  variants: {
    size: {
      S: "Labels-typography-Small-Regular",
      M: "Labels-typography-Medium-Regular",
      L: "Body-typography-Small-Regular",
    }
  },
  defaultVariants: {
    size: "M",
  },
});

const requiredLabelVariants = cva("text-[--content-presentation-state-negative] text-start", {
  variants: {
    size: {
      S: "Labels-typography-Small-Medium",
      M: "Labels-typography-Medium-Medium",
      L: "Body-typography-Small-Medium",
    }
  },
  defaultVariants: {
    size: "M",
  },
});

interface Props extends LabelHTMLAttributes<HTMLLabelElement>, VariantProps<typeof labelComponentVariants> {
  label?: ReactNode; // main label
  required_label?: ReactNode; // normal text with required style
  secondary_label?: ReactNode; //normal text with secondary style
  as?: React.ElementType;
  asChild?: boolean;
  size?: "S" | "M" | "L";
}

export const Label = React.forwardRef<HTMLLabelElement, Props>(({
  children,
  label,
  secondary_label,
  required_label,
  size,
  directions,
  ...props

}, forwardedRef) => {
  return (
    <label
      className={cn(labelComponentVariants({ directions }))}
      ref={forwardedRef}
      {...props}
    >
      <p className={cn(mainLabelVariants({ size }))}>{label}</p>
      <p className={cn(secondaryLabelVariants({ size }))}>{secondary_label}</p>
      <p className={cn(requiredLabelVariants({ size }))}>{required_label}</p>
      {children}
    </label>
  );
});
Label.displayName = 'Label';
