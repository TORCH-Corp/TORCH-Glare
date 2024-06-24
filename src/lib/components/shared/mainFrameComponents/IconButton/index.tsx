import React, { ButtonHTMLAttributes, ReactNode } from "react";
import './style.scss';
import Counter from "../../../base/counters/counter";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: ReactNode;
    count?: number;
}

const IconButton: React.FC<Props> = ({ icon, count, className, ...buttonProps }) => {
    return (
        <button {...buttonProps} className={`glare-small-button ${className}`}>
            {count ? <Counter label={count} /> : null}
            {icon}
        </button>
    );
};

export default IconButton;
