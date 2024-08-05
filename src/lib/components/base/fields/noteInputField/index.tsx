import { forwardRef, TextareaHTMLAttributes } from "react";
import { Label } from "@/components/base/labels/label";
import { Textarea } from "./textarea";
import "./style.scss";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    name: string; // the name of the textArea and this is important to link the textArea with the label
    label?: string;
    required_label?: string;
    secondary_label?: string;
    label_style?: "vertical" | "horizontal" | ""; // this is used to change the label direction
    error_message?: string; // this is used to show the error message tooltip
    negative?: boolean; // this is used to have negative style
}

export const NoteInputField = forwardRef<HTMLTextAreaElement, Props>(({
    name,
    label,
    required_label,
    secondary_label,
    label_style,
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
            required_label={required_label}
            child_dir={label_style === "vertical" ? "horizontal" : ""}
            component_style={label_style === "horizontal" ? "vertical" : ""}
            className="custom-label"
            style={props.style}
        >
            <Textarea
                {...props}
                name={name}
                style={{}}
                ref={ref} // Forward the ref
                negative={negative}
                error_message={error_message} />
        </Label>
    );
});

export default NoteInputField;
