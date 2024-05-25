import './style.scss';
import def from './icons/def.svg';
import active from './icons/active.svg';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    noneSizing?: boolean;
}

export function CellSizingLine({ noneSizing, ...elementProps }: Props) {
    return (
        <button
            {...elementProps}
            className={`glare-CellSizingLine ${elementProps.className} ${noneSizing && "none-sizing"}`}
        >
            {noneSizing ?
                <img draggable={false} className='glare-CellSizingLine-def-none-sizing' src={def} alt="resize-icon" />
                :
                <><img draggable={false} className='glare-CellSizingLine-def' src={def} alt="resize-icon" /><img draggable={false} className='glare-CellSizingLine-active' src={active} alt="resize-icon" /></>
            }
        </button>
    );
}
