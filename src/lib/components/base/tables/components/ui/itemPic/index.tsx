import { ImgHTMLAttributes } from "react"
import './style.scss'
interface Props extends ImgHTMLAttributes<HTMLImageElement> {
    component_size?: "S" | "M" | "L"
}
export function ItemPic(props: Props) {
    return (
        <img {...props} className={`table-ItemPic table-ItemPic-${props.component_size || "S"} ${props.className}`} />
    )
}
