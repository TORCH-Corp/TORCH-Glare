import { InputHTMLAttributes, ReactNode, useEffect, useState } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    component_size?: "S" | "M" | "L" // this is used to change the size style of the component
    component_style?: "System-Style" | "" // this will change the component theme
    negative?: boolean // to have negative colors theme
    error_message?: string // to show tooltip component when error_message not null
    badges_children?: ReactNode | ReactNode[] // to add badges components inside the component

}
export function useStates(props: Props) {

    // this hook used to handle the inputFelid styles

    const [focus, setFocus] = useState(false)
    const [style, setStyle] = useState('')

    useEffect(() => {
        // here we handle the component size and theme and fucus style
        setStyle(`glare-input-size-${props.component_size ? props.component_size : "S"} 
        ${props.className} 
        ${props.negative || props.error_message ? "glare-input-field-negative" : ""} 
        ${props.disabled && "glare-input-field-disabled"} 
        ${props.component_style == "System-Style" && "glare-input-field-system-style"} 
        ${focus && !props.error_message ? `${props.component_style == "System-Style" ? "glare-input-field-system-style-focus" : "glare-input-field-focus"}` : ""}
       `)
    }, [{ ...props }])


    // here we return the styles as string to be used in the component class name
    return { focus, setFocus, style }
}
