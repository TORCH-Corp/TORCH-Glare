import { ButtonHTMLAttributes } from 'react'
import './style.scss'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    collapse?: boolean // to collapse the item
}

export const FeedBackItem: React.FC<Props> = ({ collapse, ...props }) => {
    return (
        <button {...props} className={`glare-feedback-item ${props.className} ${collapse ? "glare-feedback-item-collapse" : ""}`}>

        </button>
    )
}
