import { cn } from '@/utils/cn';
import { Slot } from '@radix-ui/react-slot';
import { cva, VariantProps } from 'class-variance-authority';
import React, { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import Counter from './Counter';
import { Tooltip } from './Tooltip';

const SideBarItemStyles = cva([
    "h-[40px] w-full px-[14px] flex gap-[6px] typography-body-small-medium justify-start items-center",
    "text-content-system-global-primary border-l-[2px] rtl:border-r-[2px] border-transparent outline-none",
    "hover:bg-white-alpha-075 hover:border-black-300 hover:text-content-system-action-primary-hover",
    "rounded-r-[4px] text-start whitespace-nowrap"

],
    {
        variants: {
            disabled: {
                true: "text-content-system-global-disabled bg-transport hover:bg-transport fucus:bg-transport active:bg-transport"
            },
            active: {
                true: ""
            },
            iconOnly: {
                true: "w-[40px] justify-center overflow-hidden"
            },
            variant: {
                default: [
                    "fucus:bg-background-system-action-primary-hover fucus:border-border-system-action-primary-hover"],
                secondary: [
                    "focus:bg-wavy-navy-1000 focus:border-border-system-action-field-hover-selected",
                ],

            }
        },
        compoundVariants: [
            {
                active: true,
                variant: "default",
                className: [
                    "bg-background-system-action-primary-hover border-border-system-action-primary-hover",
                ]
            },
            {
                active: true,
                variant: "secondary",
                className: [
                    "bg-wavy-navy-1000 border-border-system-action-field-hover-selected",
                ]
            },
            {
                active: true,
                disabled: true,
                variant: "secondary",
                className: [
                    "bg-transport hover:bg-transport focus:bg-transport active:bg-transport",
                ]
            },
            {
                active: true,
                disabled: true,
                variant: "default",
                className: [
                    "bg-transport hover:bg-transport focus:bg-transport active:bg-transport",
                ]
            }
        ],
        defaultVariants: {
            variant: "default",
        },
    });

interface Props
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof SideBarItemStyles> {
    asChild?: boolean;
    as?: React.ElementType;
    theme?: "dark" | "light" | "default"
    variant?: "default" | "secondary"
    iconOnly?: boolean
    active?: boolean
    disabled?: boolean
}
export const SideBarItem = ({ active, disabled, iconOnly, asChild, as: Tag = "button", theme, variant, ...props }: Props) => {
    const Component = asChild ? Slot : Tag;

    return (
        <Component  {...props} data-theme={theme} disabled={disabled} className={cn(SideBarItemStyles({ variant, iconOnly, active, disabled }), props.className)}>

        </Component>
    )
}


const SideBarIconButtonStyles = cva([
    "h-[36px] w-[36px] flex  text-content-system-global-primary text-[20px] justify-center items-center rounded-[8px] border border-transparent outline-none",
    "fucus:bg-border-system-action-primary-Hover active:bg-border-system-action-primary-Hover",
    "transition-all duration-200 ease-in-out flex-shrink-0 m-[5px] relative",
],
    {
        variants: {
            active: {
                true: ""
            },
            variant: {
                default: ["hover:bg-background-system-action-secondary-hover hover:border-border-system-action-primary-hover"],
                secondary: ["hover:bg-wavy-navy-1000 hover:border-border-system-action-field-hover-selected"],

            }
        },
        compoundVariants: [
            {
                active: true,
                variant: "default",
                className: [
                    "bg-background-system-action-secondary-hover border-border-system-action-primary-hover"]
            },
            {
                active: true,
                variant: "secondary",
                className: [
                    "bg-background-system-action-secondary-hover border-border-system-action-primary-hover"
                ]
            }
        ],
        defaultVariants: {
            variant: "default",
        },
    });


interface SideBarIconButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof SideBarItemStyles> {
    asChild?: boolean;
    as?: React.ElementType;
    theme?: "dark" | "light" | "default"
    variant?: "default" | "secondary"
    active?: boolean
    count?: number
    message?: ReactNode
    disabled?: boolean
}


export const SideBarIconButton = ({ count, active, asChild, message, as: Tag = "button", theme, variant, ...props }: SideBarIconButtonProps) => {
    const Component = asChild ? Slot : Tag;

    return (
        message ?
            <Tooltip variant={"highlight"} text={message} toolTipSide='left' className='z-[1000]'>
                <Component {...props} data-theme={theme} className={cn(SideBarIconButtonStyles({ variant, active }))}>
                    {props.children}
                    {count && <Counter className=' absolute top-[2px] right-[2px]' label={count} />}
                </Component>
            </Tooltip>
            :
            <Component {...props} data-theme={theme} className={cn(SideBarIconButtonStyles({ variant, active }))}>
                {props.children}
                {count && <Counter className=' absolute top-[2px] right-[2px]' label={count} />}
            </Component>
    )
}



