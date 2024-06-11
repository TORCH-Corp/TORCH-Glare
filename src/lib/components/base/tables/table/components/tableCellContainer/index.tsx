import React, { ChangeEventHandler, TableHTMLAttributes } from "react";
import { CheckBox } from '../shared/checkBox';
import { DropdownButton } from '../shared/dropdownButton';
import '../style.scss';
import useStates from "./useStates";

interface Props extends TableHTMLAttributes<HTMLTableRowElement> {
    isChecked: boolean;
    onCheckBoxChange?: ChangeEventHandler<HTMLInputElement>;
    has_sub_table?: boolean;
}

export const TableCellContainer: React.FC<Props> = ({
    isChecked,
    onCheckBoxChange,
    has_sub_table,
    ...props
}) => {
    const { isHover, setIsHover, handleChecked, checkBoxRef } = useStates(isChecked);

    return (
        <tr
            {...props}
            className={`glare-table-row ${isHover ? "table-cell-hovered" : ""} ${isChecked ? "table-cell-checked" : ""} ${props.className || ""}`}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <td className='small-row'>
                <DropdownButton for_subtable={has_sub_table} is_hovered={isHover} />
            </td>
            <td className='small-row'>
                <CheckBox ref={checkBoxRef} onChange={(e) => handleChecked(e, onCheckBoxChange)} forSubTable={true} />
            </td>
            {props.children}
        </tr>
    );
};
