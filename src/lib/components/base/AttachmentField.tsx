import { forwardRef, InputHTMLAttributes } from "react";
import { Button } from "./Button";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/utils";

const dropZoneStyles = cva(
  [
    "w-full min-w-[200px] h-[65px] flex flex-col rounded-lg border-dashed !border-2 transition-all duration-300 ease-in-out ",
    "!border-[var(--border-presentation-action-borderstyle)] bg-[var(--background-presentation-badge-gray)]",
    "hover:border-[var(--border-presentation-action-borderstyle)]  hover:bg-[var(--background-presentation-badge-gray)]",
  ],
  {
    variants: {
      active: {
        true: "bg-[var(--background-presentation-action-hovercontstyle)] border-[var(--border-presentation-badge-gray)]",
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
  theme?: "dark" | "light" | "default"
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
      ...props
    }: Props,
    ref
  ) => {
    return (
      <Button
        theme={theme}
        component_style="PrimeContStyle"
        {...getRootProps?.()}
        className={cn(dropZoneStyles({ active: isDropAreaActive }))}
      >
        <h1 className="text-[--content-presentation-action-light-primary] typography-body-large-medium">
          {mainLabel}
        </h1>
        <p className="text-[--content-presentation-action-light-secondary] typography-body-small-medium">
          {secondaryLabel}
        </p>
        <input ref={ref} {...props} {...getInputProps?.()} type="file" hidden />
      </Button>
    );
  }
);

AttachmentField.displayName = "AttachmentField"
