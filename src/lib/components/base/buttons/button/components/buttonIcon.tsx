import { ReactNode } from "react";

interface Props {
    icon?: ReactNode; // this will show icon if you pass it
    is_loading?: boolean; // this will show loading icon if true
}

export function ButtonIcon(props: Props) {
    return (
        /* if you pass left icon and not loading then show icon */
        props.icon && !props.is_loading ? <div className='glare-button-icon'>{props.icon}</div> : null
    )
}
