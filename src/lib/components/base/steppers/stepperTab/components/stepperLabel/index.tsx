import { ButtonHTMLAttributes } from 'react'
import './style.scss'
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    stepper_label: string
    is_selected?: boolean
}
export function StepperLabel(props: Props) {
    return (
        <button type='button' dir='ltr' className={`stepper-tab-label ${props.is_selected ? "stepper-tab-label-selected" : ""}`} >
            <div className='stepper-tab-label-icon'><i className="ri-arrow-left-double-line"></i></div >
            <p className="stepper-tab-label-text">{props.stepper_label}</p>
            <div className='stepper-tab-label-icon'> <i className="ri-arrow-right-double-line"></i></div >
        </button>
    )
}
