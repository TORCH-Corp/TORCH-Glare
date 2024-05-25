import { HTMLAttributes, RefObject } from "react";
import './style.scss';

interface Props extends HTMLAttributes<HTMLUListElement> {
    Ref?: RefObject<HTMLUListElement>; // RefObject type for a reference to a DOM element
    component_style?: "System-Style" | "Presentation-Style";
}

export default function DropDownMenu(props: Props) {
    return (
        <ul
            {...props}
            ref={props.Ref}
            className={`drop-down-menu drop-down-menu-${props.component_style} ${props.className}`}
        >
        </ul>
    );
}
