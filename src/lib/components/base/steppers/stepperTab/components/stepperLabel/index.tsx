import { ButtonHTMLAttributes } from 'react'
import './style.scss'
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    stepper_label: string
    is_selected?: boolean
}
export function StepperLabel({ stepper_label, is_selected, ...props }: Props) {
    return (
        <section {...props} dir='ltr' className={`stepper-tab-label ${is_selected ? "stepper-tab-label-selected" : ""}`} >
            <button type='button' className='stepper-tab-label-icon'><i className="ri-arrow-left-double-line"></i></button >
            <p className="stepper-tab-label-text">{stepper_label}</p>
            <button type='button' className='stepper-tab-label-icon'> <i className="ri-arrow-right-double-line"></i></button >
        </section>
    )
}
