import { ChangeEvent, InputHTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement | HTMLLabelElement> {
    component_size?: "S" | "M" | "L"
    negative?: boolean
    badges_children?: ReactNode | ReactNode[]
    theme?: "System-Style" | ""
    error_message?: string
}
export function useStates(props: Props) {


    const [focus, setFocus] = useState(false) // fucus is to store input fucus state
    const [style, setStyle] = useState('') // style is to store all of the styles
    const [activeLabel, setActiveLabel] = useState(false) // activeLabel is to store if the label is active or not
    const sectionRef = useRef<HTMLDivElement>(null) // we use sectionRef with the useHideDropDown hook
    const inputRef = useRef<HTMLInputElement>(null) // we use inputRef to detect if the input is focused or not and take control of it

    // we use this to if the user start typing or not and change the label style 
    const InputChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value == "") {
            setActiveLabel(false)
        } else {
            setActiveLabel(true)
        }
    }

    // we use this to if the user hover over the component and change the label style
    const InputHover = (hover: boolean) => {
        if (hover) {
            if (inputRef.current?.value != "") {
                setActiveLabel(false)
            }
        } else {
            if (inputRef.current?.value != "") {
                setActiveLabel(true)
            }
        }
    }


    useEffect(() => {
        // here we set the style based on the props and user events and store them in the style state
        setStyle(`glare-input-labelLess-size-${props.component_size ? props.component_size : "S"} 
        ${focus && !props.negative && !props.error_message ? "glare-input-labelLess-field-focus glare-InputLabel-focus" : ""} 
        ${props.negative || props.error_message && "glare-input-labelLess-field-negative"} 
        ${props.disabled && "glare-input-labelLess-field-disabled"} 
        ${props.className}
          ${props.theme == "System-Style" && "glare-input-labelLess-system-style"} 
        ${focus && !props.negative && !props.error_message ? ` ${props.theme == "System-Style" ? "glare-input-labelLess-style-fucus" : ""}` : ""}`)
    }, [props.negative, props.component_size, props.error_message, props.disabled, props.className, props.theme, focus])

    // here we return the style state to use it with the component class name and other states
    return { focus, setFocus, style, setStyle, sectionRef, inputRef, activeLabel, setActiveLabel, InputChange, InputHover }
}
