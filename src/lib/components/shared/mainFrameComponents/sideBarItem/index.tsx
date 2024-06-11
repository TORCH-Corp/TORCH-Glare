import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import './style.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    Label: string;
    icon?: ReactNode;
}

const SideBarItem: React.FC<Props> = ({ Label, icon, ...buttonProps }) => {
    return (
        <button {...buttonProps} className='glare-side-bar-item'>
            {icon}
            <p>{Label}</p>
        </button>
    );
};

export default SideBarItem;
