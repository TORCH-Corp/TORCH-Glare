import { LabelHTMLAttributes } from 'react'
import './style.scss'

interface Props extends LabelHTMLAttributes<HTMLLabelElement> {
    label?: string
    required_label?: string
    secondary_label?: string
    component_size?: "S" | "M" | "L"
    component_style?: "vertical" | "horizontal" | ""
    as_child?: boolean
    child_dir?: "vertical" | "vertical-reverse" | "horizontal" | ""
    theme?: "System-Style" | ""
    disabled?: boolean
    name: string
}
// 
export function Label(props: Props) {

    return (
        <section
            {...props}
            className={`glare-label ${props.component_size || "S"} ${props.component_style || 'horizontal'} 
            ${props.disabled ? "disabled" : ""} child-dir-${props.child_dir || 'horizontal'}
            ${props.className} glare-label-${props.theme}`
            }
        >
            <label className='label-container' htmlFor={props.name}>
                {props.label && <label className={`label ${props.as_child ? "as-child" : ""}`} htmlFor={props.name}>{props.label} </label>}
                {props.secondary_label && <p className='secondaryLabel'>{`${props.secondary_label}`}</p>}
                {props.required_label && <span className='requiredLabel' >{`(${props.required_label})`}</span>}
            </label>

            {props.children}
        </section>
    )
}

