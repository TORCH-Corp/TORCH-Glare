import { ButtonHTMLAttributes } from "react";
import { Button } from "../../../../main";
import './style.scss'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    isHover?: boolean
    isSubTableActive?: boolean
    forSubTable?: boolean
    rtl?: boolean
}
export function TableIconCell(props: Props) {
    return (
        <Button
            {...props}
            className={
                `${props.forSubTable ? `TableIconCell-For-SubTable${props.rtl ? "-RTL" : ""}` : `TableIconCell`} 
            ${props.isHover && 'show-TableIconCell'} 
            ${props.isSubTableActive && `TableIconCell-subTable-active${props.rtl ? "-RTL" : ""}`}`}

            component_size="S"

            left_icon={props.rtl ? <i className="ri-arrow-left-s-line"></i> : <i className="ri-arrow-right-s-line"></i>}
            component_style='PrimeContStyle'
        > </Button>
    )
}
