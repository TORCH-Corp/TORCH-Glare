import { forwardRef, InputHTMLAttributes, ReactNode, useState } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/utils';
import "@/styles/typography_2/index.scss"
import { Input } from './input';

const inputFieldStyles = cva([
    "flex ",
    "Body-typography-Small-Regular",
    "text-[--content-presentation-action-light-secondary]",
    "border border-[--border-presentation-action-primary]",
    "bg-[--background-presentation-form-field-primary]",
    "rounded-[4px]",
    "p-0",
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
                "caret-[--border-presentation-state-negative]"
            ]
        },
        disabled: {
            true: [
                "border-[--border-presentation-action-disabled]",
                "bg-[--background-presentation-action-disabled]",
            ]
        }
    },
    defaultVariants: {
        fucus: false,
        disabled: false,
        error: false
    },
    compoundVariants: [
        {
            error: true,
            fucus: true,
            className: [
                "border-[--border-presentation-state-negative]",
                "caret-[--border-presentation-state-negative]",
            ]
        },
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
interface Props extends InputHTMLAttributes<HTMLInputElement> {
    component_size?: "S" | "M" | "L"; // this is used to change the size style of the component
    leftSideChild?: ReactNode; // to add left side icon if you pass it 
    trailing_label?: string; // to add trailing label
    rightSideChild?: ReactNode; // to add action button to the end of the input 
    drop_down_list_child?: ReactNode; // to add drop down list if you pass it
    errorMessage?: string; // to show tooltip component when error_message not null
}

export const InputField = forwardRef<HTMLInputElement, Props>(({
    component_size,
    leftSideChild,
    rightSideChild,
    drop_down_list_child,
    errorMessage,
    className,
    ...props
}, ref) => {

    const [fucus, setFucus] = useState(false)

    return (
        <section className={cn(inputFieldStyles(
            {
                fucus,
                error: errorMessage !== undefined,
                disabled: props.disabled
            }))}>

            <Input fucusSetter={setFucus} ref={ref}  {...props} />
        </section>
    )
});






