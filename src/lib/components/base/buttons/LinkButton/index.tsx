import React, { AnchorHTMLAttributes } from 'react';
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
            dir={dir}
            className={`glare-link-button glare-link-button-size-${component_size} ${dir === 'rtl' ? "link-button-reverse" : ''} ${props.className}`}
        >
            {props.children}
            <div className="link-button-arrow-container">
                <Arrow />
            </div>
        </a>
    );
};


const Arrow = () => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.81582 1.58451L3.2807 0.119629L9.12479 0.875203L9.88037 6.71929L8.41549 8.18417L7.78584 3.31409L3.35267 7.74727L2.25272 6.64733L6.6859 2.21415L1.81582 1.58451Z" fill="#F9F9F9" />
        <path d="M0.325211 8.57478L1.48169 7.4183L2.58164 8.51824L1.42515 9.67472L0.325211 8.57478Z" fill="#F9F9F9" />
    </svg>
)