import './style.scss';
import def from './icons/def.svg';
import active from './icons/active.svg';
import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    noneSizing?: boolean;
}

export const CellSizingLine = React.forwardRef<HTMLButtonElement, Props>(({
    noneSizing,
    ...props
}, ref) => {
    return (
        <button
            {...props}
            ref={ref}
            className={`glare-CellSizingLine ${props.className} ${noneSizing ? 'none-sizing' : ''}`}
        >
            {noneSizing ? (
                <img draggable={false} className='glare-CellSizingLine-def-none-sizing' src={def} alt="resize-icon" />
            ) : (
                <>
                    <img draggable={false} className='glare-CellSizingLine-def' src={def} alt="resize-icon" />
                    <img draggable={false} className='glare-CellSizingLine-active' src={active} alt="resize-icon" />
                </>
            )}
        </button>
    );
});
