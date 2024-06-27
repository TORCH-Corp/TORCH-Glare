import './style.scss';
import ring from './ring.svg';
import { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
    component_size: "S" | "M" | "L"; // this is used to change the size style of the component
}

export default function RingLoading({ component_size, ...props }: Props) {
    return (
        <section {...props} className={`loading-frame loading-frame-size-${component_size}`}>
            {/* this is the loading animation ring image with infinity loop rotation animation */}
            <img className="loading-img" src={ring} alt="Loading" />
            {/* here we can have any child to be in the center of the component */}
            <section className="loading-animation-text-container">
                {props.children}
            </section>
        </section>
    );
}
