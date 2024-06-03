import { InputHTMLAttributes, ReactNode, forwardRef } from "react";
import { LabeledInput } from "./labeledInput";
import { Input } from "./input";

interface Props extends InputHTMLAttributes<HTMLInputElement | HTMLLabelElement> {
    name: string
    label?: string
    required_label?: string
    secondary_label?: string
    component_size?: "S" | "M" | "L"
    component_style?: "horizontal" | ""
    negative?: boolean
    drop_down_list_child?: ReactNode
    trailing_label?: string
    action_button?: ReactNode
    left_side_icon?: ReactNode
    badges_children?: ReactNode | ReactNode[]
    error_message?: string
    theme?: "System-Style" | ""
}

export const InputField = forwardRef<HTMLInputElement, Props>((props, ref) => {
    return (
        props.label ?
            <LabeledInput
                {...props}
                ref={ref}
                name={props.name}
                label={props.label}
                required_label={props.required_label}
                secondary_label={props.secondary_label}
                component_size={props.component_size}
                component_style={props.component_style}
                left_side_icon={props.left_side_icon}
                trailing_label={props.trailing_label}
                action_button={props.action_button}
                negative={props.negative}
                badges_children={props.badges_children}
                drop_down_list_child={props.drop_down_list_child}
                error_message={props.error_message}
                theme={props.theme}
            />
            :
            <Input
                {...props}
                ref={ref}
                name={props.name}
                component_size={props.component_size}
                left_side_icon={props.left_side_icon}
                trailing_label={props.trailing_label}
                action_button={props.action_button}
                negative={props.negative}
                badges_children={props.badges_children}
                drop_down_list_child={props.drop_down_list_child}
                error_message={props.error_message}
                component_style={props.theme}
            />
    )
}
)


