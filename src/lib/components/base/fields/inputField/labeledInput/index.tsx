import { InputHTMLAttributes, ReactNode } from 'react'
import { Label } from '../../../main'
import { Input } from '../input'

interface Props extends InputHTMLAttributes<HTMLInputElement | HTMLLabelElement> {
    label: string
    required_label?: string
    secondary_label?: string
    component_size?: "S" | "M" | "L"
    component_style?: "horizontal" | ""
    left_side_icon?: ReactNode
    drop_down?: boolean
    drop_down_list_child?: ReactNode
    trailing_label?: string
    action_button?: ReactNode
    negative?: boolean
    badges_children?: ReactNode | ReactNode[]
    error_message?: string
    theme?: "System-Style" | ""
    name: string
}

export function LabeledInput(props: Props) {
    return (
        <Label
            label={props.label}
            secondary_label={props.secondary_label}
            name={props.name}
            component_size={props.component_size}
            child_dir={props.component_style == "horizontal" ? "vertical" : ""}
            component_style={props.component_style == "horizontal" ? "vertical" : ""}
            theme={props.theme}
        >
            <Input
                {...props}
                component_size={props.component_size}
                left_side_icon={props.left_side_icon}
                name={props.name}
                drop_down={props.drop_down}
                drop_down_list_child={props.drop_down_list_child}
                trailing_label={props.trailing_label}
                action_button={props.action_button}
                negative={props.negative}
                badges_children={props.badges_children}
                error_message={props.error_message}
                component_style={props.theme}
            />
        </Label>
    )
}
