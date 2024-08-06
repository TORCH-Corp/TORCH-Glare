import { InputHTMLAttributes, ReactNode } from "react";
import { InputField } from "@components/base/fields/inputField";
import { ContentColumn } from "@components/shared/forms/contentColumn";
import './style.scss'


interface Props extends InputHTMLAttributes<HTMLInputElement> {
    name: string; // this important to link the component
    label: string; // this is the label of the component
    required_label?: string; // this is the required style label
    secondary_label?: string; // this is the secondary style label
    warning_label?: string // this will show the alert component with warning style if not null
    error_label?: string // this will show the component alert with error style if not null
    negative?: boolean; // to have a negative style
    drop_down_list_child?: ReactNode; // this will show the dropdown list if not null
    trailing_label?: string; // this will show the trailing label if not null
    action_button?: ReactNode; // this will show the action button if not null
    left_side_icon?: ReactNode; // this will show the left side icon
    badges_children?: ReactNode | ReactNode[]; // this is for badges children
    error_message?: string; // this will show tooltip with error message if not null
    component_size?: "M" | "L"; // this is used to change the size style of the component
    theme?: "System-Style" | ""; // this is used to change the theme style of the component
    childrenAtTheTop?: ReactNode
    childrenAtTheBottom?: ReactNode
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
    childrenAtTheTop,
    childrenAtTheBottom,
    ...props
}: Props) {

    return (
        <section style={window.innerWidth > 600 ? { alignItems: error_label || warning_label || secondary_label || childrenAtTheBottom || childrenAtTheTop ? "start" : "center", ...props.style } : props.style} className="glare-field-section"  >
            <ContentColumn
                name={name}
                style={{}}
                component_label={label}
                secondary_label={secondary_label}
                required_label={required_label}
                component_size={component_size}
                warning_label={warning_label}
                error_label={error_label}
            />
            <section className="glare-field-section-input-wrapper">
                {childrenAtTheTop}
                <InputField
                    {...props}
                    style={{}}
                    name={name}
                    component_size={component_size || "M"}
                    left_side_icon={left_side_icon}
                    trailing_label={trailing_label}
                    action_button={action_button}
                    negative={negative}
                    badges_children={badges_children}
                    drop_down_list_child={drop_down_list_child}
                    error_message={error_message}
                    theme={theme}
                />
                {childrenAtTheBottom}
            </section>
        </section>
    )
}
