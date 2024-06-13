import './style.scss';
import { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
}

const SideFormBarItem: React.FC<Props> = ({
    ...props
}) => {
    return (
        <button {...props} className={`sideFormBarItem ${props.className}`}>
        </button>
    );
};

export default SideFormBarItem;
