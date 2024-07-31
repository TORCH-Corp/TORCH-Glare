import { MutableRefObject, RefObject } from "react";

// Extracted function to get the new width based on the mouse event
export const calculateNewWidthFromMouse = (event: MouseEvent, resizableRef: MutableRefObject<HTMLElement | null> | RefObject<HTMLElement | null>): number => {
    if (resizableRef.current) {
        return event.clientX - resizableRef.current.getBoundingClientRect().left;
    }
    return 0;
};

// Extracted function to get the new width based on the touch event
export const calculateNewWidthFromTouch = (event: TouchEvent, resizableRef: MutableRefObject<HTMLElement | null> | RefObject<HTMLElement | null>): number => {
    if (resizableRef.current) {
        return event.touches[0].clientX - resizableRef.current.getBoundingClientRect().left;
    }
    return 0;
};
