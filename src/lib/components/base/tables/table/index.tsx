import './style.scss'
import { TableHeaderCellContainer } from "./components/tableHeaderCellContainer";
import { Dispatch, ReactNode, SetStateAction, TableHTMLAttributes } from 'react';
import { useDragEnd } from '../../../../hooks/useDragEnd';

interface Props extends TableHTMLAttributes<HTMLTableElement> {
    table_header_cells_children_data: any
    table_header_cells_children_setter_data: Dispatch<SetStateAction<any>>
    table_header_cells_children: ReactNode | ReactNode[]
    table_body_cells_children: ReactNode | ReactNode[]
}

export const Table = (props: Props) => {

    const { handleDragEnd } = useDragEnd(props.table_header_cells_children_data, props.table_header_cells_children_setter_data)

    return (
        <table {...props} className={`glare-table ${props.className}`}>
            <thead >
                <TableHeaderCellContainer handle_drag_end={handleDragEnd} table_header_cell_data={props.table_header_cells_children_data} >
                    {props.table_header_cells_children}
                </TableHeaderCellContainer>
            </thead>

            <tbody>
                {props.table_body_cells_children}
            </tbody>
        </table>
    )
}




