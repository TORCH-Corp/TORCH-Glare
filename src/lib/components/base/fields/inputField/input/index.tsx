import { InputHTMLAttributes, ReactNode, useRef } from 'react'
import './style.scss'
import Button from '../../../buttons/button'
import { DynamicContainer } from '../../../../../components/helpers'
import { useStates } from './hooks/useStates'
import { useShowDropDown } from '../../../../../hooks/useShowDropDown'
import Tooltip from '../../../tooltips/tooltip'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    component_size?: "S" | "M" | "L"
    component_style?: "System-Style" | ""
    negative?: boolean
    left_side_icon?: ReactNode
    drop_down?: boolean
    trailing_label?: string
    drop_down_list_child?: ReactNode
    action_button?: ReactNode
    badges_children?: ReactNode | ReactNode[]
    error_message?: string
}

export function Input(props: Props) {

    const { setFocus, style } = useStates(props)
    const sectionRef = useRef<any>(null)
    const inputRef = useRef<any>(null)
    const { isActive } = useShowDropDown(sectionRef)

    return (
        <section
            onClick={() => {
                setFocus(true)
                inputRef.current.focus()
            }}
            ref={sectionRef}
            className={`glare-input-field-wrapper ${style} ${props.className}`}>

            <section className='glare-input-field-inner-wrapper'>
                {props.left_side_icon && <span className="glare-input-icon">{props.left_side_icon}</span>}
                {props.badges_children}

                <section className='input-container'>
                    <input
                        {...props}
                        ref={inputRef}
                        onBlur={(e: any) => {
                            setFocus(false)
                            props.onFocus && props.onFocus(e)
                        }} onFocus={(e: any) => {
                            setFocus(true)
                            props.onFocus && props.onFocus(e)
                        }}
                        className={`glare-input-field`}
                        autoComplete='off'
                        placeholder={props.placeholder}
                    />

                    {
                        props.trailing_label || props.drop_down || props.action_button ?
                            <span className="glare-input-icon">
                                {props.trailing_label && <p className='glare-input-trailingLabel'>{props.trailing_label}</p>}
                                {props.drop_down && <Button component_size={props.component_size} disabled={props.disabled} left_icon={<i className="ri-arrow-down-s-line"></i>}></Button>}
                                {props.action_button}
                            </span>
                            :
                            null
                    }
                </section>
            </section>

            {
                props.drop_down_list_child &&
                <DynamicContainer active={isActive}>
                    {props.drop_down_list_child}
                </DynamicContainer>
            }

            <Tooltip message={props.error_message || ""} isActive={props.error_message != '' || false} />
        </section >
    )
}
