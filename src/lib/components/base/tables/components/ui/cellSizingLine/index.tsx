import './style.scss';
import React, { HTMLAttributes } from 'react';

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
                <DefaultIcon draggable={false} className='glare-CellSizingLine-def-none-sizing' />
            ) : (
                <>
                    <DefaultIcon draggable={false} className='glare-CellSizingLine-def' />
                    <ActiveIcon draggable={false} className='glare-CellSizingLine-active' />
                </>
            )}
        </button>
    );
});



const DefaultIcon = (props: HTMLAttributes<HTMLOrSVGElement>) => (
    <svg {...props} width="2" height="20" viewBox="0 0 2 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 1C0 0.447715 0.447715 0 1 0C1.55228 0 2 0.447715 2 1V19C2 19.5523 1.55228 20 1 20C0.447715 20 0 19.5523 0 19V1Z" fill="#626467" />
    </svg>
)


const ActiveIcon = (props: HTMLAttributes<HTMLOrSVGElement>) => (
    <svg {...props} width="8" height="30" viewBox="0 0 8 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="8" height="30" rx="3" fill="#3391FF" />
        <svg width="4" height="12" viewBox="0 0 4 12" fill="none" xmlns="http://www.w3.org/2000/svg" x="2" y="9">
            <circle cx="0.75" cy="1.5" r="0.75" fill="#F9F9F9" />
            <circle cx="3.25" cy="1.5" r="0.75" fill="#F9F9F9" />
            <circle cx="0.75" cy="4.5" r="0.75" fill="#F9F9F9" />
            <circle cx="3.25" cy="4.5" r="0.75" fill="#F9F9F9" />
            <circle cx="0.75" cy="7.5" r="0.75" fill="#F9F9F9" />
            <circle cx="3.25" cy="7.5" r="0.75" fill="#F9F9F9" />
            <circle cx="0.75" cy="10.5" r="0.75" fill="#F9F9F9" />
            <circle cx="3.25" cy="10.5" r="0.75" fill="#F9F9F9" />
        </svg>
    </svg>
)