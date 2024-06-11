import { forwardRef, InputHTMLAttributes, ReactNode, useRef } from 'react';
import './style.scss';
import Button from '../../../buttons/button';
import { DynamicContainer } from '../../../../../components/helpers';
import { useStates } from './hooks/useStates';
import Tooltip from '../../../tooltips/tooltip';
import { useHideDropDown } from '../../hooks/usehideDropDown';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    component_size?: "S" | "M" | "L";
    component_style?: "System-Style" | "";
    negative?: boolean;
    left_side_icon?: ReactNode;
    trailing_label?: string;
    drop_down_list_child?: ReactNode;
    action_button?: ReactNode;
    badges_children?: ReactNode | ReactNode[];
    error_message?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(({
    component_size,
    component_style,
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
    const { setFocus, style } = useStates({ ...props, negative });
    const sectionRef = useRef<HTMLDivElement>(null);
    const { isActive, setIsActive } = useHideDropDown(sectionRef);

    return (
        <section
            onClick={() => setFocus(true)}
            className={`glare-input-field-wrapper ${style} ${className}`}
            ref={sectionRef}
        >
            <section className='glare-input-field-inner-wrapper'>
                {left_side_icon && <span className="glare-input-icon">{left_side_icon}</span>}
                {badges_children}

                <section className='input-container'>
                    <input
                        {...props}
                        ref={ref}
                        onBlur={(e) => {
                            setFocus(false);
                            props.onBlur && props.onBlur(e);
                        }}
                        onFocus={(e) => {
                            setFocus(true);
                            setIsActive(true); // for dropdown list
                            props.onFocus && props.onFocus(e);
                        }}
                        className={`glare-input-field`}
                        autoComplete='off'
                        placeholder={props.placeholder}
                    />

                    {(trailing_label || drop_down_list_child || action_button) && (
                        <span className="glare-input-icon">
                            {trailing_label && <p className='glare-input-trailingLabel'>{trailing_label}</p>}
                            {drop_down_list_child && (
                                <Button onClick={() => setIsActive(true)} component_size={component_size} disabled={props.disabled} left_icon={<i className="ri-arrow-down-s-line"></i>} />
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

            {error_message && <Tooltip message={error_message} />}
        </section>
    );
});

export default Input;
