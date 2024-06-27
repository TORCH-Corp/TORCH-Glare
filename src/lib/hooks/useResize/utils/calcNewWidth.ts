import { MutableRefObject, RefObject } from "react";

// Extracted function to get the new width based on the mouse event
export const calculateNewWidthFromMouse = (event: MouseEvent, resizableRef: MutableRefObject<any> | RefObject<any>): number => {
    return event.clientX - resizableRef.current.getBoundingClientRect().left;
};

// Extracted function to get the new width based on the touch event
export const calculateNewWidthFromTouch = (event: TouchEvent, resizableRef: MutableRefObject<any> | RefObject<any>): number => {
    return event.touches[0].clientX - resizableRef.current.getBoundingClientRect().left;
};
