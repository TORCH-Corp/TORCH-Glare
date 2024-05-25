import { HTMLAttributes } from 'react'
import './style.scss'


interface Props extends HTMLAttributes<HTMLParagraphElement> {
    component_size: "S" | "M" | "L"
    typo_size: "SemiBold" | "Regular"
    text_align?: "start" | "center" | "end"
    disabled?: boolean
    label?: string
    secondary_label?: string
}

export function TableLabel(props: Props) {
    return (
        <section {...props} className={`glare-table-label glare-table-label-${props.typo_size || 'SemiBold'}-${props.component_size || "S"} ${props.disabled && 'glare-table-label-disabled'} glare-table-label-${props.text_align} ${props.className}`}>
            <p className='glare-table-label-main-label'>{props.label}</p>
            <p className='glare-table-label-second-label'>{props.secondary_label}</p>
        </section>
    )
}
