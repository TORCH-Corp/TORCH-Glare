import { clsx, type ClassValue } from "clsx";
import { Dispatch, MutableRefObject, RefObject, SetStateAction } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


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

