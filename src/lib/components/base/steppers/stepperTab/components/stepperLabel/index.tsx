import { ButtonHTMLAttributes } from 'react'
import './style.scss'
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    stepper_label: string
    is_selected?: boolean
}
export function StepperLabel(props: Props) {
    return (
        <button type='button' dir='ltr' className={`stepper-tab-label ${props.is_selected ? "stepper-tab-label-selected" : ""}`} >
            <button type='button' className='stepper-tab-label-icon'><i className="ri-arrow-left-double-line"></i></button>
            <p className="stepper-tab-label-text">{props.stepper_label}</p>
            <button type='button' className='stepper-tab-label-icon'> <i className="ri-arrow-right-double-line"></i></button>
        </button>
    )
}
