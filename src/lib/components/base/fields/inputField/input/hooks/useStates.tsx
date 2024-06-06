import { InputHTMLAttributes, ReactNode, useEffect, useState } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    component_size?: "S" | "M" | "L"
    component_style?: "System-Style" | ""
    negative?: boolean
    error_message?: string
    badges_children?: ReactNode | ReactNode[]

}
export function useStates(props: Props) {

    const [focus, setFocus] = useState(false)
    const [style, setStyle] = useState('')

    useEffect(() => {
        setStyle(`glare-input-size-${props.component_size ? props.component_size : "S"} 
        ${props.className} 
        ${props.negative || props.error_message ? "glare-input-field-negative" : ""} 
        ${props.disabled && "glare-input-field-disabled"} 
        ${props.component_style == "System-Style" && "glare-input-field-system-style"} 
        ${focus && !props.error_message ? `${props.component_style == "System-Style" ? "glare-input-field-system-style-focus" : "glare-input-field-focus"}` : ""}
       `)
    }, [{ ...props }])


    return { focus, setFocus, style, setStyle }
}
