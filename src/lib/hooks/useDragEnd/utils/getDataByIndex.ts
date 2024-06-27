// this function is used in the useDragEnd hook to get the data index based on the id
export const getDataByIndex = (id: string, dataArray: Array<any>) => dataArray.findIndex((cell: any) => cell.id === id);
