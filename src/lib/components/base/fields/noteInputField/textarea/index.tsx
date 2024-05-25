import { TextareaHTMLAttributes } from 'react'
import './style.scss'
import Tooltip from '../../../tooltips/tooltip'

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    name: string
    negative?: boolean
    error_message?: string
}
export function Textarea(props: Props) {

    return (
        <section className='glare-textarea-wrapper'>
            <textarea
                {...props}
                className={`glare-textarea ${props.negative || props.error_message && "glare-textarea-negative"} ${props.className}`}
                name={props.name}
            />
            <Tooltip message={props.error_message || ""} isActive={props.error_message != undefined || false} />
        </section>

    )
}
