import { ChangeEventHandler, TableHTMLAttributes, forwardRef } from "react";
import { CheckBox } from '../shared/checkBox';
import { DropdownButton } from '../shared/dropdownButton';
import '../style.scss';
import useStates from "./useStates";
import { TableCell } from "../../../components/shared/tableCell";

interface Props extends TableHTMLAttributes<HTMLTableRowElement> {
    isChecked: boolean;
    onCheckBoxChange?: ChangeEventHandler<HTMLInputElement>;
    has_sub_table?: boolean;
    isDummy?: boolean;
}

export const TableCellContainer = forwardRef<HTMLTableRowElement, Props>(({
    isChecked,
    onCheckBoxChange,
    has_sub_table,
    isDummy,
    ...props
}, ref) => {

    const { isHover, setIsHover, handleChecked, checkBoxRef } = useStates(isChecked);

    return (
        <tr
            {...props}
            ref={ref}
            className={`glare-table-row  ${isHover ? "table-cell-hovered" : ""} ${isChecked ? "table-cell-checked" : ""} ${props.className || ""}`}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            {!isDummy && <>
                <td className='small-row'>
                    <DropdownButton for_subtable={has_sub_table} is_hovered={isHover} />
                </td>
                <td className='small-row'>
                    <CheckBox ref={checkBoxRef} onChange={(e) => handleChecked(e, onCheckBoxChange)} forSubTable={true} />
                </td>
            </>}
            {props.children}
            {/* dummy cell to render the end line */}
            <TableCell style={{ borderRight: "none", borderLeft: "none" }} cellLabel={""} />
        </tr>
    );
});

TableCellContainer.displayName = 'TableCellContainer';
