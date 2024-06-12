import React, { forwardRef, InputHTMLAttributes, ReactNode, ChangeEvent } from 'react';
import './style.scss';
import Button from '../../buttons/button';
import { DynamicContainer } from '../../../../components/helpers/dynamicContainer';
import { useStates } from './hooks/useStates';
import { InputLabel } from './inputLabel';
import Tooltip from '../../tooltips/tooltip';
import { useHideDropDown } from '../hooks/usehideDropDown';

interface Props extends InputHTMLAttributes<HTMLInputElement | HTMLLabelElement> {
    name: string;
    label: string;
    required_label?: string;
    secondary_label?: string;
    component_size?: "S" | "M" | "L";
    negative?: boolean;
    drop_down_list_child?: ReactNode;
    trailing_label?: string;
    action_button?: ReactNode;
    left_side_icon?: ReactNode;
    badges_children?: ReactNode | ReactNode[];
    error_message?: string;
    theme?: "System-Style";
}

export const LabelLessInput = forwardRef<HTMLInputElement, Props>(({
    name,
    label,
    required_label,
    component_size,
    negative,
    left_side_icon,
    trailing_label,
    drop_down_list_child,
    action_button,
    badges_children,
    error_message,
    className,
    ...props
}, ref) => {

    const { setFocus, style, sectionRef, inputRef, InputChange, activeLabel, InputHover } = useStates(props);
    const { isActive, setIsActive } = useHideDropDown(sectionRef);

    return (
        <section
            onMouseOver={() => InputHover(true)}
            onMouseLeave={() => InputHover(false)}
            onClick={() => setFocus(true)}
            ref={sectionRef}
            className={`glare-input-labelLess-field-wrapper ${style} ${className}`}
        >
            <section className='glare-input-labelLess-field-inner-wrapper'>
                {left_side_icon && <span className="glare-input-icon">{left_side_icon}</span>}
                <span className="glare-input-icon">
                    <InputLabel
                        name={name}
                        required={required_label !== undefined}
                        component_size={component_size}
                        active={activeLabel}
                        label={label}
                    />
                </span>

                {badges_children}

                <section className='input-container'>
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
                            setFocus(true);
                            setIsActive(true);
                            props.onFocus && props.onFocus(e);
                        }}
                        className="glare-input-label-less-field"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            props.onChange && props.onChange(e);
                            InputChange(e);
                        }}
                    />

                    {(trailing_label || drop_down_list_child || action_button) && (
                        <span className="glare-input-icon">
                            {trailing_label && <p className='glare-input-trailing-label'>{trailing_label}</p>}
                            {drop_down_list_child && (
                                <Button
                                    onClick={() => setIsActive(true)}
                                    component_size={component_size}
                                    disabled={props.disabled}
                                    left_icon={<i className="ri-arrow-drop-down-line"></i>}
                                />
                            )}
                            {action_button}
                        </span>
                    )}
                </section>
            </section>

            {drop_down_list_child && (
                <DynamicContainer onClick={() => setIsActive(false)} active={isActive}>
                    {drop_down_list_child}
                </DynamicContainer>
            )}

            <Tooltip message={error_message || ""} />
        </section>
    );
});

export default LabelLessInput;
