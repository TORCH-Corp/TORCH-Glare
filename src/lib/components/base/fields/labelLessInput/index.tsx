import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import './style.scss';
import { DynamicContainer } from '../../../../components/helpers/dynamicContainer';
import { useStates } from './hooks/useStates';
import { InputLabel } from './inputLabel';
import Tooltip from '../../tooltips/tooltip';
import { useHideDropDown } from '../hooks/usehideDropDown';
import { InputElement } from './components/inputElement';
import { ExtraComponents } from './components/extraComponents';

interface Props extends InputHTMLAttributes<HTMLInputElement | HTMLLabelElement> {
    name: string; // this is important for link to the input to the label
    label: string;
    required_label?: string;
    secondary_label?: string;
    component_size?: "S" | "M" | "L";// this is used to change the size style of the component
    negative?: boolean; // to have negative colors theme
    drop_down_list_child?: ReactNode; // to add drop down list if you pass it
    trailing_label?: string; // to add trailing label
    action_button?: ReactNode; // to add action button to the end of the input
    left_side_icon?: ReactNode; // to add left side icon
    badges_children?: ReactNode | ReactNode[]; // to add badges components inside the component
    error_message?: string; // to show tooltip component when error_message not null
    theme?: "System-Style" | ""; // this is used to change the color theme of the component
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

    // this hook will handle the different states style of the component
    const { setFocus, style, sectionRef, inputRef, InputChange, activeLabel, InputHover } = useStates(props);
    // this hook will show or hide the drop down list when you click on the input
    const { isActive, setIsActive } = useHideDropDown(sectionRef);

    return (
        <section
            // to handle label fucus styles
            onMouseOver={() => InputHover(true)}
            onMouseLeave={() => InputHover(false)}
            onClick={() => setFocus(true)}
            ref={sectionRef}
            className={`glare-input-labelLess-field-wrapper ${style} ${className}`}
        >
            <section className='glare-input-labelLess-field-inner-wrapper'>
                {/* to add left side icon if you pass it */}
                {left_side_icon && <span className="glare-input-icon">{left_side_icon}</span>}
                {/* ths is the input label container */}
                <span className="glare-input-icon">
                    <InputLabel
                        name={name}
                        required={required_label !== undefined}
                        component_size={component_size}
                        active={activeLabel}
                        label={label}
                    />
                </span>

                {/* to add badges components inside the component */}
                {badges_children}

                <section className='input-container'>
                    {/* the base input element */}
                    <InputElement
                        {...props}
                        setIsActive={setIsActive}
                        ref={ref}
                        setFocus={setFocus}
                        InputChange={InputChange}
                        inputRef={inputRef}
                    />

                    {/* to add action button or drop down list or trailing label to the end of the input */}
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
            <Tooltip message={error_message || ""} />
        </section>
    );
});

export default LabelLessInput;
