import { InputHTMLAttributes, ReactNode, forwardRef } from "react";
import { LabeledInput } from "./labeledInput";
import { Input } from "./input";

interface Props extends InputHTMLAttributes<HTMLInputElement | HTMLLabelElement> {
    name: string;
    label?: string;
    required_label?: string;
    secondary_label?: string;
    component_size?: "S" | "M" | "L";
    component_style?: "horizontal" | "vertical";
    negative?: boolean;
    drop_down_list_child?: ReactNode;
    trailing_label?: string;
    action_button?: ReactNode;
    left_side_icon?: ReactNode;
    badges_children?: ReactNode | ReactNode[];
    error_message?: string;
    theme?: "System-Style" | "";
}

export const InputField = forwardRef<HTMLInputElement, Props>(({
    name,
    label,
    required_label,
    secondary_label,
    component_size,
    component_style = 'horizontal',
    left_side_icon,
    trailing_label,
    action_button,
    negative,
    badges_children,
    drop_down_list_child,
    error_message,
    theme,
    ...props
}, ref) => {
    return label ? (
        <LabeledInput
            ref={ref}
            name={name}
            label={label}
            required_label={required_label}
            secondary_label={secondary_label}
            component_size={component_size}
            component_style={component_style}
            left_side_icon={left_side_icon}
            trailing_label={trailing_label}
            action_button={action_button}
            negative={negative}
            badges_children={badges_children}
            drop_down_list_child={drop_down_list_child}
            error_message={error_message}
            theme={theme}
            {...props}
        />
    ) : (
        <Input
            ref={ref}
            name={name}
            component_size={component_size}
            left_side_icon={left_side_icon}
            trailing_label={trailing_label}
            action_button={action_button}
            negative={negative}
            badges_children={badges_children}
            drop_down_list_child={drop_down_list_child}
            error_message={error_message}
            component_style={theme}
            {...props}
        />
    );
});
