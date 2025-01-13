import { forwardRef, InputHTMLAttributes, ReactNode, useState } from 'react';
import { cva } from 'class-variance-authority';
import "@/styles/typography_2/index.scss"
import { InputField } from '../inputField_v2';
import { cn } from '@/lib/utils';



const labelLessInputStyles = cva([
    "px-[3px]",
    "Body-typography-Small-Regular",
    "text-[--content-presentation-global-primary]",
    "flex",
    "items-center",
], {
    variants: {
        variant: {

        },
        size: {
            S: [
                "",
            ],
            M: [
                "",
            ]
        }
    },
    defaultVariants: {
        size: "S"
    }
})

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'variant'> {
    size?: "S" | "M"  // this is used to change the size style of the component
    variant?: "systemStyle"
    icon?: ReactNode; // to add left side icon if you pass it 
    childrenSide?: ReactNode; // to add action button to the end of the input 
    dropDownListChildren?: ReactNode; // to add drop down list if you pass it
    errorMessage?: string; // to show tooltip component when error_message not null
    onTable?: boolean; // to change the border style of the component when it is on table
    required?: boolean; // to show required icon
}

export const LabelLessInput = forwardRef<HTMLInputElement, Props>(({
    size = "S",
    icon,
    childrenSide,
    dropDownListChildren,
    errorMessage,
    onTable,
    variant,
    className,
    required,
    ...props
}, ref) => {

    const [fucus, setFucus] = useState(false)

    return (
        <InputField
            {...props}

            onFocus={(e) => {
                setFucus(true)
                props.onFocus && props.onFocus(e)
            }}
            onBlur={(e) => {
                setFucus(false)
                props.onBlur && props.onBlur(e)
            }}
            ref={ref}
            size={size}
            variant={variant}
            childrenSide={childrenSide}
            dropDownListChildren={dropDownListChildren}
            errorMessage={errorMessage}
            onTable={onTable}
            icon={
                <section className='flex items-center'>
                    <section className={cn(labelLessInputStyles({}))}>
                        <p className={cn(
                            "transition-all",
                            "duration-300",
                            "ease-in-out",
                            { "text-[--content-presentation-global-secondary]": fucus },
                            { "Labels-typography-Small-Regular": fucus },
                        )}>Label</p>
                        {required && <p className='text-[--content-presentation-state-negative]'>*</p>}
                    </section>
                    <span className={cn("w-[1px]",
                        "h-[12px]",
                        "bg-[--border-presentation-action-primary] ",
                        "transition-all",
                        "duration-300",
                        "ease-in-out",
                        "rounded-full",
                        { "h-[22px]": fucus },
                        { "bg-[--border-presentation-action-hover]": fucus },
                    )} />
                </section>
            }
        />
    )
});