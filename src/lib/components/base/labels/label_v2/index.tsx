import { LabelHTMLAttributes, ReactNode } from "react";
import "./style.scss";
import React from "react";
import { extractProps } from "@radix-ui/themes/helpers";
import { Slot } from '@radix-ui/react-slot';
import { cn } from "../../../../../utils";
import { cva } from "class-variance-authority";
import '../../../../styles/typography_2/index.scss';

const labelComponentVariants = cva("flex", {
  variants: {
    component_style: {
      vertical: "flex-col justify-start items-start",
      horizontal: "flex-row justify-start items-end gap-1",
    }
  },
  defaultVariants: {
    component_style: "horizontal",
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



interface Props extends LabelHTMLAttributes<HTMLLabelElement> {
  label?: ReactNode; // main label
  required_label?: ReactNode; // normal text with required style
  secondary_label?: ReactNode; //normal text with secondary style
  component_size?: "S" | "M" | "L"; // this is used to change the size style of the component
  component_style?: "vertical" | "horizontal"; // this is used to change the set of labels direction
  as_child?: boolean; // this is used to make the label color same as the parent component
  as?: React.ElementType;
  asChild?: boolean;
  children?: ReactNode;
}

export const Label = React.forwardRef<HTMLLabelElement, Props>((props, forwardedRef) => {
  const {
    children,
    label,
    secondary_label,
    required_label,
    component_size,
    component_style,
    className,
    asChild,
    as: Tag = 'span',
    ...restProps
  } = extractProps(props);
  const Component = asChild ? Slot : Tag;
  return (
    <Component
      className={cn(labelComponentVariants({ component_style: component_style }), className)}
      ref={forwardedRef}
      {...restProps}
    >
      <>
        <p className={cn(mainLabelVariants({ size: component_size }))}>{label}</p>
        <p className={cn(secondaryLabelVariants({ size: component_size }))}>{secondary_label}</p>
        <p className={cn(requiredLabelVariants({ size: component_size }))}>{required_label}</p>
        {children}
      </>
    </Component>
  );
});
Label.displayName = 'Label';

{/* <section
  {...props}
  className={`glare-label ${component_size} ${component_style} ${disabled ? "disabled" : ""} child-dir-${child_dir} ${className} glare-label-${theme}`}
>
  <label className="label-container" htmlFor={name}>
    {label && (
      <span className={`label ${as_child ? "as-child" : ""}`}>{label}</span>
    )}
    {secondary_label && <p className="secondaryLabel">{secondary_label}</p>}
    {required_label && (
      <span className="requiredLabel">{required_label}</span>
    )}
  </label>
  {children}
</section> */}