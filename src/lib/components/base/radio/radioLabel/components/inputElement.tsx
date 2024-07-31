import { InputHTMLAttributes, forwardRef } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    handleFocus: (e: boolean) => void
}
export const InputElement = forwardRef<HTMLInputElement, Props>(({
    handleFocus,
    ...props
}, ref) => {
    return (
        <input
            {...props}
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
            type="radio"
            className="glare-RadioLabel-input"
        />)
})
