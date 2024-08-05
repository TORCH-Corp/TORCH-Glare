import './style.scss';
import { TableHeaderCellContainer } from "./components/tableHeaderCellContainer";
import { Dispatch, ReactNode, SetStateAction, TableHTMLAttributes } from 'react';
import { useDragEnd } from '@hooks/useDragEnd';
import { TableHeaderCell } from '../components/shared/tableHeaderCell';

interface Props extends TableHTMLAttributes<HTMLTableElement> {
    table_header_cells_children_data: any; // Define more specifically if possible
    table_header_cells_children_setter_data: Dispatch<SetStateAction<any>>;
    table_header_cells_children: ReactNode | ReactNode[];
    table_body_cells_children: ReactNode | ReactNode[];
}

export const Table: React.FC<Props> = ({
    table_header_cells_children_data,
    table_header_cells_children_setter_data,
    table_header_cells_children,
    table_body_cells_children,
    className,
    ...props
}) => {

    const { handleDragEnd } = useDragEnd(table_header_cells_children_data, table_header_cells_children_setter_data);

    return (
        <section className="glare-table-wrapper">

            <table {...props} className={`glare-table ${className}`}>
                <thead>
                    <TableHeaderCellContainer
                        handle_drag_end={handleDragEnd}
                        table_header_cell_data={table_header_cells_children_data}
                    >
                        {table_header_cells_children}
                        {/* dummy table header to render the end line */}
                        <TableHeaderCell isDummy style={{ width: '100vw' }} label={''} id={''} />
                    </TableHeaderCellContainer>
                </thead>
                <tbody>
                    {table_body_cells_children}
                </tbody>
            </table>
        </section>

    );
};
