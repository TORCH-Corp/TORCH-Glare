import {
    MutableRefObject,
    RefObject,
    useEffect,
    useState,
} from "react";
import { calculateNewWidthFromMouse, calculateNewWidthFromTouch } from "../utils/resize";


// Hook to handle resizing with RTL support
export const useResize = (
    resizableRef: MutableRefObject<HTMLElement> | RefObject<HTMLElement>
) => {
    const [width, setWidth] = useState<number>();
    const [isResizing, setIsResizing] = useState<boolean>(false);
    const [isRTL, setIsRTL] = useState<boolean>(false);



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
        const newWidth = calculateNewWidthFromMouse(event, resizableRef, isRTL);
        setWidth(newWidth);
    };

    // Handle touch move events
    const handleTouchMove = (event: TouchEvent) => {
        if (!isResizing) return;
        event.preventDefault(); // Prevent scrolling or other touch-related behaviors
        const newWidth = calculateNewWidthFromTouch(event, resizableRef, isRTL);
        setWidth(newWidth);
    };

    useEffect(() => {
        let htmlDir = ''
        if (document) {
            htmlDir = document.documentElement.getAttribute("dir") || "ltr"
        }
        // Determine the direction of the document
        setIsRTL(htmlDir === "rtl");
    }, []);

    useEffect(() => {
        if (!resizableRef.current) return;

        // Add event listeners for mouse and touch events
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleStopResize);
        document.addEventListener("touchmove", handleTouchMove, { passive: false });
        document.addEventListener("touchend", handleStopResize);

        // Cleanup event listeners on unmount
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleStopResize);
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("touchend", handleStopResize);
        };
    }, [isResizing, isRTL]); // Depend on `isRtl` to handle direction changes dynamically

    return {
        width,
        isResizing,
        handleStartResize,
    };
};

