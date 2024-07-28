import { InputHTMLAttributes, ReactNode, forwardRef } from "react";
import { LabeledInput } from "./components/labeledInput";
import { Input } from "./components/input";

interface Props extends InputHTMLAttributes<HTMLInputElement | HTMLLabelElement> {
    name: string; // this is important for link to the input to the label
    label?: string;
    required_label?: string;
    secondary_label?: string;
    component_size?: "S" | "M" | "L"; // this is used to change the size style of the component
    label_style?: "horizontal" | "vertical"; // this will change the label direction of the component
    negative?: boolean; // to have negative colors theme
    drop_down_list_child?: ReactNode; // to add drop down list if you pass it
    trailing_label?: string; // to add trailing label
    action_button?: ReactNode; // to add action button to the end of the input
    left_side_icon?: ReactNode; // to add left side icon
    badges_children?: ReactNode | ReactNode[]; // to add badges components inside the component
    error_message?: string; // to show tooltip component when error_message not null
    theme?: "System-Style" | ""; // this is used to change the color theme of the component
}

export const InputField = forwardRef<HTMLInputElement, Props>(({
    name,
    label,
    required_label,
    secondary_label,
    component_size,
    label_style = 'vertical',
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

    // if you have label then return LabeledInput else return just the Input
    return label ? (
        <LabeledInput
            ref={ref}
            name={name}
            label={label}
            required_label={required_label}
            secondary_label={secondary_label}
            component_size={component_size}
            label_style={label_style}
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
