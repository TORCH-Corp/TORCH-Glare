import { cva } from "class-variance-authority";

export const inputFieldStyles = cva([
    "flex ",
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
                systemStyle: [
                    "border-[#2C2D2E]",
                    "bg-[--black-alpha-20]",
                    "hover:border-[#9748FF]",
                    "hover:bg-[--purple-alpha-10]",
                    "focus:bg-[#000000]",
                    "active:bg-[#000000]",
                ]
            }
            ,
            fucus: {
                true: [
                    "border-[--border-presentation-state-focus]",
                    "bg-[--background-presentation-form-field-primary]",
                    "shadow-[0px_1px_6px_0px_rgba(0,0,0,0.30)]",
                    "hover:border-[--border-presentation-state-focus]"
                ]
            },
            onTable: {
                true: [
                    "border-transparent",
                    "bg-transparent",
                    "h-[26px]"
                ]
            },
            error: {
                true: [
                    "border-[--border-presentation-state-negative]",
                    "caret-[--border-presentation-state-negative]",
                    "hover:border-[--border-presentation-state-negative]",
                    "hover:caret-[--border-presentation-state-negative]",
                ]
            },
            disabled: {
                true: [
                    "border-[--border-presentation-action-disabled]",
                    "bg-[--background-presentation-action-disabled]",
                ]
            },
            size: {
                S: [
                    "h-[30px]",
                    "rounded-[6px]",
                ],
                M: [
                    "h-[40px]",
                    "rounded-[8px]",
                ]
            }
        },
        defaultVariants: {
            fucus: false,
            disabled: false,
            error: false,
            onTable: false,
            size: "M"
        },
        compoundVariants: [
            {
                disabled: true,
                className: [
                    "border-[--border-presentation-action-disabled]",
                    "bg-[--background-presentation-action-disabled]",
                    "hover:border-[--border-presentation-action-disabled]",
                    "hover:bg-[--background-presentation-action-disabled]",
                ]
            },
            {
                onTable: true,
                className: [
                    "h-[26px]"
                ]
            }, {
                variant: "systemStyle",
                fucus: true,
                className: [
                    "bg-[#000000]",
                    "hover:bg-[#000000]",
                ]
            }
        ]
    });

export const iconContainerStyles = cva([
    "flex items-center justify-center",
    "transition-all duration-200 ease-in-out",
    "leading-0",
    "text-[16px]",
    "text-[--content-presentation-action-light-secondary]",
], {
    variants: {
        variant: {
            systemStyle: [
                "",
            ]
        },
        fucus: {
            true: ""
        },
        size: {
            S: [
                "text-[16px]",
            ],
            M: [
                "text-[18px]",
                "px-[2px]"
            ]
        }
    },
    compoundVariants: [
        {
            variant: "systemStyle",
            fucus: true,
            className: [
                "text-white",
            ]
        }
    ],
    defaultVariants: {
        size: "M"
    }
})

export const childrenContainerStyles = cva([
    "flex items-center justify-end",
    "p-1",
    "absolute",
    "h-full",
    'bg-fade-gradient',
    "right-0",
    'rtl:pr-[20px]',
    'gap-1',
    "pl-[20px]",
    "rtl:pl-[4px]",
    "rtl:right-[unset]",
    "rtl:left-0",
    "rtl:bg-fade-gradient-reverse",
], {
    variants: {
        variant: {
            systemStyle: [
                "bg-fade-gradient-system-style",
                "rtl:bg-fade-gradient-system-style-reverse",
            ]
        },
        size: {
            S: [
                "rounded-[6px]",
            ],
            M: [
                "rounded-[8px]",
            ]
        }
    },
    defaultVariants: {
        size: "M"
    }
})
