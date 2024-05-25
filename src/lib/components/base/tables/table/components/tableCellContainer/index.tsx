import { CheckBox } from '../shared/checkBox'
import { DropdownButton } from '../shared/dropdownButton'
import '../style.scss'
import useStates from "./useStates"
import { ChangeEventHandler, TableHTMLAttributes } from "react"

interface Props extends TableHTMLAttributes<HTMLTableRowElement> {
    isChecked: boolean
    onCheckBoxChange?: ChangeEventHandler
    has_sub_table?: boolean
}

export const TableCellContainer = (props: Props) => {

    const { isHover, setIsHover, isChecked, handleChecked, checkBoxRef } = useStates(props.isChecked)

    return (
        <tr {...props} className={`glare-table-row ${isHover && "table-cell-hovered"} ${isChecked && "table-cell-checked"}  ${props.className} `} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
            <td className='small-row'>
                <DropdownButton for_subtable={props.has_sub_table} is_hovered={isHover} />
            </td>
            <td className='small-row'>
                <CheckBox Ref={checkBoxRef} onChange={(e) => handleChecked(e, props.onCheckBoxChange)} forSubTable={true} />
            </td>
            {props.children}
        </tr>
    )
}

