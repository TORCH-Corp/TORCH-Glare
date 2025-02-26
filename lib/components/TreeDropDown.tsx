import { cn } from "../utils/cn";
import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes, ReactNode, useState } from "react";

const TreeDropDownVariants = cva("flex px-[6px] h-[40px] gap-2 justify-start items-center w-full mb-1", {
    variants: {},
    defaultVariants: {},
});

interface Props extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof TreeDropDownVariants> {
    theme?: "dark" | "light" | "default";
    treeLabel: ReactNode;
    open?: boolean;
}

export const TreeDropDown = ({ treeLabel, open, theme, ...props }: Props) => {
    const [isActive, setIsActive] = useState(open);

    return (
        <div {...props} className={cn("flex h-fit flex-col transition-all ease-in-out duration-500")}>
            <div onClick={() => setIsActive(!isActive)} data-theme={theme} className={cn(TreeDropDownVariants())}>
                <i className={cn("ri-arrow-down-s-line transition-transform ease-in-out flex justify-center items-center leading-0 bg-background-system-body-tertiary h-[28px] w-[28px] rounded-full text-[20px] text-content-system-global-primary", { "rotate-180": isActive })}></i>
                <p className={cn("text-content-system-global-primary typography-body-medium-medium")}>{treeLabel}</p>
            </div>
            <div className={cn("pl-[20px] relative overflow-scroll scrollbar-hide transition-all duration-500 ease-in-out", { "max-h-[2000px]": isActive, "max-h-0": !isActive })}>
                <span className="h-full w-[1px] bg-border-system-global-primary absolute left-[19px] top-0 rounded-sm" />
                <div className="h-full">{props.children}</div>
            </div>
        </div>
    );
};
