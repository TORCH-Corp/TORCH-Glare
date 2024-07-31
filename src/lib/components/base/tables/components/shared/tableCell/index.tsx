import React, { InputHTMLAttributes } from 'react';
import { NormalTableCell } from './components/normalTableCell';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    cellLabel: string;
    component_size?: 'S' | 'M';
}

export const TableCell: React.FC<Props> = ({
    cellLabel,
    component_size,
    ...props // Spread any additional props
}) => {
    return (
        <NormalTableCell
            cellLabel={cellLabel}
            component_size={component_size}
            {...props}
        />
    )
};
