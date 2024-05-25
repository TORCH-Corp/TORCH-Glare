import { ButtonHTMLAttributes } from 'react'
import './style.scss'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    sort_direction: "UP" | "DOWN" | "Default"
    component_size?: "S" | "M" | "L"
}
export function TableSort(props: Props) {
    return (
        <span {...props} className={`glare-TableSort glare-CellSizingLine-${props.component_size || "S"}`}>
            <span className={`glare-CellSizingLine-icons ${props.sort_direction == 'Default' && "glare-CellSizingLine-not-active"}`}>
                {props.sort_direction == "UP" ? <i className="ri-arrow-up-line"></i>
                    :
                    props.sort_direction == 'DOWN' ? <i className="ri-arrow-down-line"></i>
                        :
                        <i className="ri-arrow-up-down-line"></i>
                }
            </span>
        </span>
    )
}
