import { InputHTMLAttributes, ReactNode } from 'react'
import { ItemPicTableCell } from './components/itemPicTableCell'
import { NormalTableCell } from './components/normalTableCell'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    onDateChange?: (date: Date) => void
    name: string
    cellLabel: string
    cell_icon?: string
    secondary_cell_label?: string
    component_size?: "S" | "M"
    disabled?: boolean
    negative?: boolean
    component_type: "Item Style" | "Input-Field" | "Input-DropList" | "Input-Trailing-Label" | "input-date-picker" | "Label-Buttons"
    drop_down?: boolean
    drop_down_list_child?: ReactNode
    trailing_label?: string
    action_button?: ReactNode
    buttons_or_labels_children?: ReactNode | ReactNode[]
}

export const TableCell = (props: Props) => {
    return (
        props.component_type == "Item Style" ?
            <ItemPicTableCell
                {...props}
                name={props.name}
                cellLabel={props.cellLabel}
                secondary_cell_label={props.secondary_cell_label}
                cell_icon={props.cell_icon}
                disabled={props.disabled}
                component_size={props.component_size}
            />
            :
            <NormalTableCell
                {...props}
                name={props.name}
                component_type={props.component_type}
                onDateChange={props.onDateChange}
                cellLabel={props.cellLabel}
                component_size={props.component_size}
                disabled={props.disabled}
                negative={props.negative}
                drop_down={props.drop_down}
                drop_down_list_child={props.drop_down_list_child}
                trailing_label={props.trailing_label}
                action_button={props.action_button}
                buttons_or_labels_children={props.buttons_or_labels_children}
            />
    )
}
