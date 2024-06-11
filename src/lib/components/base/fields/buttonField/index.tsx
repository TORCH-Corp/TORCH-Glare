import React, { HTMLAttributes } from "react";
import './style.scss';
import { Divider } from "./divider";

interface Props extends HTMLAttributes<HTMLDivElement> {
    with_divider?: boolean;
}

const ButtonField: React.FC<Props> = ({
    with_divider,
    className,
    children,
    ...props
}) => {
    return (
        <section
            {...props}
            className={`glare-button-field ${with_divider ? "with-divider" : ""} ${className}`}
        >
            {with_divider && <Divider />}
            {children}
            {with_divider && <Divider />}
        </section>
    );
};

export default ButtonField;
