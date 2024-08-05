import { forwardRef, InputHTMLAttributes, ReactNode, useRef } from 'react';
import './style.scss';
import { DynamicContainer } from '@components/helpers/dynamicContainer';
import { useStates } from './hooks/useStates';
import Tooltip from '@components/base/tooltips/tooltip';
import { useHideDropDown } from '@/hooks/usehideDropDown';
import { InputElement } from './componnets/InputElement';
import { ExtraComponents } from './componnets/extraComponents';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    component_size?: "S" | "M" | "L"; // this is used to change the size style of the component
    component_style?: "System-Style" | ""; // this is used to change the color theme of the component
    negative?: boolean; // to have negative colors
    left_side_icon?: ReactNode; // to add left side icon if you pass it 
    trailing_label?: string; // to add trailing label
    drop_down_list_child?: ReactNode; // to add drop down list if you pass it
    action_button?: ReactNode; // to add action button to the end of the input 
    badges_children?: ReactNode | ReactNode[]; // to add badges components inside the component if you pass it
    error_message?: string; // to show tooltip component when error_message not null
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

    // this hook will handle the different states style of the component
    const { setFocus, style } =
        useStates({
            component_size,
            component_style,
            negative,
            badges_children,
            error_message,
            className, ...props
        });

    const sectionRef = useRef<HTMLDivElement>(null);
    // this hook will show or hide the drop down list when you click on the input
    const { isActive, setIsActive } = useHideDropDown(sectionRef);

    return (
        <section
            onClick={() => {
                setFocus(true)//for fucus state style
            }}
            className={`glare-input-field-wrapper ${style} ${className}`}
            ref={sectionRef}
            style={props.style}
        >
            <section className='glare-input-field-inner-wrapper'>
                {/* to add left side icon */}
                {left_side_icon && <span className="glare-input-icon">{left_side_icon}</span>}
                {/* to add badges components inside the component */}
                {badges_children}

                <section className='input-container'>
                    {/* the base input element */}
                    <InputElement
                        {...props}
                        style={{}}
                        ref={ref}
                        setFocus={setFocus}
                        setIsActive={setIsActive}
                    />
                    {/* to add action button or drop down list button or trailing label to the end of the input */}
                    <ExtraComponents
                        setIsActive={setIsActive}
                        drop_down_list_child={drop_down_list_child}
                        action_button={action_button}
                        trailing_label={trailing_label}
                        component_size={component_size}
                        disabled={props.disabled}
                    />
                </section>
            </section>

            {/* // to render the drop down list here when user click on the input
                // this dynamic container will detect the hit the viewport and change the direction */}
            {drop_down_list_child && (
                <DynamicContainer onClick={() => setIsActive(false)} active={isActive}>
                    {drop_down_list_child}
                </DynamicContainer>
            )}

            {/* to render the tooltip here when error_message not null */}
            {error_message && <Tooltip {...props} message={error_message} />}
        </section>
    );
});

export default Input;
