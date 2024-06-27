import { DirectionsStatus } from "../types";

// Function to get the element's position status
export const getElementPositionStatus = (element: HTMLElement): DirectionsStatus => {
    const rect = element.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    return {
        left: rect.left < 0,
        right: rect.right > viewportWidth,
        top: rect.top < 0,
        bottom: rect.bottom > viewportHeight
    };
};
