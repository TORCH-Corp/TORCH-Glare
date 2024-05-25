import { MutableRefObject, RefObject, useEffect, useState } from 'react'


export const useResize = (resizableRef: MutableRefObject<any> | RefObject<any>) => {

    const [width, setWidth] = useState<number>();
    const [isResizing, setIsResizing] = useState<boolean>(false);

    const handleStartResize = () => {
        setIsResizing(true);
    };

    const handleStopResize = () => {
        setIsResizing(false);
    };

    const handleMouseMove = (event: MouseEvent) => {
        if (!isResizing) return;
        const newWidth = event.clientX - resizableRef.current.getBoundingClientRect().left;
        setWidth(newWidth);
    };

    const handleTouchMove = (event: TouchEvent) => {
        if (!isResizing) return;
        event.preventDefault(); // Prevent scrolling or other touch-related behaviors
        const newWidth = event.touches[0].clientX - resizableRef.current.getBoundingClientRect().left;
        setWidth(newWidth);
    };

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleStopResize);
        document.addEventListener('touchmove', handleTouchMove, { passive: false }); // Use passive: false to preventDefault
        document.addEventListener('touchend', handleStopResize);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleStopResize);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleStopResize);
        };
    }, [isResizing]);

    return {
        width, handleStartResize
    }
}

