import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  Dispatch,
  MutableRefObject,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Extracted function to get the new width based on the mouse event
export const calculateNewWidthFromMouse = (
  event: MouseEvent,
  resizableRef:
    | MutableRefObject<HTMLElement | null>
    | RefObject<HTMLElement | null>,
  isRtl: boolean
): number => {
  if (resizableRef.current) {
    const rect = resizableRef.current.getBoundingClientRect();
    return isRtl
      ? rect.right - event.clientX // Reverse calculation for RTL
      : event.clientX - rect.left;
  }
  return 0;
};

// Extracted function to get the new width based on the touch event
export const calculateNewWidthFromTouch = (
  event: TouchEvent,
  resizableRef:
    | MutableRefObject<HTMLElement | null>
    | RefObject<HTMLElement | null>,
  isRtl: boolean
): number => {
  if (resizableRef.current) {
    const rect = resizableRef.current.getBoundingClientRect();
    return isRtl
      ? rect.right - event.touches[0].clientX // Reverse calculation for RTL
      : event.touches[0].clientX - rect.left;
  }
  return 0;
};

// Hook to handle resizing with RTL support
export const useResize = (
  resizableRef: MutableRefObject<HTMLElement> | RefObject<HTMLElement>
) => {
  const [width, setWidth] = useState<number>();
  const [isResizing, setIsResizing] = useState<boolean>(false);

  // Determine the direction of the document
  const htmlDir = document.documentElement.getAttribute("dir") || "ltr";
  const isRtl = htmlDir === "rtl";

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
    const newWidth = calculateNewWidthFromMouse(event, resizableRef, isRtl);
    setWidth(newWidth);
  };

  // Handle touch move events
  const handleTouchMove = (event: TouchEvent) => {
    if (!isResizing) return;
    event.preventDefault(); // Prevent scrolling or other touch-related behaviors
    const newWidth = calculateNewWidthFromTouch(event, resizableRef, isRtl);
    setWidth(newWidth);
  };

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
  }, [isResizing, isRtl]); // Depend on `isRtl` to handle direction changes dynamically

  return {
    width,
    isResizing,
    handleStartResize,
  };
};

export const convertImageFileToDataUrl = async (
  file: File | null,
  setter: Dispatch<SetStateAction<string>>
) => {
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        setter(result);
      }
    };
    reader.readAsDataURL(file);
  }
};
