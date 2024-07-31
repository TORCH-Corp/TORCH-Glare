import { InputHTMLAttributes } from "react"
import './style.scss'
import { TableLabel } from "../../../../ui/tableLabel"

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    cellLabel: string
    component_size?: "S" | "M"
}

export const NormalTableCell = ({
    cellLabel,
    component_size, ...props
}: Props) => {
    return (
        <td className={`glare-table-cell ${props.className} glare-table-cell-${component_size || 'S'}`}>
            {
                props.children ?
                    props.children
                    :
                    <TableLabel  {...props} label={cellLabel} style={{ padding: "0 8px" }} component_size={component_size || "S"} typo_size='SemiBold' />
            }
        </td>
    )
}

