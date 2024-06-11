import { LabelHTMLAttributes } from 'react';
import './style.scss';

interface Props extends LabelHTMLAttributes<HTMLLabelElement> {
    label?: string;
    required_label?: string;
    secondary_label?: string;
    component_size?: "S" | "M" | "L";
    component_style?: "vertical" | "horizontal" | "";
    as_child?: boolean;
    child_dir?: "vertical" | "vertical-reverse" | "horizontal" | "";
    theme?: "System-Style" | "";
    disabled?: boolean;
    name: string;
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
