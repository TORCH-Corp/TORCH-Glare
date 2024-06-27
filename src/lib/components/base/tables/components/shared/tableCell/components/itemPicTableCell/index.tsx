import { InputHTMLAttributes } from "react"
import { ItemPic } from "../../../../ui/itemPic"
import { TableLabel } from "../../../../ui/tableLabel"
import './style.scss'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    name: string
    cellLabel?: string // this is the label of the cell
    cell_icon?: string // the src of the cell icon img
    secondary_cell_label?: string // normal text with secondary style
    component_size?: "S" | "M" // this is used to change the size style of the component
    disabled?: boolean // this is used to disable the cell
}

export const ItemPicTableCell = (props: Props) => {
    return (
        <td>
            <section {...props} className='glare-table-cell-label-and-icon-container'>
                {props.cell_icon && <ItemPic src={props.cell_icon} alt='table cell icon' component_size={props.component_size} />}

                <TableLabel secondary_label={props.secondary_cell_label} label={props.cellLabel} style={{ padding: "0 8px" }} component_size={props.component_size || "S"} typo_size='SemiBold' className='glare-table-cell-label' />
            </section>
        </td>
    )
}


