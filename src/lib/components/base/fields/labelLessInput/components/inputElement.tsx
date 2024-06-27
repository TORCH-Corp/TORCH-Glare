import { InputHTMLAttributes, Dispatch, SetStateAction, ChangeEvent, ChangeEventHandler, forwardRef } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    setFocus: Dispatch<SetStateAction<boolean>>
    setIsActive: Dispatch<SetStateAction<boolean>>
    InputChange: ChangeEventHandler<any>,
    inputRef: any
}
export const InputElement = forwardRef<HTMLInputElement, Props>(({
    setFocus,
    setIsActive,
    inputRef,
    InputChange,
    ...props
}, ref) => {
    return (
        <input
            {...props}
            ref={(element) => {
                inputRef.current = element;
                if (ref) {
                    if (typeof ref === 'function') {
                        ref(element);
                    } else {
                        (ref as React.MutableRefObject<HTMLInputElement | null>).current = element;
                    }
                }
            }}
            onBlur={(e: any) => {
                setFocus(false);
                props.onBlur && props.onBlur(e);
            }}
            onFocus={(e: any) => {
                setFocus(true); // for the input fucus style
                setIsActive(true); // to show the drop down list
                props.onFocus && props.onFocus(e);
            }}
            className="glare-input-label-less-field"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                props.onChange && props.onChange(e);
                InputChange(e);
            }}
        />)
})
