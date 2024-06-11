import React from "react";
import { ButtonHTMLAttributes } from "react";
import { Button } from "../../../..";
import './style.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    isHover?: boolean;
    isSubTableActive?: boolean;
    forSubTable?: boolean;
    rtl?: boolean;
}

export const TableIconCell = React.forwardRef<HTMLButtonElement, Props>(({
    isHover,
    isSubTableActive,
    forSubTable,
    rtl,
    ...props
}, ref) => {
    return (
        <Button
            {...props}
            ref={ref}
            className={`TableIconCell${forSubTable ? `-For-SubTable${rtl ? "-RTL" : ""}` : ""} ${isHover ? 'show-TableIconCell' : ''} ${isSubTableActive ? `TableIconCell-subTable-active${rtl ? "-RTL" : ""}` : ''}`}
            component_size="S"
            left_icon={rtl ? <i className="ri-arrow-left-s-line"></i> : <i className="ri-arrow-right-s-line"></i>}
            component_style="PrimeContStyle"
        >
        </Button>
    );
});
