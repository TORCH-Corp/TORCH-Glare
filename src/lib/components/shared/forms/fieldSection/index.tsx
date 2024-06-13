import { InputHTMLAttributes, ReactNode } from "react";
import { InputField } from "../../../base/fields/inputField";
import { ContentColumn } from "../contentColumn";
import './style.scss'


interface Props extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label: string;
    required_label?: string;
    secondary_label?: string;
    warning_label?: string
    error_label?: string
    negative?: boolean;
    drop_down_list_child?: ReactNode;
    trailing_label?: string;
    action_button?: ReactNode;
    left_side_icon?: ReactNode;
    badges_children?: ReactNode | ReactNode[];
    error_message?: string;
    component_size?: "S" | "M" | "L";
    theme?: "System-Style" | "";
}

export function FieldSection({
    name,
    label,
    required_label,
    secondary_label,
    warning_label,
    error_label,
    negative,
    component_size,
    drop_down_list_child,
    trailing_label,
    action_button,
    left_side_icon,
    badges_children,
    error_message,
    theme,
    ...props
}: Props) {
    return (
        <section className="glare-field-section">
            <ContentColumn
                component_label={label}
                secondary_label={secondary_label}
                required_label={required_label}
                component_size={component_size}
                warning_label={warning_label}
                error_label={error_label}
            />
            <InputField
                {...props}
                name={name}
                component_size={component_size}
                left_side_icon={left_side_icon}
                trailing_label={trailing_label}
                action_button={action_button}
                negative={negative}
                badges_children={badges_children}
                drop_down_list_child={drop_down_list_child}
                error_message={error_message}
                theme={theme}
            />
        </section>
    )
}
