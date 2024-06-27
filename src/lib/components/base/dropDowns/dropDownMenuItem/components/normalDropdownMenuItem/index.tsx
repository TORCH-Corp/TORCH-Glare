import { ButtonHTMLAttributes, ReactNode, MouseEventHandler } from "react";
import { Label } from "../../../../labels/label";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement | HTMLInputElement> {
    component_size?: 'M'; // this props will change the button style size see on figma design file
    component_label: string;
    element_name: string; // this will be the name of the input and this is important to link the input with the label
    required_label?: string;
    secondary_label?: string;
    right_side_icon?: ReactNode; // this will show the right side icon
    onRightSideIconClick?: MouseEventHandler; // this will be the click event of the right side icon if you pass right side icon
    component_style?: "Presentation-Warning-Style" | "Presentation-Negative-Style" | "System-Style"; // this props will change the button style see on figma design file
    icon?: ReactNode; // this will show the default icon if you pass it
}
export function NormalDropdownMenuItem({
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
}: Props) {
    return (
        <button
            {...props}
            className={`dropDownMenuItem menuItem-${component_style} dropDownMenuItem-size-${component_size} ${right_side_icon ? "hasRightSideIcon" : ""} ${className}`}
            id={element_name}
        >
            {/* If we need to have an icon and this is the default icon */}
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
}
