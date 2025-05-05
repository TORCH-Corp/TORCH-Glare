import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/utils/cn";
import { cva } from "class-variance-authority";
import { HTMLAttributes, InputHTMLAttributes, ReactNode, useEffect, useRef, useState } from "react";

interface SimpleSelectDropDownProps {
    className?: string;
    children: ReactNode;
    onClick?: () => void;
}

const SimpleSelectDropDown = ({ className, children, onClick }: SimpleSelectDropDownProps) => {
    return (
        <div className={cn("absolute min-w-[100px] z-[20] top-[27px] left-0", dropdownMenuStyles({ variant: "SystemStyle" }), className)} onClick={onClick}>
            {children}
        </div>
    );
};

interface SimpleSelectItemProps
    extends HTMLAttributes<HTMLLIElement> {
    selected?: boolean
}

const SimpleSelectItem = ({ selected, ...props }: SimpleSelectItemProps) => {

    const ref = useRef<HTMLLIElement>(null);

    // Scroll to the selected item when the dropdown is opened
    useEffect(() => {
        if (selected && ref.current) {
            ref.current.scrollIntoView({ behavior: "auto", block: "center" });
        }
    }, [selected]);

    return (
        <li {...props} ref={ref} className={cn(" whitespace-nowrap z-[9999]", MenuItemStyles({ variant: "SystemStyle", selected: selected, size: "S" }))}>
            {props.children}
        </li>
    )
}

interface SimpleSelectValueProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    inputClassName?: string;
    onChange?: (value: string) => void;
    defaultOpen?: boolean;
    className?: string;
}

const SimpleSelectValue = ({
    inputClassName,
    children,
    onChange,
    defaultOpen = false,
    className,
    ...props
}: SimpleSelectValueProps) => {
    const [active, setActive] = useState(defaultOpen);
    const sectionRef = useClickOutside(() => setActive(false), () => setActive(true));

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };

    return (
        <div
            ref={sectionRef as any}
            className={cn([
                "relative flex justify-between items-center",
                "bg-black-alpha-20",
                "text-white",
                "border-[#2C2D2E]",
                active ? "border-[#9748FF] bg-purple-alpha-10" : "",
                "hover:border-[#9748FF]",
                "hover:bg-purple-alpha-10",
                "typography-body-small-regular leading-0",
                "border",
                "transition-all duration-200 ease-in-out",
                "h-[26px]",
                "w-fit",
                "rounded-[6px]",
                "outline-none",
                "pl-[8px]",
                className,
            ])}>
            <input
                {...props}
                onChange={handleInputChange}
                className={cn([
                    "bg-transparent",
                    "text-white",
                    "h-[24px]",
                    "border-none",
                    "outline-none",
                    "typography-body-small-regular leading-0",
                ], inputClassName)}
            />
            <button
                type="button"
                className="flex items-center"
            >
                <i className={cn("ri-arrow-down-s-fill text-[12px] text-[#9748FF] px-1", {
                    "transform rotate-180": active
                })}></i>
            </button>
            {children && active && (
                <SimpleSelectDropDown onClick={() => setActive(false)}>
                    {children}
                </SimpleSelectDropDown>
            )}
        </div>
    );
};

export { SimpleSelectValue, SimpleSelectItem, SimpleSelectDropDown };

export const MenuItemStyles = cva(
    [
        "text-content-presentation-action-light-primary",
        "outline-none",
        "border",
        "border-transparent",
        "flex",
        "gap-[8px]",
        "items-center",
        "justify-start",
        "text-overflow",
        "overflow-hidden",
        "px-[12px]",
        "rounded-[4px]",
        "transition-all",
        "ease-in-out",
        "duration-300",
    ],
    {
        variants: {
            variant: {
                SystemStyle: [
                    "bg-background-system-body-primary",
                    "text-content-system-global-primary",
                    "hover:!bg-background-system-action-secondary-hover",
                    "hover:!text-content-system-action-primary-hover",
                    "hover:!border-border-system-action-primary-hover",
                    "focus:bg-background-system-action-primary-hover",
                    "focus:border-transparent",
                    "active:border-transparent",
                    "active:bg-background-system-action-primary-hover",
                    "disabled:bg-background-system-body-secondary",
                    "disabled:text-content-system-global-disabled",
                ],
            },
            size: {
                S: ["typography-body-small-regular", "h-[24px]"],
                M: ["typography-body-medium-regular", "h-[32px]"],
            },

            disabled: {
                true: [
                    "text-content-presentation-state-disabled",
                    "bg-white-00",
                ],
            },

            selected: {
                true: [
                    "bg-background-presentation-action-selected",
                    "text-content-presentation-action-light-primary",
                ],
            },

            defaultVariants: {
                variant: "Default",
                size: "M",
                active: false,
                disabled: false,
            },
        }
    }
);

export const dropdownMenuStyles = cva(
    [
        "p-1",
        "rounded-[8px]",
        "border",
        "max-h-[200px]",
        "outline-none",
        "overflow-scroll",
        "data-[state=open]:animate-in",
        "data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0",
        "data-[state=open]:fade-in-0",
        "overflow-x-hidden",
        "scrollbar-hide",
    ],
    {
        variants: {
            variant: {
                SystemStyle: [
                    "border-border-system-global-secondary",
                    "bg-background-system-body-primary",
                    "shadow-[0px_0px_18px_0px_rgba(0,0,0,0.75)]",
                ]
            },
            defaultVariants: {
                variant: "SystemStyle",
            },
        },
    }
);



