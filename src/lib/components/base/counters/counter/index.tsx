import { HTMLAttributes } from "react";
import './style.scss';

interface Props extends HTMLAttributes<HTMLDivElement> {
    label: number
}

export default function Counter(props: Props) {
    return (
        <section {...props} className="glare-counter" >
            <p className="glare-counter-label">{props.label}</p>
        </section>
    )
}
