import React, { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '../utils/cn'
import { cva } from 'class-variance-authority';

export const inputGroupStyles = cva(
    [
        "flex w-full min-w-0 px-1 justify-center items-center",
        "typography-body-small-regular",
        "border",
        "transition-all duration-200 ease-in-out",
        "hover:shadow-[0px_1px_6px_0px_rgba(0,0,0,0.30)]",
        "[&_i]:leading-[0px] leading-[0px]",
        '[&:has(input[data-error="true"])]:border-border-presentation-state-negative',
        '[&:has(input[data-error="true"])]:caret-border-presentation-state-negative',
        '[&:has(input[data-error="true"])]:hover:border-border-presentation-state-negative',
        '[&:has(input[data-error="true"])]:hover:caret-border-presentation-state-negative',
        '[&:has(input[disabled="true"])]:!border-border-presentation-action-disabled',
        '[&:has(input[disabled="true"])]:!bg-background-presentation-action-disabled',
        '[&:has(input[disabled="true"])]:hover:border-border-presentation-action-disabled',
        '[&:has(input[disabled="true"])]:hover:bg-background-presentation-action-disabled',
        '[&:has(input[data-table-input="true"])]:border-transparent',
        '[&:has(input[data-table-input="true"])]:bg-transparent',
        '[&:has(input[data-table-input="true"])]:h-[26px]',
    ],
    {
        variants: {
            variant: {
                PresentationStyle: [
                    "bg-background-presentation-form-field-primary",
                    "border-border-presentation-action-primary",
                    "hover:bg-background-presentation-form-field-hover",
                    "hover:border-border-presentation-action-hover",
                    "hover:text-content-presentation-action-light-primary",
                    '[&:has(input[data-focus="true"])]:border-border-presentation-state-focus',
                    '[&:has(input[data-focus="true"])]:bg-background-presentation-form-field-primary',
                    '[&:has(input[data-focus="true"])]:shadow-[0px_1px_6px_0px_rgba(0,0,0,0.30)]',
                    '[&:has(input[data-focus="true"])]:hover:border-border-presentation-state-focus',
                    '[&:has(input[data-focus="true"])]:caret-border-presentation-state-focus',
                    '[&:has(input[data-focus="true"])]:hover:caret-border-presentation-state-focus',
                ],
                SystemStyle: [
                    "bg-black-alpha-20",
                    "text-white",
                    "border-[#2C2D2E]",
                    "hover:border-[#9748FF]",
                    "hover:bg-purple-alpha-10",
                    '[&:has(input[data-focus="true"])]:border-border-presentation-state-focus',
                    '[&:has(input[data-focus="true"])]:shadow-[0px_1px_6px_0px_rgba(0,0,0,0.30)]',
                    '[&:has(input[data-focus="true"])]:hover:border-border-presentation-state-focus',
                    '[&:has(input[data-focus="true"])]:caret-border-presentation-state-focus',
                    '[&:has(input[data-focus="true"])]:hover:caret-border-presentation-state-focus',
                    '[&:has(input[data-focus="true"])]:hover:bg-black-alpha-20',
                ],
            },
            size: {
                S: ["h-[30px]", "rounded-[6px]"],
                M: ["h-[40px]", "rounded-[8px]"],
            },
        },
    }
);

interface InputGroupProps extends Omit<InputHTMLAttributes<HTMLDivElement>, "size"> {
    size?: 'S' | 'M';
    variant?: 'PresentationStyle' | 'SystemStyle';
}

export const InputGroup = ({ size = 'M', variant = "PresentationStyle", ...props }: InputGroupProps) => {
    return (
        <div
            className={cn(inputGroupStyles({ size, variant }))}
            {...props}>
        </div>
    )
}



interface IconProps {
    children: React.ReactNode;
    size?: 'S' | 'M';
    variant?: 'PresentationStyle' | 'SystemStyle';
}

export const Icon = ({ children, size = 'M', variant = 'PresentationStyle' }: IconProps) => {
    return (
        <div
            className={cn(
                "flex items-center justify-center",
                "transition-all duration-200 ease-in-out",
                "leading-0 text-content-presentation-action-light-secondary",
                size === 'S' && "text-[16px]",
                size === 'M' && "text-[18px] px-[2px]",
                variant === 'SystemStyle' && '[&:has(+input[data-focus="true"])]:text-white',
            )}>
            {children}
        </div>
    );
};


interface TrillingProps {
    children: React.ReactNode;
}
export const Trilling = ({ children }: TrillingProps) => {
    return (
        <div
            className={cn(
                "flex items-center justify-center h-full gap-1 py-1"
            )}
        >
            {children}
        </div>
    )
}




interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
    variant?: "SystemStyle" | "PresentationStyle";
    size?: "XS" | "S" | "M";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, variant = "PresentationStyle", size = "M", ...props }, ref) => {
        return (
            <input
                {...props}
                autoComplete="off"
                className={cn(
                    // Base styles
                    "typography-body-small-regular",
                    "text-content-presentation-action-light-primary",
                    "bg-transparent",
                    "h-full",
                    "px-[4px]",
                    "flex-[1_1_0%]",
                    "min-w-[30px]",
                    "outline-none",
                    "transition-all duration-200 ease-in-out",
                    "[mask-image:linear-gradient(to_right,black_0%,black_0%,black_85%,transparent_100%)]",
                    "rtl:[mask-image:linear-gradient(to_left,black_0%,black_0%,black_85%,transparent_100%)]",
                    "hover:placeholder:text-content-presentation-action-light-primary",

                    // Size variants
                    size === "XS" && "h-[26px] rounded-[6px]",
                    size === "S" && "h-[30px] rounded-[6px]",
                    size === "M" && "h-[40px] rounded-[8px]",

                    // Variant styles
                    variant === "SystemStyle" && [
                        "placeholder:text-[#A0A0A0]",
                        "hover:placeholder:text-[#A0A0A0]",
                        "text-white"
                    ],

                    className
                )}
                onFocus={(e) => {
                    e.currentTarget.setAttribute('data-focus', 'true');
                    props.onFocus && props.onFocus(e);
                }}
                onBlur={(e) => {
                    e.currentTarget.setAttribute('data-focus', 'false');
                    props.onBlur && props.onBlur(e);
                }}
                data-focus="false"
                ref={ref}
            />
        );
    }
);

Input.displayName = "Input";


/* // solution to fix autofill issue
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-transition: "color 1000s ease-out, background-color 1000s ease-out";
  -webkit-transition-delay: 1000s;
}
*/