import React, { HTMLAttributes, useRef } from 'react';
import RectangleIcon from './rectangleIcon';
import './style.scss';
import useDirectionCalc from '../../../../hooks/useDirectionCalc';

interface Props extends HTMLAttributes<HTMLDivElement> {
    message: string | null;
}

const Tooltip: React.FC<Props> = ({ message, className, ...props }) => {
    const ref = useRef<HTMLDivElement>(null);
    const direction = useDirectionCalc({
        ElementRef: ref,
        dirClasses: {
            left: 'Tooltip-Left',
            right: 'Tooltip-Right',
            top: 'Tooltip-TOP',
            bottom: 'Tooltip-BOTTOM'
        },
        isElementActive: Boolean(message),
        trigger: props // Assuming trigger is to spread additional props onto the root element
    });

    return message ? (
        <section
            ref={ref}
            className={`Tooltip ${direction} ${className}`}
            {...props}
        >
            <RectangleIcon />
            <p>{message}</p>
        </section>
    ) : null;
};

export default Tooltip;
