import { HTMLAttributes } from "react";
import './style.scss';
interface Props extends HTMLAttributes<HTMLButtonElement> {
    reverse_icon?: boolean
    disabled?: boolean
}
export function StepperPhoneArrow({ reverse_icon, disabled, ...props }: Props) {
    return (
        <button type="button" disabled={disabled} {...props} className={`glare-stepper-phone-arrow ${disabled ? "glare-stepper-phone-arrow-disabled" : ""}  ${props.className}`} >
            {
                reverse_icon ?
                    <i className="ri-arrow-right-double-fill"></i>
                    :
                    <i className="ri-arrow-left-double-line"></i>
            }
        </button>
    )
}
