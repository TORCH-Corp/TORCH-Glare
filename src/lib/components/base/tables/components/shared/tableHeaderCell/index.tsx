import { useResize } from '../../../../../../hooks/useResize'
import { CellSizingLine } from '../../../..'
import { TableLabel } from '../../ui/tableLabel'
import { TableSort } from '../../ui/tableSort'
import './style.scss'
import { TableHTMLAttributes, useRef } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from "@dnd-kit/utilities";

interface Props extends TableHTMLAttributes<HTMLTableCellElement> {
    component_size?: "S" | "M" | "L"
    label: string
    end_edge?: boolean
    resizable?: boolean
    id: string
    on_sorting_btn_click?: () => any
    sorting_icon_type?: "Default" | "UP" | "DOWN"
}
export function TableHeaderCell(props: Props) {

    const resizableRef = useRef<any>(null);
    const { width, handleStartResize } = useResize(resizableRef)
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ ...props });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    return (
        <th
            {...props}
            className='glare-TableHeaderCell-wrapper'
        >
            <section className='table-header-inner-wrapper' style={{ width: width + "px" }} ref={resizableRef}
            >
                <div
                    style={style}
                    {...attributes}
                    {...listeners}
                    ref={setNodeRef}
                    className={`glare-TableHeaderCell glare-TableHeaderCell-${props.component_size || "S"} ${props.end_edge && "TableHeaderCell-without-sort-button"}`}>
                    <TableLabel text_align='start' component_size={props.component_size || "S"} typo_size='SemiBold' label={props.label} />
                    <TableSort sort_direction={props.sorting_icon_type || "Default"} component_size={props.component_size} />
                </div>

                {props.resizable && < CellSizingLine className='glare-TableHeaderCell-resize-line' onMouseDown={handleStartResize} onTouchStart={handleStartResize} />}
            </section>
        </th>
    )
}
