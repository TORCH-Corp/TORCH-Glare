import { ButtonHTMLAttributes } from 'react'
import './style.scss'
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    stepper_label: string
    is_selected?: boolean
    forward: any
    backward: any
    is_the_first: boolean
    is_the_last?: boolean
}
export function StepperLabel({ stepper_label, is_selected, forward, backward, is_the_first, is_the_last, ...props }: Props) {
    return (
        <section {...props} dir='ltr' className={`stepper-tab-label ${is_selected ? "stepper-tab-label-selected" : ""}`} >
            <button disabled={is_the_first} onClick={backward} type='button' className={`stepper-tab-label-icon ${is_the_first ? "stepper-tab-button-disabled" : ""}`}><i className="ri-arrow-left-double-line"></i></button >
            <p className="stepper-tab-label-text">{stepper_label}</p>
            <button disabled={is_the_last} onClick={forward} type='button' className={`stepper-tab-label-icon ${is_the_last ? "stepper-tab-button-disabled" : ""}`}> <i className="ri-arrow-right-double-line"></i></button >
        </section>
    )
}
