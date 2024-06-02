import { forwardRef, InputHTMLAttributes, ReactNode, ChangeEvent } from 'react'
import './style.scss'
import Button from '../../buttons/button'
import { DynamicContainer } from '../../../../components/helpers'
import { useStates } from './hooks/useStates'
import { useShowDropDown } from '../../../../hooks/useShowDropDown'
import { InputLabel } from './inputLabel'
import { Tooltip } from '../../main'

interface Props extends InputHTMLAttributes<HTMLInputElement | HTMLLabelElement> {
    name: string
    label: string
    required_label?: string
    secondary_label?: string
    component_size?: "S" | "M" | "L"
    negative?: boolean
    drop_down?: boolean
    drop_down_list_child?: ReactNode
    trailing_label?: string
    action_button?: ReactNode
    left_side_icon?: ReactNode
    badges_children?: ReactNode | ReactNode[]
    error_message?: string
    theme?: "System-Style"
}

export const LabelLessInput = forwardRef<HTMLInputElement, Props>((props, ref) => {

    const { setFocus, style, sectionRef, inputRef, InputChange, activeLabel, InputHover } = useStates(props)
    const { isActive } = useShowDropDown(sectionRef)

    return (
        <section
            onMouseOver={() => { InputHover(true) }}
            onMouseLeave={() => InputHover(false)}
            onClick={() => {
                setFocus(true)
                inputRef.current?.focus()
            }}
            ref={sectionRef}
            className={`glare-input-labelLess-field-wrapper  ${style} `}
        >

            <section className='glare-input-labelLess-field-inner-wrapper'>

                {props.left_side_icon && <span className="glare-input-icon">{props.left_side_icon}</span>}
                <span className="glare-input-icon"><InputLabel name={props.name} required={props.required} component_size={props.component_size} active={activeLabel} label={props.label} /></span>

                {props.badges_children}

                <section className='input-container'>
                    <input
                        {...props}
                        name={props.name}
                        ref={(element) => {
                            // Set both refs
                            if (element) {
                                inputRef.current = element;
                                if (ref) {
                                    // If a ref was passed, set it too
                                    if (typeof ref === 'function') {
                                        ref(element);
                                    } else {
                                        ref.current = element;
                                    }
                                }
                            }
                        }} onBlur={(e: any) => {
                            setFocus(false)
                            props.onBlur && props.onBlur(e)
                        }}
                        onFocus={(e: any) => {
                            setFocus(true)
                            props.onFocus && props.onFocus(e)
                        }}
                        className={`glare-input-label-less-field`}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            props.onChange && props.onChange(e)
                            InputChange(e)
                        }}
                    />

                    {
                        props.trailing_label || props.drop_down || props.action_button ?
                            <span className="glare-input-icon">
                                {props.trailing_label && <p className='glare-input-trailing-label'>{props.trailing_label}</p>}
                                {props.drop_down && <Button component_size={props.component_size} disabled={props.disabled} left_icon={<i className="ri-arrow-drop-down-line"></i>}></Button>}
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

            <Tooltip message={props.error_message || ""} is_active={props.error_message != undefined || props.error_message != ''} />
        </section>
    )
});
