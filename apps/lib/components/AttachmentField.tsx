import { forwardRef, InputHTMLAttributes } from "react";
import { Button } from "./Button";
import { cva } from "class-variance-authority";
import { cn } from "../utils/cn";
import { Themes } from "../utils/types";

const dropZoneStyles = cva(
  [
    "w-full min-w-[200px] h-[65px] flex flex-col rounded-lg border-dashed !border-2 transition-all duration-300 ease-in-out ",
    "!border-border-presentation-action-borderstyle bg-background-presentation-badge-gray",
    "hover:border-border-presentation-action-borderstyle  hover:bg-background-presentation-badge-gray",
  ],
  {
    variants: {
      active: {
        true: "bg-background-presentation-action-hovercontstyle border-border-presentation-badge-gray",
      },
    },
  }
);

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  getRootProps?: () => any;
  getInputProps?: () => any;
  isDropAreaActive?: boolean;
  mainLabel: string;
  secondaryLabel: string;
  theme?: Themes
}

export const AttachmentField = forwardRef<HTMLInputElement, Props>(
  (
    {
      getInputProps,
      getRootProps,
      isDropAreaActive,
      mainLabel,
      theme,
      secondaryLabel,
      className,
      ...props
    }: Props,
    ref
  ) => {
    return (
      <Button
        theme={theme}
        as="label"
        id={props.id}
        component_style="PrimeContStyle"
        {...getRootProps?.()}
        className={cn(dropZoneStyles({ active: isDropAreaActive }), className)}
      >
        <h1 className="text-content-presentation-action-light-primary typography-body-large-medium">
          {mainLabel}
        </h1>
        <p className="text-content-presentation-action-light-secondary typography-body-small-medium">
          {secondaryLabel}
        </p>
        <input ref={ref} {...props} {...getInputProps?.()} type="file" hidden />
      </Button>
    );
  }
);

AttachmentField.displayName = "AttachmentField"
