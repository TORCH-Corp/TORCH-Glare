import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Dispatch, SetStateAction } from 'react'
import { getDataByIndex } from './utils/getDataByIndex';

// this hook is used with @dnd-kit/core library and this library used for drag and drop events
// this hook will handle the dragEnd event and change the data indexes, the data should be an array

export const useDragEnd = (
    dataArray: Array<any>,
    setDataArray: Dispatch<SetStateAction<Array<any>>>
) => {

    // this function
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!active || !over || active.id === over.id) return;

        // get the data index based on the id inside $active prop
        const originalPos = getDataByIndex(String(active.id), dataArray);
        // change the data index based on the drag end event and $over prop
        const newPos = getDataByIndex(String(over.id), dataArray);

        // move the data inside the array to the new position
        setDataArray((cells: any) => {
            return arrayMove(cells, originalPos, newPos);
        });
    };

    return { handleDragEnd }
}


