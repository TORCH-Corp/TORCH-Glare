import React, { InputHTMLAttributes } from 'react';
import { TableLabel } from '../../ui/tableLabel';
import './style.scss';
interface Props extends InputHTMLAttributes<HTMLTableCellElement> {
    cellLabel: string;
    component_size?: 'S' | 'M';
}

export const TableCell: React.FC<Props> = ({
    cellLabel,
    component_size,
    ...props // Spread any additional props
}) => {
    return (
        <td {...props} className={`glare-table-cell ${props.className} glare-table-cell-${component_size || 'S'}`}>
            {
                props.children ?
                    props.children
                    :
                    <TableLabel  {...props} label={cellLabel} style={{ padding: "0 8px" }} component_size={component_size || "S"} typo_size='SemiBold' />
            }
        </td>
    )
};
