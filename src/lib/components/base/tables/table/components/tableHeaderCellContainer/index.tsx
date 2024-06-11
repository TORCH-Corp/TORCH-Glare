import '../style.scss';
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core";
import useStates from "./useStates";
import { TableHTMLAttributes } from "react";
import { DropdownButton } from '../shared/dropdownButton';
import { CheckBox } from '../shared/checkBox';

interface Props extends TableHTMLAttributes<HTMLTableRowElement> {
    handle_drag_end: (event: DragEndEvent) => void;
    table_header_cell_data: any; // Define the type more specifically if possible
}

export const TableHeaderCellContainer: React.FC<Props> = ({
    handle_drag_end,
    table_header_cell_data,
    className,
    ...props
}) => {

    const { isHover, setIsHover, sensors } = useStates();

    return (
        <tr
            {...props}
            className={`glare-table-row ${className || ""}`}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <th>
                <DropdownButton is_hovered={isHover} />
            </th>
            <th>
                <CheckBox forSubTable={false} />
            </th>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragEnd={handle_drag_end}
            >
                <SortableContext items={table_header_cell_data} strategy={horizontalListSortingStrategy}>
                    {props.children}
                </SortableContext>
            </DndContext>
        </tr>
    );
};
