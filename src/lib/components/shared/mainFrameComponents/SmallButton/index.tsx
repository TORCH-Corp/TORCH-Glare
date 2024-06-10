import { ButtonHTMLAttributes, ReactNode } from "react"
import './style.scss'
import Counter from "../../../base/counters/counter"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: ReactNode
    count?: number
}

export const SmallButton = (props: Props) => {
    return (
        <button {...props} className={`glare-small-button ${props.className}`} >
            {props.count ?
                <Counter label={props.count} />
                : null
            }
            {props.icon}
        </button>
    )
}

