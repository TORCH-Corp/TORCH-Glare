import { InputHTMLAttributes } from 'react'
import './style.scss'
import { Label } from '../../../../labels/label'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    component_name: string
    component_size?: 'M'
    label: string
    required_label?: string
    secondary_label?: string
    component_style?: "Presentation-Warning-Style" | "Presentation-Negative-Style" | "System-Style"
    input_type: "checkbox" | "radio"
}
export function DropDownMenuItemInput(props: Props) {
    return (
        <Label
            child_dir="vertical-reverse"
            name={props.name || props.component_name}
            component_size={props.component_size}
            label={props.label}
            secondary_label={props.secondary_label}
            className={`dropDownMenuItem menuItem-${props.component_style} dropDownMenuItem-size-${props.component_size} dropDownMenuIteminput-label`}
        >
            <input
                {...props}
                id={props.name || props.component_name}
                type={props.type || props.input_type}
                className={`dropDownMenuItemInput ${props.className}`}
            />
        </Label>
    )
}
