import { ButtonHTMLAttributes, ReactNode } from 'react'
import './style.scss'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    Label: string
    icon?: ReactNode
}

export const SideBarItem = (props: Props) => {
    return (
        <button {...props} className='glare-side-bar-item'>
            {props.icon}
            <p>{props.Label}</p>
        </button>
    )
}

