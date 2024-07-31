import { MutableRefObject, RefObject, useEffect, useState } from 'react';
import { calculateNewWidthFromMouse, calculateNewWidthFromTouch } from './utils/calcNewWidth';

// this hook is used to handle the resize of the component 
// you should pass your component reference
// this hook will handle the mouse and touch events
// we used the x coordinates to calculate the new width
// the hook will return the new width value for the component
// you should use handleStartResize function to start the resize process

export const useResize = (resizableRef: MutableRefObject<HTMLElement> | RefObject<HTMLElement>) => {
    const [width, setWidth] = useState<number>();
    const [isResizing, setIsResizing] = useState<boolean>(false);

    // Start the resize process
    const handleStartResize = () => {
        setIsResizing(true);
    };

    // Stop the resize process
    const handleStopResize = () => {
        setIsResizing(false);
    };

    // Handle mouse move events
    const handleMouseMove = (event: MouseEvent) => {
        if (!isResizing) return;
        const newWidth = calculateNewWidthFromMouse(event, resizableRef);
        setWidth(newWidth);
    };

    // Handle touch move events
    const handleTouchMove = (event: TouchEvent) => {
        if (!isResizing) return;
        event.preventDefault(); // Prevent scrolling or other touch-related behaviors
        const newWidth = calculateNewWidthFromTouch(event, resizableRef);
        setWidth(newWidth);
    };

    useEffect(() => {
        // Add event listeners for mouse and touch events
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleStopResize);
        document.addEventListener('touchmove', handleTouchMove, { passive: false }); // Use passive: false to preventDefault
        document.addEventListener('touchend', handleStopResize);

        // Cleanup event listeners on unmount
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleStopResize);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleStopResize);
        };
    }, [isResizing]);

    return {
        // Width will be the new width of the component
        width,
        // handleStartResize function will be used to start the resize process for the component
        handleStartResize
    };
};
