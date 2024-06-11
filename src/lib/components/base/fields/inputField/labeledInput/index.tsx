import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { Label } from '../../..';
import { Input } from '../input';

interface Props extends InputHTMLAttributes<HTMLInputElement | HTMLLabelElement> {
    label: string;
    required_label?: string;
    secondary_label?: string;
    component_size?: "S" | "M" | "L";
    component_style?: "horizontal" | "";
    left_side_icon?: ReactNode;
    drop_down_list_child?: ReactNode;
    trailing_label?: string;
    action_button?: ReactNode;
    negative?: boolean;
    badges_children?: ReactNode | ReactNode[];
    error_message?: string;
    theme?: "System-Style" | "";
    name: string;
}

export const LabeledInput = forwardRef<HTMLInputElement, Props>(({
    label,
    required_label,
    secondary_label,
    component_size,
    component_style,
    left_side_icon,
    drop_down_list_child,
    trailing_label,
    action_button,
    negative,
    badges_children,
    error_message,
    theme,
    name,
    className,
    ...props
}, ref) => {
    return (
        <Label
            className={className}
            label={label}
            secondary_label={secondary_label}
            name={name}
            component_size={component_size}
            child_dir={component_style === "horizontal" ? "vertical" : ""}
            component_style={component_style === "horizontal" ? "vertical" : ""}
            theme={theme}
        >
            <Input
                ref={ref}
                component_size={component_size}
                left_side_icon={left_side_icon}
                name={name}
                drop_down_list_child={drop_down_list_child}
                trailing_label={trailing_label}
                action_button={action_button}
                negative={negative}
                badges_children={badges_children}
                error_message={error_message}
                component_style={theme}
                {...props}
            />
        </Label>
    );
});
