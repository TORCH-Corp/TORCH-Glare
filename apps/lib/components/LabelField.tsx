import { InputHTMLAttributes, ReactNode, forwardRef } from "react";
import { InputField } from "./InputField";
import { Label } from "./Label";
import { ToolTipSide } from "./Tooltip";
import { Themes } from "../utils/types";

export interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "variant"> {
  size?: "S" | "M"; // this is used to change the size style of the component
  variant?: "SystemStyle" | "PresentationStyle";
  icon?: ReactNode; // to add left side icon if you pass it
  childrenSide?: ReactNode; // to add action button to the end of the input
  popoverChildren?: ReactNode; // to add drop down list if you pass it
  errorMessage?: string; // to show tooltip component when error_message not null
  onTable?: boolean; // to change the border style of the component when it is on table
  label?: ReactNode; // main label
  requiredLabel?: ReactNode; // normal text with required style
  secondaryLabel?: ReactNode; // normal text with secondary style
  labelDirections?: "vertical" | "horizontal"; // to change the direction of the label
  childrenDirections?: "vertical" | "horizontal"; // to change the direction of the children
  toolTipSide?: ToolTipSide;
  theme?: Themes
}

export const LabelField = forwardRef<HTMLInputElement, Props>(
  (
    {
      label,
      requiredLabel,
      secondaryLabel,
      size,
      variant,
      theme,
      icon,
      childrenSide,
      popoverChildren,
      errorMessage,
      onTable,
      className,
      labelDirections,
      childrenDirections,
      toolTipSide,

      ...props
    },
    ref
  ) => {
    return (
      <Label
        data-theme={theme}
        label={label}
        requiredLabel={requiredLabel}
        secondaryLabel={secondaryLabel}
        labelDirections={labelDirections}
        childrenDirections={childrenDirections}
        variant={variant}
        className={className}
      >
        <InputField
          {...props}
          theme={theme}
          ref={ref}
          size={size}
          icon={icon}
          toolTipSide={toolTipSide}
          variant={variant}
          childrenSide={childrenSide}
          popoverChildren={popoverChildren}
          errorMessage={errorMessage}
          onTable={onTable}
        />
      </Label>
    );
  }
);

LabelField.displayName = "LabelField";
