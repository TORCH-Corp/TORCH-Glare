import React, { AnchorHTMLAttributes } from 'react';
import arrow from './assets/arrow.svg';
import './style.scss';

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
    component_size?: "S" | "M" | "L"; // this props will change the button style size see on figma design file
    dir?: "ltr" | "rtl"; // this prop important for rtl layout
}

export const LinkButton: React.FC<Props> = ({
    component_size = "S",
    dir,
    ...props
}) => {
    return (
        <a
            {...props}
            className={`glare-link-button glare-link-button-size-${component_size} ${dir === 'rtl' ? "link-button-reverse" : ''} ${props.className}`}
        >
            {props.children}
            <div className="link-button-arrow-container">
                <img src={arrow} alt="arrow" />
            </div>
        </a>
    );
};
