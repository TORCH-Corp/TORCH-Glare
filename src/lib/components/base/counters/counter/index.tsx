import React, { HTMLAttributes } from "react";
import './style.scss';

interface Props extends HTMLAttributes<HTMLDivElement> {
    label: number;
}

export const Counter: React.FC<Props> = ({
    label,
    ...props
}) => {
    return (
        <section {...props} className={`glare-counter ${props.className}`}>
            <p className="glare-counter-label">{label}</p>
        </section>
    );
};

export default Counter;
