import { forwardRef, TextareaHTMLAttributes, Ref } from "react";
import { Label } from "../../labels/label";
import { Textarea } from "./textarea";
import "./style.scss";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement | HTMLLabelElement> {
    name: string;
    label?: string;
    required_label?: string;
    secondary_label?: string;
    component_style?: "vertical" | "horizontal" | "";
    error_message?: string;
    negative?: boolean;
}

export const NoteInputField = forwardRef((props: Props, ref: Ref<HTMLTextAreaElement>) => {
    return (
        <Label
            label={props.label}
            secondary_label={props.secondary_label}
            name={props.name}
            component_size={"M"}
            child_dir={props.component_style === "horizontal" ? "vertical" : ""}
            component_style={props.component_style === "horizontal" ? "vertical" : ""}
            className="custom-label"
        >
            <Textarea
                {...props}
                ref={ref} // Forward the ref
                negative={props.negative}
                error_message={props.error_message}
            />
        </Label>
    );
});

export default NoteInputField;
