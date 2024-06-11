import React, { ButtonHTMLAttributes } from 'react';
import { TableIconCell } from '../../../../components/ui/tableIconCell';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    is_hovered: boolean;
    for_subtable?: boolean;
}

// Using React.FC for functional component typing
export const DropdownButton: React.FC<Props> = ({ is_hovered, for_subtable, ...props }) => {
    return (
        <TableIconCell
            {...props}
            forSubTable={for_subtable}
            className={`table-dropdown-button-container ${is_hovered ? 'hovered' : ''}`}
            isHover={is_hovered}
        />
    );
};
