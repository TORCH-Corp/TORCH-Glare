import { ChangeEvent, InputHTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement | HTMLLabelElement> {
    component_size?: "S" | "M" | "L"
    negative?: boolean
    badges_children?: ReactNode | ReactNode[]
    theme?: "System-Style" | ""
    error_message?: string
}
export function useStates(props: Props) {

    const [focus, setFocus] = useState(false)
    const [style, setStyle] = useState('')
    const [activeLabel, setActiveLabel] = useState(false)
    const sectionRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<any>(null)

    const InputChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value == "") {
            setActiveLabel(false)
        } else {
            setActiveLabel(true)
        }
    }

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
        setStyle
            (`glare-input-labelLess-size-${props.component_size ? props.component_size : "S"} 
        ${focus && !props.negative && !props.error_message ? "glare-input-labelLess-field-focus glare-InputLabel-focus" : ""} 
        ${props.negative || props.error_message && "glare-input-labelLess-field-negative"} 
        ${props.disabled && "glare-input-labelLess-field-disabled"} 
        ${props.className}
          ${props.theme == "System-Style" && "glare-input-labelLess-system-style"} 
        ${focus && !props.negative && !props.error_message ? ` ${props.theme == "System-Style" ? "glare-input-labelLess-style-fucus" : ""}` : ""}
        `)
    }, [{ ...props }])

    return { focus, setFocus, style, setStyle, sectionRef, inputRef, activeLabel, setActiveLabel, InputChange, InputHover }
}
