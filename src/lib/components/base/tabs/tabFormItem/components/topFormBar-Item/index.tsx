import './style.scss';
import { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
}
const TopFormBarItem: React.FC<Props> = ({
    ...props
}) => {
    return (
        <button {...props} className={`TopFormBarItem ${props.className}`} >
        </button>
    );
};

export default TopFormBarItem;
