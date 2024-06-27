import { ReactNode } from "react";

interface Props {
    badge_icon?: ReactNode; // if you pass any icon then it will replace the default icon
}

export function BadgeIcon(props: Props) {
    return (
        // if you pass any icon then it will replace the default icon
        < span className='badge-icon' >
            {props.badge_icon ? props.badge_icon : <i className="ri-circle-fill badge-def-icon"></i>}
        </span >
    )
}
