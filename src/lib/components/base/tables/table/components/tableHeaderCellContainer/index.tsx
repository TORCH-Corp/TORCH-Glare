import '../style.scss'
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable"
import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core"
import useStates from "./useStates"
import { TableHTMLAttributes } from "react"
import { DropdownButton } from '../shared/dropdownButton'
import { CheckBox } from '../shared/checkBox'

interface Props extends TableHTMLAttributes<HTMLTableRowElement> {
    handle_drag_end: (event: DragEndEvent) => any
    table_header_cell_data: any
}

export const TableHeaderCellContainer = (props: Props) => {

    const { isHover, setIsHover, sensors, } = useStates()

    return (

        <tr {...props} className={`glare-table-row  ${props.className}`} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
            <th>
                <DropdownButton is_hovered={isHover} />
            </th>
            <th>
                <CheckBox forSubTable={false} />
            </th>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragEnd={props.handle_drag_end}
            >
                <SortableContext items={props.table_header_cell_data} strategy={horizontalListSortingStrategy}>
                    {props.children}
                </SortableContext>
            </DndContext>
        </tr>
    )
}

