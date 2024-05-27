import './style.scss'
import ring from './ring.svg'
import { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
    component_size: "S" | "M" | "L",
}

export default function RingLoading(props: Props) {
    return (
        <section {...props} className={`loading-frame loading-frame-size-${props.component_size}`}>
            <img className="loading-img" src={ring} />

            <section className="loading-animation-text-container">
                {props.children}
            </section>
        </section>
    )
}
