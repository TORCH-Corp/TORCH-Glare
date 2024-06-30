import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { Label } from '../../../../labels/label';
import { Input } from '../../components/input';

interface Props extends InputHTMLAttributes<HTMLInputElement | HTMLLabelElement> {
    label: string; // to add label to the input
    required_label?: string;
    secondary_label?: string;
    component_size?: "S" | "M" | "L"; // this is used to change the size style of the component
    component_style?: "horizontal" | "vertical"; // this will change the label direction of the component
    left_side_icon?: ReactNode; // to add left side icon
    drop_down_list_child?: ReactNode; // to add drop down list if you pass it
    trailing_label?: string; // to add trailing label
    action_button?: ReactNode; // to add action button to the end of the input
    negative?: boolean; // to have negative colors theme
    badges_children?: ReactNode | ReactNode[]; // to add badges components inside the component
    error_message?: string; // to show tooltip component when error_message not null
    theme?: "System-Style" | ""; // this is used to change the color theme of the component
    name: string; // this is important for link to the input to the label
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
            child_dir={component_style}
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
