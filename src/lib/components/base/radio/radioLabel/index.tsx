import { forwardRef, InputHTMLAttributes } from "react";
import { Label } from "../../labels/label";
import "./style.scss";
import useStates from "./hooks/useStates";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    component_size: "S" | "M" | "L";
    check_box_name: string;
    label?: string;
    required_label?: string;
    secondary_label?: string;
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
                {selected ? <i className="ri-radio-button-fill"></i> : <span className="check-box-icon"></span>}
            </span>

            <input
                {...props}
                onChange={(e) => {
                    handleSelect(e);
                    props.onChange && props.onChange(e);
                }}
                onFocus={(e) => {
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
