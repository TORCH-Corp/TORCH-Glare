import { cva } from "class-variance-authority";

export const inputFieldStyles = cva(
  [
    "flex ",
    "flex-1",
    "flex-col",
    "typography-body-small-regular",
    "border border-[--border-presentation-action-primary]",
    "bg-[--background-presentation-form-field-primary]",
    "transition-all duration-200 ease-in-out",
    "hover:shadow-[0px_1px_6px_0px_rgba(0,0,0,0.30)]",
    "hover:bg-[--background-presentation-form-field-hover]",
    "hover:border-[--border-presentation-action-hover]",
    "hover:text-[--content-presentation-action-light-primary]",
    "hover:caret-[--content-presentation-action-information-hover]",
  ],
  {
    variants: {
      variant: {
        SystemStyle: [
          "border-[--border-system-global-secondary]",
          "bg-[--background-presentation-form-field-primary]",
          "hover:border-[#9748FF]",
          "hover:bg-[--purple-alpha-10]",
        ],
      },
      fucus: {
        true: [
          "border-[--border-presentation-state-focus]",
          "bg-[--background-presentation-form-field-primary]",
          "shadow-[0px_1px_6px_0px_rgba(0,0,0,0.30)]",
          "hover:border-[--border-presentation-state-focus]",
          "caret-[--border-presentation-state-focus]",
          "hover:caret-[--border-presentation-state-focus]",
        ],
      },
      onTable: {
        true: ["border-transparent", "bg-transparent", "h-[26px]"],
      },
      error: {
        true: [
          "border-[--border-presentation-state-negative]",
          "caret-[--border-presentation-state-negative]",
          "hover:border-[--border-presentation-state-negative]",
          "hover:caret-[--border-presentation-state-negative]",
        ],
      },
      disabled: {
        true: [
          "border-[--border-presentation-action-disabled]",
          "bg-[--background-presentation-action-disabled]",
        ],
      },
      size: {
        S: ["h-[30px]", "rounded-[6px]"],
        M: ["h-[40px]", "rounded-[8px]"],
      },
    },
    defaultVariants: {
      fucus: false,
      disabled: false,
      error: false,
      onTable: false,
      size: "M",
    },
    compoundVariants: [
      {
        disabled: true,
        className: [
          "border-[--border-presentation-action-disabled]",
          "bg-[--background-presentation-action-disabled]",
          "hover:border-[--border-presentation-action-disabled]",
          "hover:bg-[--background-presentation-action-disabled]",
        ],
      },
      {
        onTable: true,
        className: ["h-[26px]"],
      },
      {
        variant: "SystemStyle",
        fucus: true,
      },
    ],
  }
);

export const iconContainerStyles = cva(
  [
    "flex items-center justify-center",
    "transition-all duration-200 ease-in-out",
    "leading-0",
    "text-[16px]",
    "text-[--content-presentation-action-light-secondary]",
  ],
  {
    variants: {
      variant: {
        SystemStyle: [""],
      },
      fucus: {
        true: "",
      },
      size: {
        S: ["text-[16px]"],
        M: ["text-[18px]", "px-[2px]"],
      },
    },
    compoundVariants: [
      {
        variant: "SystemStyle",
        fucus: true,
        className: ["text-white"],
      },
    ],
    defaultVariants: {
      size: "M",
    },
  }
);
