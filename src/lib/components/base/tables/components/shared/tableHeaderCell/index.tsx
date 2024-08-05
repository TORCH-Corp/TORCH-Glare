import { TableHTMLAttributes, forwardRef, useRef } from 'react';
import { useResize } from '@hooks/useResize';
import { TableLabel } from '../../ui/tableLabel';
import { TableSort } from '../../ui/tableSort';
import './style.scss';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CellSizingLine } from '../../ui/cellSizingLine';

export interface TableHeaderCellProps extends TableHTMLAttributes<HTMLTableCellElement> {
    label: string;
    component_size?: 'S' | 'M' | 'L';
    end_edge?: boolean;
    resizable?: boolean;
    id: string;
    on_sorting_btn_click?: () => void;
    sorting_icon_type?: 'Default' | 'UP' | 'DOWN';
    isDummy?: boolean;
}

export const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(({
    label,
    component_size = 'S',
    end_edge = false,
    resizable = false,
    id,
    isDummy,
    on_sorting_btn_click,
    sorting_icon_type = 'Default',
    ...props
}, ref) => {
    const resizableRef = useRef<HTMLDivElement>(null);
    const { width, handleStartResize } = useResize(resizableRef);
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    return (
        <th ref={ref} {...props} className="glare-TableHeaderCell-wrapper">
            <section className="table-header-inner-wrapper" style={{ width: `${width}px` }} ref={resizableRef}>
                {
                    isDummy ?
                        <div className={`glare-TableHeaderCell glare-TableHeaderCell-${component_size} TableHeaderCell-dummy`}></div>
                        :
                        <>
                            <div
                                style={style}
                                {...attributes}
                                {...listeners}
                                ref={setNodeRef}
                                className={`glare-TableHeaderCell glare-TableHeaderCell-${component_size} ${end_edge ? 'TableHeaderCell-without-sort-button' : ''}`}
                            >
                                <TableLabel text_align="start" component_size={component_size} typo_size="SemiBold" label={label} />
                                <TableSort sort_direction={sorting_icon_type} component_size={component_size} onClick={on_sorting_btn_click} />
                            </div>

                            {resizable && <CellSizingLine className="glare-TableHeaderCell-resize-line" onMouseDown={handleStartResize} onTouchStart={handleStartResize} />}
                        </>
                }
            </section>
        </th>
    );
});
