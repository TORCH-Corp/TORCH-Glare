import './style.scss'
import { Label } from '../../labels/label'
import { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    component_size?: "L" | "M"
    name: string
    label?: string
    required_label?: string
    secondary_label?: string
}
export default function TopFormBarItem(props: Props) {
    return (
        <button onClick={props.onClick} className="TopFormBarItem">
            <Label
                name={props.name}
                component_size={props.component_size}
                label={props.label}
                required_label={props.required_label}
                secondary_label={props.secondary_label}
                as_child={true}
            ></Label>
        </button>
    )
}
