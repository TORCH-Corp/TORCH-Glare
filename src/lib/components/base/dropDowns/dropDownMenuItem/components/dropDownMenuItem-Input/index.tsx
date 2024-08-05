import { InputHTMLAttributes } from 'react'
import './style.scss'
import { CheckboxLabel } from '@components/base/checkBoxes/checkboxLabel'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    component_name: string
    component_size?: 'M'
    label: string
    required_label?: string
    secondary_label?: string
    component_style?: "Presentation-Warning-Style" | "Presentation-Negative-Style" | "System-Style"
    input_type: "checkbox" | "radio"
    isChecked?: boolean
}
export function DropDownMenuItemInput({
    component_name,
    component_size,
    label,
    required_label,
    secondary_label,
    component_style,
    input_type,
    isChecked, ...props
}: Props) {
    return (
        <CheckboxLabel
            {...props}
            component_size={component_size}
            check_box_name={component_name}
            checked={isChecked}
            label={label}
            required_label={required_label}
            secondary_label={secondary_label}
            component_type={input_type}
            className={`dropDownMenuItem menuItem-${component_style} dropDownMenuItem-size-${component_size} dropDownMenuIteminput-label`}
        />
    )
}


