import { HTMLAttributes, ReactNode } from "react";
import './style.scss'
import { cva } from "class-variance-authority";
import { cn } from "@/utils";
import { Label } from "@/components/base/labels/label_v2";


const FieldSectionVariants = cva("flex flex-row gap-[16px] flex-1 border-t border-[--border-presentation-global-primary] py-[16px] px-[12px]", {
    variants: {

    },
    defaultVariants: {
    },
});


interface Props extends HTMLAttributes<HTMLDivElement> {
    label?: ReactNode
    secondaryLabel?: ReactNode
    requiredLabel?: ReactNode
    size?: "S" | "M" | "L"
    childrenUnderLabel?: ReactNode
}


export function FieldSection({
    children,
    label,
    secondaryLabel,
    requiredLabel,
    size,
    childrenUnderLabel,
    ...props
}: Props) {

    return (
        <section {...props} className={cn(FieldSectionVariants())} >
            <section className="min-w-[350px] flex flex-col justify-start items-start gap-[8px]">
                <Label
                    size={size} label={label}
                    requiredLabel={requiredLabel}
                    directions={"horizontal"}
                />
                <Label
                    size={size}
                    secondaryLabel={secondaryLabel}
                />
                {childrenUnderLabel}
            </section>

            <section className="flex-1 flex flex-row flex-wrap gap-[8px]">
                {children}
            </section>
        </section>
    )
}
