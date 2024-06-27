import { InputHTMLAttributes, Dispatch, SetStateAction, ChangeEvent, ChangeEventHandler } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    ref: any,
    setFocus: Dispatch<SetStateAction<boolean>>
    setIsActive: Dispatch<SetStateAction<boolean>>
    InputChange: ChangeEventHandler<any>,
    inputRef: any
}
export function InputElement({
    ref, setFocus, setIsActive, InputChange, inputRef, ...props
}: Props) {
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
}
