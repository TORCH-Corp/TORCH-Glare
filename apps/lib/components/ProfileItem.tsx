import { HTMLAttributes, ReactNode, useEffect, useState } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../utils/cn";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

// Define the base styles and variants using `cva`
export const profileItemStyles = cva(
    "flex items-center justify-between group w-full p-[6px] outline-none rounded-[8px] fucus:bg-background-system-action-primary-selected active:bg-background-system-action-primary-selected transition-all ease-in-out duration-150",
    {
        variants: {
            selected: {
                true: "bg-background-system-action-primary-selected",
            }
        },
    }
);

interface ProfileItemProps extends HTMLAttributes<HTMLButtonElement> {
    label: ReactNode;
    selected?: boolean
    icon?: string;
    theme?: "dark" | "light" | "default";
    popoverChildren?: ReactNode
    overlayBlur?: boolean
}

export const ProfileItem: React.FC<ProfileItemProps> = ({
    label,
    selected,
    icon,
    theme,
    className,
    popoverChildren,
    overlayBlur,
    ...props
}) => {

    const [isOpen, setIsOpen] = useState(selected);
    const [dropdownWidth, setDropdownWidth] = useState(0);

    useEffect(() => {
        setIsOpen(selected);
    }, [selected])
    return (
        <Popover onOpenChange={(open) => setIsOpen(open)} >
            <PopoverTrigger asChild>
                <button
                    {...props}
                    data-theme={theme}
                    className={cn(
                        profileItemStyles({ selected }),
                        className
                    )}
                    onPointerDown={(e: any) => {
                        props.onPointerDown && props.onPointerDown(e);
                        setDropdownWidth(e.currentTarget.offsetWidth);
                    }}
                >
                    <div className="flex items-center gap-2">
                        <div className="flex items-center">
                            <span className="h-[28px] w-[2px] bg-transparent group-hover:bg-[#9748FF] group-hover:mr-[6px] transition-all ease-in-out duration-150"></span>
                            <img className="w-[28px] h-[28px] rounded-full object-cover" src={icon} alt="" />
                        </div>

                        <p
                            className={cn(
                                "typography-body-medium-medium text-content-system-global-primary",
                            )}
                        >
                            {label}
                        </p>
                    </div>


                    <i className={cn("ri-arrow-down-s-line text-[18px] text-content-system-global-primary group-hover:text-[#9748FF] transition-all ease-in-out duration-150", { "rotate-180": isOpen && popoverChildren })}></i>
                </button>
            </PopoverTrigger>
            {
                popoverChildren &&
                <PopoverContent
                    overlayBlur={overlayBlur}
                    style={{ width: `${dropdownWidth}px` }}
                    theme={theme}>
                    {popoverChildren}
                </PopoverContent>
            }
        </Popover>
    );
};

