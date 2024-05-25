import { HTMLAttributes } from "react"
import './style.scss'
import { Divider } from "./divider"

interface Props extends HTMLAttributes<HTMLDivElement> {
    with_divider?: boolean
}

export default function ButtonField(props: Props) {
    return (
        <section
            {...props}
            className={`glare-button-field ${props.with_divider && "with-divider"} ${props.className}`}>
            <Divider />
            {props.children}
            <Divider />
        </section>
    )
}
