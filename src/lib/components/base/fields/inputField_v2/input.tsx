import { forwardRef, InputHTMLAttributes } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/utils';
import "@/styles/typography_2/index.scss"

const inputFieldStyles = cva([
    "Body-typography-Small-Regular",
    "text-[--content-presentation-action-light-secondary]",
    "p-0",
    "rounded-[4px]",
    "bg-transparent",
    "flex-1",
    "outline-none",
    "transition-all duration-200 ease-in-out",
    "hover:placeholder:text-[--content-presentation-action-light-primary]",
], {
    variants: {
    },
    defaultVariants: {
    },
});
interface Props extends InputHTMLAttributes<HTMLInputElement> {
    fucusSetter?: (fucus: boolean) => void
}

export const Input = forwardRef<HTMLInputElement, Props>(({
    ...props
}, ref) => {

    return (
        <input
            className={cn(inputFieldStyles({}))}
            onFocus={(e) => {
                props.fucusSetter && props.fucusSetter(true)
                props.onFocus && props.onFocus(e)
            }}
            onBlur={(e) => {
                props.fucusSetter && props.fucusSetter(false)
                props.onBlur && props.onBlur(e)
            }}
            ref={ref}
            {...props}
        />
    )
});






