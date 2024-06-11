import React, { InputHTMLAttributes, ReactNode } from 'react';
import { ItemPicTableCell } from './components/itemPicTableCell';
import { NormalTableCell } from './components/normalTableCell';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    onDateChange?: (date: Date) => void;
    name: string;
    cellLabel: string;
    cell_icon?: string;
    secondary_cell_label?: string;
    component_size?: 'S' | 'M';
    disabled?: boolean;
    negative?: boolean;
    component_type: 'Item Style' | 'Input-Field' | 'Input-DropList' | 'Input-Trailing-Label' | 'input-date-picker' | 'Label-Buttons';
    drop_down?: boolean;
    drop_down_list_child?: ReactNode;
    trailing_label?: string;
    action_button?: ReactNode;
    buttons_or_labels_children?: ReactNode | ReactNode[];
}

export const TableCell: React.FC<Props> = ({
    component_type,
    name,
    cellLabel,
    secondary_cell_label,
    cell_icon,
    disabled,
    component_size,
    onDateChange,
    negative,
    drop_down,
    drop_down_list_child,
    trailing_label,
    action_button,
    buttons_or_labels_children,
    ...props // Spread any additional props
}) => {
    return (
        component_type === 'Item Style' ? (
            <ItemPicTableCell
                name={name}
                cellLabel={cellLabel}
                secondary_cell_label={secondary_cell_label}
                cell_icon={cell_icon}
                disabled={disabled}
                component_size={component_size}
                {...props}
            />
        ) : (
            <NormalTableCell
                name={name}
                component_type={component_type}
                onDateChange={onDateChange}
                cellLabel={cellLabel}
                component_size={component_size}
                disabled={disabled}
                negative={negative}
                drop_down={drop_down}
                drop_down_list_child={drop_down_list_child}
                trailing_label={trailing_label}
                action_button={action_button}
                buttons_or_labels_children={buttons_or_labels_children}
                {...props}
            />
        )
    );
};
