import { cn } from '@/utils/cn';
import { Slot } from '@radix-ui/react-slot';
import { cva, VariantProps } from 'class-variance-authority';
import React, { ButtonHTMLAttributes, ReactNode } from 'react'
import Counter from '../components/Counter';
import { Tooltip } from '../components/Tooltip';

const SideBarItemStyles = cva([
    "h-[40px] w-full px-[8px] flex gap-[6px] typography-body-small-medium justify-start items-center",
    "text-content-system-global-primary border-l-[2px] rtl:border-r-[2px] border-transparent outline-none",
    "hover:bg-white-alpha-075 hover:border-black-300 hover:text-content-system-action-primary-hover hover:px-[14px]",
    "rounded-r-[4px] text-start whitespace-nowrap transition-all duration-150 ease-in-out",

],
    {
        variants: {
            disabled: {
                true: "text-content-system-global-disabled bg-transparent hover:bg-transparent fucus:bg-transparent active:bg-transparent"
            },
            active: {
                true: "hover:px-[8px] !px-[8px]"
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
                    "bg-background-system-action-primary-hover border-border-system-action-primary-hover !px-[8px] hover:px-[8px]",
                ]
            },
            {
                active: true,
                variant: "secondary",
                className: [
                    "bg-wavy-navy-1000 border-border-system-action-field-hover-selected !px-[8px] hover:px-[8px]",
                ]
            },
            {
                disabled: true,
                variant: "secondary",
                className: [
                    "bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent hover:p-[8px] hover:text-content-system-global-disabled",
                ]
            },
            {
                disabled: true,
                variant: "default",
                className: [
                    "bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent hover:p-[8px] hover:text-content-system-global-disabled",
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



