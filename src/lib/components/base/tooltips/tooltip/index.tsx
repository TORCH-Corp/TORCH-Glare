import React, { useRef } from 'react';
import RectangleIcon from './rectangleIcon';
import './style.scss';
import useDirectionCalc from '../../../../hooks/useDirectionCalc';

interface Props {
    message: string | null; // the message to be shown in the tooltip
}

const Tooltip: React.FC<Props> = ({ message, ...props }) => {
    const ref = useRef<HTMLDivElement>(null);
    // detect the viewport and change the direction of the tooltip
    const direction = useDirectionCalc({
        ElementRef: ref,
        dirClasses: {
            // these are the classes that will be added to the tooltip to change its direction
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
            {...props}
            ref={ref}
            dir='ltr'
            className={`Tooltip ${direction}`}
        >
            <RectangleIcon />
            <p>{message}</p>
        </section>
    ) : null;
};

export default Tooltip;
