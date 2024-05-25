import { ButtonHTMLAttributes } from 'react'
import { TableIconCell } from '../../../../components/ui/tableIconCell'


interface Props extends ButtonHTMLAttributes<HTMLDivElement> {
    is_hovered: boolean
    for_subtable?: boolean
}
export const DropdownButton = (props: Props) => {
    return (
        <TableIconCell forSubTable={props.for_subtable} className='table-dropdown-button-container ' isHover={props.is_hovered} />
    )
}

