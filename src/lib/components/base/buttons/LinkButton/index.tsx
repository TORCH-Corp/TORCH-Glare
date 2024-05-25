import { AnchorHTMLAttributes } from "react"
import arrow from './assets/arrow.svg'
import './style.scss'

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
    component_size?: "S" | "M" | "L"
    dir?: "ltr" | "rtl"
}

export const LinkButton = (props: Props) => {
    return (
        <a
            {...props}
            className={`glare-link-button glare-link-button-size-${props.component_size || "S"} ${props.dir == 'rtl' && "link-button-reverse"}`}
        >
            {props.children}
            <div className="link-button-arrow-container">
                <img src={arrow} />
            </div>
        </a>
    )
}


