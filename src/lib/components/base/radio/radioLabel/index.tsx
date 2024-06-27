import { forwardRef, InputHTMLAttributes } from "react";
import { Label } from "../../labels/label";
import "./style.scss";
import useStates from "./hooks/useStates";

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
            <span
                className={`check-box-icon-wrapper ${fucus && !selected ? "glare-RadioLabel-focus" : ""} ${props.disabled ? "glare-RadioLabel-disabled" : ""}`}
            >
                {/* here if the input is checked we will show the check box icon */}
                {selected ? <i className="ri-radio-button-fill"></i> : <span className="check-box-icon"></span>}
            </span>

            <input
                {...props}
                onChange={(e) => {
                    // here we can handle the change event and show the check icon
                    handleSelect(e);
                    props.onChange && props.onChange(e);
                }}
                onFocus={(e) => {
                    // here we can handle the fucus event and change the component style
                    handleFocus(true);
                    props.onFocus && props.onFocus(e);
                }}
                onBlur={(e) => {
                    handleFocus(false);
                    props.onBlur && props.onBlur(e);
                }}
                ref={ref}
                id={check_box_name}
                type="radio"
                className="glare-RadioLabel-input"
                aria-checked={selected}
                aria-label={label}  // Consider providing a meaningful label
                disabled={props.disabled}
            />
        </Label>
    );
});
