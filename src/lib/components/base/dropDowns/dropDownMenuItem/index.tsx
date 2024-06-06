import './styles/style.scss'
import { Label } from '../../labels/label'
import { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { DropDownMenuItemInput } from './components/dropDownMenuItem-Input'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement | HTMLInputElement> {
    component_size?: 'M'
    component_label: string
    element_name: string
    required_label?: string
    secondary_label?: string
    onRightSideIconClick?: MouseEventHandler
    component_style?: "Presentation-Warning-Style" | "Presentation-Negative-Style" | "System-Style"
    right_side_icon?: ReactNode
    icon?: ReactNode
    component_type?: "checkbox" | "radio"
}

export default function DropDownMenuItem(props: Props) {
    return (

        props.component_type ?
            // checkbox or radio button
            <DropDownMenuItemInput
                {...props}
                component_name={props.element_name}
                input_type={props.component_type}
                label={props.component_label}
                secondary_label={props.secondary_label}
                required_label={props.required_label}
                component_style={props.component_style}
                disabled={props.disabled}
                component_size={props.component_size}
            />
            :
            // for normal style
            <button
                {...props}
                className={`dropDownMenuItem menuItem-${props.component_style} dropDownMenuItem-size-${props.component_size} ${props.right_side_icon ? "hasRightSideIcon" : ""} ${props.className}`}
                id={props.element_name}
            >
                {/* if we need to have icon */}
                {props.icon ? <div className='dropDownMenuItem-icon'>{props.icon}</div> : null}
                <Label
                    component_size={props.component_size}
                    label={props.component_label}
                    required_label={props.required_label}
                    secondary_label={props.secondary_label}
                    name={props.element_name}
                    child_dir='horizontal'
                />
                {/* if wee need icon or label on the right side */}
                {props.right_side_icon ? <button onClick={props.onRightSideIconClick} className='dropDownMenuItem-icon'>{props.right_side_icon}</button > : null}
            </button>

    )
}
