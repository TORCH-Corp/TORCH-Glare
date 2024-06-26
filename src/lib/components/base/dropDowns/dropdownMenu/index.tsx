import React, { HTMLAttributes, RefObject } from "react";
import './style.scss';

interface Props extends HTMLAttributes<HTMLUListElement> {
    Ref?: RefObject<HTMLUListElement>;
    component_style?: "System-Style" | "Presentation-Style"; // this props will change the button style  see on figma design file
}

const DropDownMenu: React.FC<Props> = ({
    Ref,
    component_style = "System-Style",
    className,
    ...props
}) => {
    return (
        <ul
            {...props}
            ref={Ref}
            className={`drop-down-menu drop-down-menu-${component_style} ${className}`}
        >
        </ul>
    );
};

export default DropDownMenu;
