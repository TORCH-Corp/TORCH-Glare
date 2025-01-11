import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import './style.scss';
import { TextField } from '@radix-ui/themes';
import "@radix-ui/themes/styles.css";
import { cva } from 'class-variance-authority';
import { cn } from '@/utils';
import "@/styles/typography_2/index.scss"

const inputFieldStyles = cva([
    "flex ",
    "Body-typography-Small-Regular",
    "text-[--content-presentation-action-light-secondary]",
    "border border-[--border-presentation-action-primary]",
    "bg-[--background-presentation-form-field-primary]",  // 
    "rounded-[4px]",
    "p-0",
    "transition-all duration-200 ease-in-out",
    "hover:shadow-[0px_1px_6px_0px_rgba(0,0,0,0.30)]",
    "hover:bg-[--background-presentation-form-field-hover]",
    "hover:border-[--border-presentation-action-hover]",
    "hover:text-[--content-presentation-action-light-primary]",
    "hover:placeholder:text-[--content-presentation-action-light-primary]",
    "hover:caret-[--content-presentation-action-information-hover]",
    "focus:border-[--border-presentation-state-focus]",
    "focus:bg-[--background-presentation-form-field-primary]",
    "focus:shadow-[0px_1px_6px_0px_rgba(0,0,0,0.30)]",
    "active:border-[--border-presentation-state-focus]",
    "active:bg-[--background-presentation-form-field-primary]",
    "active:shadow-[0px_1px_6px_0px_rgba(0,0,0,0.30)]"
], {
    variants: {

    },
    defaultVariants: {

    },
});
interface Props extends InputHTMLAttributes<HTMLInputElement> {
    component_size?: "S" | "M" | "L"; // this is used to change the size style of the component
    negative?: boolean; // to have negative colors
    left_side_icon?: ReactNode; // to add left side icon if you pass it 
    trailing_label?: string; // to add trailing label
    drop_down_list_child?: ReactNode; // to add drop down list if you pass it
    action_button?: ReactNode; // to add action button to the end of the input 
    badges_children?: ReactNode | ReactNode[]; // to add badges components inside the component if you pass it
    error_message?: string; // to show tooltip component when error_message not null
}

export const InputField = forwardRef<HTMLInputElement, Props>(({
    component_size,
    negative,
    left_side_icon,
    trailing_label,
    drop_down_list_child,
    action_button,
    badges_children,
    error_message,
    className,
    ...props
}, ref) => {

    return (
        <TextField.Root
            className={cn(inputFieldStyles(), className)}
            placeholder="Search the docs…"
            variant="classic"
        >
            <TextField.Slot
                side='right'
            >
                <i className="ri-pause-circle-fill"></i>
            </TextField.Slot>
        </TextField.Root>
    )
});






