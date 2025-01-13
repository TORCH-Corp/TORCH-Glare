import { forwardRef, InputHTMLAttributes, ReactNode, useState } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/utils';
import "@/styles/typography_2/index.scss"
import { Input } from '@/components/base/fields/Input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/base/dropDowns/popover';
import { Tooltip } from '@/components/base/tooltips/tooltip-v2';
import { ActionButton } from '@/components/base/buttons/actionButton';

const inputFieldStyles = cva([
    "flex ",
    "Body-typography-Small-Regular",
    "border border-[--border-presentation-action-primary]",
    "bg-[--background-presentation-form-field-primary]",
    "transition-all duration-200 ease-in-out",
    "hover:shadow-[0px_1px_6px_0px_rgba(0,0,0,0.30)]",
    "hover:bg-[--background-presentation-form-field-hover]",
    "hover:border-[--border-presentation-action-hover]",
    "hover:text-[--content-presentation-action-light-primary]",
    "hover:caret-[--content-presentation-action-information-hover]",
], {
    variants: {
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
        }
    ]
});

const iconContainerStyles = cva([
    "flex items-center justify-center",
    "leading-0",
    "text-[16px]",
    "text-[--content-presentation-action-light-secondary]",
], {
    variants: {
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
    defaultVariants: {
        size: "M"
    }
})

const childrenContainerStyles = cva([
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

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    size?: "S" | "M"  // this is used to change the size style of the component
    icon?: ReactNode; // to add left side icon if you pass it 
    childrenSide?: ReactNode; // to add action button to the end of the input 
    dropDownListChildren?: ReactNode; // to add drop down list if you pass it
    errorMessage?: string; // to show tooltip component when error_message not null
    onTable?: boolean; // to change the border style of the component when it is on table
}

export const InputField = forwardRef<HTMLInputElement, Props>(({
    size = "M",
    icon,
    childrenSide,
    dropDownListChildren,
    errorMessage,
    onTable,
    className,
    ...props
}, ref) => {

    const [fucus, setFucus] = useState(false)
    const [dropDownListWidth, setDropDownListWidth] = useState(0)

    // TODO: make the user input visible when input is focused

    return (
        <Popover open={fucus}>
            <PopoverTrigger asChild>
                <section
                    onFocus={(e) => setDropDownListWidth(e.currentTarget.offsetWidth)}
                    className={cn(inputFieldStyles(
                        {
                            fucus,
                            error: errorMessage !== undefined,
                            disabled: props.disabled,
                            size: size,
                            onTable: onTable
                        }))}>

                    <Tooltip open={errorMessage !== undefined} text={errorMessage} >
                        <section className='flex flex-row flex-1 px-[3px] gap-[4px] overflow-hidden relative'>
                            {icon && <div className={cn(iconContainerStyles({ size: size }))}>{icon}</div>}
                            <Input fucusSetter={setFucus} className={fucus ? `pr-[37px] rtl:pl-[35px] rtl:pr-[4px]` : ''} ref={ref}  {...props} />

                            <div className={cn(childrenContainerStyles({ size: size }))}>
                                {childrenSide}
                                {dropDownListChildren && <ActionButton asChild size={onTable ? "XS" : size} >
                                    <i>
                                        <i className={cn(
                                            'ri-arrow-down-s-line',
                                            'transition-[transform]',
                                            'duration-400',
                                            'ease-in-out',
                                            { 'rotate-180': fucus },
                                            { "text-[16px]": size === "S" && !onTable },
                                            { "text-[26px]": size === "M" && !onTable },
                                            { "text-[16px]": onTable }
                                        )} />
                                    </i>
                                </ActionButton>}
                            </div>
                        </section>

                    </Tooltip>
                </section>
            </PopoverTrigger>

            <PopoverContent
                onFocus={() => setFucus(true)}
                onPointerOver={() => setFucus(true)}
                onBlur={() => setFucus(false)}
                variant='SystemStyle' onOpenAutoFocus={(e) => e.preventDefault()} style={{ width: dropDownListWidth }}  >
                {dropDownListChildren}
            </PopoverContent>
        </Popover>
    )
});