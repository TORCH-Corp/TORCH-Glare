import { forwardRef, TextareaHTMLAttributes } from "react";
import { Label } from "../../labels/label";
import { Textarea } from "./textarea";
import "./style.scss";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    name: string;
    label?: string;
    required_label?: string;
    secondary_label?: string;
    component_style?: "vertical" | "horizontal" | "";
    error_message?: string;
    negative?: boolean;
}

export const NoteInputField = forwardRef<HTMLTextAreaElement, Props>(({
    name,
    label,
    required_label,
    secondary_label,
    component_style,
    error_message,
    negative,
    ...props
}, ref) => {
    return (
        <Label
            label={label}
            secondary_label={secondary_label}
            name={name}
            component_size="M"
            child_dir={component_style === "horizontal" ? "vertical" : ""}
            component_style={component_style === "horizontal" ? "vertical" : ""}
            className="custom-label"
        >
            <Textarea
                {...props}
                name={name}
                ref={ref} // Forward the ref
                negative={negative}
                error_message={error_message} />
        </Label>
    );
});

export default NoteInputField;
