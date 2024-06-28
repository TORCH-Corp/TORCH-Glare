import { InputHTMLAttributes, forwardRef } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    check_box_name: string; // the name of the radio and this is important to link the radio with the label
    handleSelect: (e: any) => void
    handleFocus: (e: boolean) => void
    selected: boolean
}
export const InputElement = forwardRef<HTMLInputElement, Props>(({
    check_box_name,
    handleSelect,
    handleFocus,
    selected,
    ...props
}, ref) => {
    return (
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
            checked={selected}
            disabled={props.disabled}
        />)
})
