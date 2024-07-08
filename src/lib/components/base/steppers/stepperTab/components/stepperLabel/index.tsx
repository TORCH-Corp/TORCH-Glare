import { ButtonHTMLAttributes } from 'react'
import './style.scss'
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    stepper_label: string
    is_selected?: boolean
    forward: any
    backward: any
}
export function StepperLabel({ stepper_label, is_selected, forward, backward, ...props }: Props) {
    return (
        <section {...props} dir='ltr' className={`stepper-tab-label ${is_selected ? "stepper-tab-label-selected" : ""}`} >
            <p className="stepper-tab-label-text">{stepper_label}</p>
        </section>
    )
}
