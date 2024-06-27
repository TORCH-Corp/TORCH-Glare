import { LabelHTMLAttributes } from 'react';
import './style.scss';

interface Props extends LabelHTMLAttributes<HTMLLabelElement> {
    label?: string; // main label
    required_label?: string; // normal text with required style
    secondary_label?: string;  //normal text with secondary style
    component_size?: "S" | "M" | "L"; // this is used to change the size style of the component
    component_style?: "vertical" | "horizontal" | ""; // this is used to change the set of labels direction
    as_child?: boolean; // this is used to make the label color same as the parent component
    child_dir?: "vertical" | "vertical-reverse" | "horizontal" | ""; // this is used to change the children direction
    theme?: "System-Style" | ""; // this is used to change the theme of the component
    disabled?: boolean; // this is used to disable the label
    name: string; // the name of the label and this is important to link the label with parent component
}

export function Label({
    label,
    required_label,
    secondary_label,
    component_size = "S",
    component_style = "horizontal",
    as_child = false,
    child_dir = "horizontal",
    theme = "",
    disabled = false,
    name,
    className,
    children,
    ...props
}: Props) {
    return (
        <section
            {...props}
            className={`glare-label ${component_size} ${component_style} ${disabled ? "disabled" : ""} child-dir-${child_dir} ${className} glare-label-${theme}`}
        >
            <label className="label-container" htmlFor={name}>
                {label && <span className={`label ${as_child ? "as-child" : ""}`} >{label}</span>}
                {secondary_label && <p className="secondaryLabel">{secondary_label}</p>}
                {required_label && <span className="requiredLabel">({required_label})</span>}
            </label>
            {children}
        </section>
    );
}
