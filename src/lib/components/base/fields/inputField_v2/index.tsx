import { forwardRef, InputHTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/utils';
import "@/styles/typography_2/index.scss"
import { Input } from './input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/base/dropDowns/dropdownMenu_v2';
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
}

export const InputField = forwardRef<HTMLInputElement, Props>(({
    size = "M",
    icon,
    childrenSide,
    dropDownListChildren,
    errorMessage,
    className,
    ...props
}, ref) => {

    const [fucus, setFucus] = useState(false)
    const [dropDownListWidth, setDropDownListWidth] = useState(0)
    const [isDropDownOpen, setIsDropDownOpen] = useState(false)
    const mainSectionRef = useRef<HTMLDivElement>(null)
    // to set the width of the dropdown menu

    useEffect(() => {
        if (mainSectionRef.current) {
            setDropDownListWidth(mainSectionRef.current.clientWidth)
        }
    }, [fucus])

    console.log(fucus)
    // TODO: make the user input visible when input is focused

    return (
        <DropdownMenu onOpenChange={(open) => {
            setIsDropDownOpen(open)
        }}>
            <section
                dir={props.dir}
                ref={mainSectionRef}
                className={cn(inputFieldStyles(
                    {
                        fucus,
                        error: errorMessage !== undefined,
                        disabled: props.disabled,
                        size: size
                    }))}>



                <Tooltip open={errorMessage !== undefined} text={errorMessage} >
                    <DropdownMenuTrigger asChild>
                        <section className='flex flex-row flex-1 px-[3px] gap-[4px] overflow-hidden relative'>
                            {icon && <div className={cn(iconContainerStyles({ size: size }))}>{icon}</div>}
                            <Input className={fucus ? `pr-[37px] rtl:pl-[35px] rtl:pr-[4px]` : ''} fucusSetter={setFucus} ref={ref}  {...props} />
                            <div className={cn(childrenContainerStyles({ size: size }))}>
                                {childrenSide}
                                {dropDownListChildren && <ActionButton size={size} ><i style={{ fontSize: `${size === "M" ? 26 : 16}px` }} className={`ri-arrow-down-s-line transition-[transform] duration-400 ease-in-out ${isDropDownOpen ? 'rotate-180' : ''}`}></i></ActionButton>}
                            </div>
                        </section>
                    </DropdownMenuTrigger>

                </Tooltip>
            </section>
            {dropDownListChildren &&
                <DropdownMenuContent style={{ width: dropDownListWidth }} variant="SystemStyle" >
                    {dropDownListChildren}
                </DropdownMenuContent>
            }
        </DropdownMenu>
    )
});