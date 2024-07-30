// this function is used in the useDragEnd hook to get the data index based on the id
interface DataItem {
    id: string;
    // Add other properties of DataItem if necessary
}

// This function is used in the useDragEnd hook to get the data index based on the id
export const getDataByIndex = (id: string, dataArray: Array<DataItem | any>): number => {
    return dataArray.findIndex((cell: DataItem | any) => cell.id === id);
};
