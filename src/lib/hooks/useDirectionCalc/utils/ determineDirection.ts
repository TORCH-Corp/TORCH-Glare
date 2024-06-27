import { Dispatch, SetStateAction } from "react";
import { DirectionsStatus, DirectionsClasses } from "../types";

// Function to determine the direction based on the position status
export const determineDirection = (storedPositionStatus: DirectionsStatus, setStoredPositionStatus: Dispatch<SetStateAction<DirectionsStatus>>, newPositionStatus: DirectionsStatus, dirClasses: DirectionsClasses): string => {

    // this function is to take action when the position status changes
    // we store the position status in the storedPositionStatus state to avoid infinite loops

    if (newPositionStatus.right && !storedPositionStatus.right) {
        setStoredPositionStatus({ ...storedPositionStatus, right: true });
        return dirClasses.left;
    }
    if (newPositionStatus.left && !storedPositionStatus.left) {
        setStoredPositionStatus({ ...storedPositionStatus, left: true });
        return dirClasses.right;
    }
    if (newPositionStatus.bottom && !storedPositionStatus.bottom) {
        setStoredPositionStatus({ ...storedPositionStatus, bottom: true });
        return dirClasses.top;
    }
    if (newPositionStatus.top && !storedPositionStatus.top) {
        setStoredPositionStatus({ ...storedPositionStatus, top: true });
        return dirClasses.bottom;
    }

    // this is for the top and bottom directions
    if (storedPositionStatus.left && storedPositionStatus.right && !storedPositionStatus.bottom) return dirClasses.top;
    if (storedPositionStatus.left && storedPositionStatus.right && !storedPositionStatus.top) return dirClasses.bottom;

    return dirClasses.left; // default case
};
