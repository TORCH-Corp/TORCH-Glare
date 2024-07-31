import { forwardRef, InputHTMLAttributes, Ref } from "react";
import { Label } from "../../labels/label";
import "./style.scss";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    component_size?: "S" | "M" | "L"; // this props will change the button style size see on figma design file
    check_box_name: string; // this important for link the label with the input
    label?: string;
    required_label?: string;
    secondary_label?: string;
    component_type?: "checkbox" | "radio";
    isChecked?: boolean // this will check the input if true
}

export const CheckboxLabel = forwardRef(({
    component_size,
    check_box_name,
    label,
    required_label,
    secondary_label,
    component_type,
    isChecked,
    ...props
}: Props, ref: Ref<HTMLInputElement>) => {
    return (
        <Label
            name={check_box_name}
            component_size={component_size}
            required_label={required_label}
            child_dir='vertical-reverse'
            label={label}
            secondary_label={secondary_label}
            disabled={props.disabled}
            className={`glare-CheckboxLabel ${props.className}`}
            style={props.style}
        >
            <input
                {...props}
                style={{}}
                checked={isChecked}
                name={check_box_name}
                ref={ref} // Forward the ref
                id={check_box_name}
                type={component_type || "checkbox"}
                className={`glare-CheckboxLabel-input glare-CheckboxLabel-input-${component_size || "S"}`}
            />
        </Label>
    );
});

