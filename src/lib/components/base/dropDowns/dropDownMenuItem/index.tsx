import React from 'react';
import './styles/style.scss';
import { Label } from '../../labels/label';
import { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import { DropDownMenuItemInput } from './components/dropDownMenuItem-Input';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement | HTMLInputElement> {
    component_size?: 'M';
    component_label: string;
    element_name: string;
    required_label?: string;
    secondary_label?: string;
    onRightSideIconClick?: MouseEventHandler;
    component_style?: "Presentation-Warning-Style" | "Presentation-Negative-Style" | "System-Style";
    right_side_icon?: ReactNode;
    icon?: ReactNode;
    component_type?: "checkbox" | "radio";
}

const DropDownMenuItem: React.FC<Props> = ({
    component_type,
    component_size = 'M',
    component_label,
    element_name,
    required_label,
    secondary_label,
    onRightSideIconClick,
    component_style,
    right_side_icon,
    icon,
    className,
    ...props
}) => {
    return (
        component_type ? (
            // Checkbox or radio button
            <DropDownMenuItemInput
                {...props}
                component_name={element_name}
                input_type={component_type}
                label={component_label}
                secondary_label={secondary_label}
                required_label={required_label}
                component_style={component_style}
                disabled={props.disabled}
                component_size={component_size}
            />
        ) : (
            // Normal style
            <button
                {...props}
                className={`dropDownMenuItem menuItem-${component_style} dropDownMenuItem-size-${component_size} ${right_side_icon ? "hasRightSideIcon" : ""} ${className}`}
                id={element_name}
            >
                {/* If we need to have an icon */}
                {icon && <div className='dropDownMenuItem-icon'>{icon}</div>}
                <Label
                    component_size={component_size}
                    label={component_label}
                    required_label={required_label}
                    secondary_label={secondary_label}
                    name={element_name}
                    child_dir='horizontal'
                />
                {/* If we need an icon or label on the right side */}
                {right_side_icon && <button onClick={onRightSideIconClick} className='dropDownMenuItem-icon'>{right_side_icon}</button>}
            </button>
        )
    );
};

export default DropDownMenuItem;
