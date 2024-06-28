import { forwardRef, InputHTMLAttributes } from "react";
import { Label } from "../../labels/label";
import "./style.scss";
import useStates from "./hooks/useStates";
import LabelLessInput from "../../fields/labelLessInput";
import { InputElement } from "./components/inputElement";
import { CheckboxIcon } from "./components/checkboxIcon";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    component_size: "S" | "M" | "L"; // this is used to change the size style of the component
    check_box_name: string; // the name of the radio and this is important to link the radio with the label
    label?: string; // main label
    required_label?: string; // normal text with required style
    secondary_label?: string; // normal text with secondary style
}

export const RadioLabel = forwardRef<HTMLInputElement, Props>(({
    component_size,
    check_box_name,
    label,
    required_label,
    secondary_label,
    ...props
}, ref) => {


    const { fucus, handleFocus, selected, handleSelect } = useStates();

    return (
        <Label
            name={check_box_name}
            component_size={component_size}
            required_label={required_label}
            child_dir="vertical-reverse"
            label={label}
            secondary_label={secondary_label}
            disabled={props.disabled}
            className={`glare-RadioLabel ${props.className} glare-RadioLabel-size-${component_size}`}
        >
            <CheckboxIcon fucus={fucus} selected={selected} disabled={props.disabled} />

            <InputElement
                ref={ref}
                check_box_name={check_box_name}
                handleSelect={handleSelect}
                handleFocus={handleFocus}
                selected={selected}
            />
        </Label>
    );
});
