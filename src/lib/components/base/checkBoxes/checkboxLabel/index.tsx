import { forwardRef, InputHTMLAttributes, Ref } from "react";
import { Label } from "../../labels/label";
import "./style.scss";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    component_size?: "S" | "M" | "L";
    check_box_name: string;
    label?: string;
    required_label?: string;
    secondary_label?: string;
    component_type?: "checkbox" | "radio";
}

export const CheckboxLabel = forwardRef((props: Props, ref: Ref<HTMLInputElement>) => {
    return (
        <Label
            name={props.check_box_name}
            component_size={props.component_size}
            required_label={props.required_label}
            child_dir='vertical-reverse'
            label={props.label}
            secondary_label={props.secondary_label}
            disabled={props.disabled}
            className={`glare-CheckboxLabel ${props.className}`}
        >
            <input
                {...props}
                ref={ref} // Forward the ref
                id={props.check_box_name}
                type={props.component_type || "checkbox"}
                className={`glare-CheckboxLabel-input glare-CheckboxLabel-input-${props.component_size || "S"}`}
            />
        </Label>
    );
});

