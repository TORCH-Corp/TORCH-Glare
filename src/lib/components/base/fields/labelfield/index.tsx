import { InputHTMLAttributes, ReactNode, forwardRef } from "react";
import { InputField } from "../inputField";
import { cn } from "@/utils";
import { Label } from "../../labels/label";

export interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "variant"> {
  size?: "S" | "M"; // this is used to change the size style of the component
  variant?: "SystemStyle";
  icon?: ReactNode; // to add left side icon if you pass it
  childrenSide?: ReactNode; // to add action button to the end of the input
  popoverChildren?: ReactNode; // to add drop down list if you pass it
  errorMessage?: string; // to show tooltip component when error_message not null
  onTable?: boolean; // to change the border style of the component when it is on table
  label?: ReactNode; // main label
  requiredLabel?: ReactNode; // normal text with required style
  secondaryLabel?: ReactNode; // normal text with secondary style
  labelDirections?: "vertical" | "horizontal"; // to change the direction of the label
}

export const LabelField = forwardRef<HTMLInputElement, Props>(
  (
    {
      label,
      requiredLabel,
      secondaryLabel,
      size,
      variant,
      icon,
      childrenSide,
      popoverChildren,
      errorMessage,
      onTable,
      className,
      labelDirections,
      ...props
    },
    ref
  ) => {
    return (
      <section className={cn("flex flex-col gap-1 flex-1 w-full", className)}>
        <Label
          label={label}
          requiredLabel={requiredLabel}
          secondaryLabel={secondaryLabel}
          directions={labelDirections}
        />
        <InputField
          {...props}
          ref={ref}
          size={size}
          icon={icon}
          variant={variant}
          childrenSide={childrenSide}
          popoverChildren={popoverChildren}
          errorMessage={errorMessage}
          onTable={onTable}
        />
      </section>
    );
  }
);

LabelField.displayName = "LabelField";
