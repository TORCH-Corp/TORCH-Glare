import { forwardRef, InputHTMLAttributes } from "react";
import { Label } from "../../labels/label";
import "./style.scss";
import useStates from "./hooks/useStates";
import { InputElement } from "./components/inputElement";
import { CheckboxIcon } from "./components/checkboxIcon";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    component_size: "S" | "M" | "L"; // this is used to change the size style of the component
    label?: string; // main label
    required_label?: string; // normal text with required style
    secondary_label?: string; // normal text with secondary style
}

export const RadioLabel = forwardRef<HTMLInputElement, Props>(({
    component_size,
    label,
    required_label,
    secondary_label,
    ...props
}, ref) => {


    const { fucus, handleFocus, selected, handleSelect } = useStates();

    return (
        <Label
            name={props.name}
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
                name={props.name}
                handleSelect={handleSelect}
                handleFocus={handleFocus}
                selected={selected}
            />
        </Label>
    );
});
