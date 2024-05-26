import { InputHTMLAttributes, RefObject } from "react"
import { Label } from "../../../../main"
import './style.scss'
import useStates from "./hooks/useStates"

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    component_size: "S" | "M" | "L",
    check_box_name: string
    label?: string
    required_label?: string
    secondary_label?: string
    Ref?: RefObject<any>
}

export function RadioLabel(props: Props) {

    const { selected, handleSelect, handleFocus, fucus } = useStates()
    return (
        <Label
            name={props.check_box_name}
            component_size={props.component_size}
            required_label={props.required_label}
            child_dir='vertical-reverse'
            label={props.label}
            secondary_label={props.secondary_label}
            disabled={props.disabled}
            className={`glare-RadioLabel  ${props.className} glare-RadioLabel-size-${props.component_size}`}
        >
            <span className={`check-box-icon-wrapper ${fucus && !selected && "glare-RadioLabel-focus"} ${props.disabled && "glare-RadioLabel-disabled"} `}>
                {
                    selected ?
                        <i className="ri-radio-button-fill"></i>
                        :
                        <span className="check-box-icon"></span>
                }
            </span>

            <input {...props} onChange={(e) => {
                handleSelect(e)
                props.onChange && props.onChange(e)
            }}
                onFocus={(e) => {
                    handleFocus(true)
                    props.onFocus && props.onFocus(e)
                }}
                onBlur={(e) => {
                    handleFocus(false)
                    props.onBlur && props.onBlur(e)
                }}
                ref={props.Ref}
                id={props.check_box_name}
                type={'radio'}
                className={`glare-RadioLabel-input`}
                disabled={props.disabled}
            />
        </Label>
    )
}

