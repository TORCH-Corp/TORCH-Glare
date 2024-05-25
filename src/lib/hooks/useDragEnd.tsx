import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Dispatch, SetStateAction } from 'react'



export const useDragEnd = (tableData: any, setTableData: Dispatch<SetStateAction<any>>) => {

    const getHeaderCellPos = (id: string) => tableData.findIndex((cell: any) => cell.id === id);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!active || !over || active.id === over.id) return;

        const originalPos = getHeaderCellPos(String(active.id));
        const newPos = getHeaderCellPos(String(over.id));

        setTableData((cells: any) => {
            return arrayMove(cells, originalPos, newPos);
        });
    };

    return { handleDragEnd }
}


