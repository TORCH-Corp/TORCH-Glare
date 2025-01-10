import { convertImageFileToDataUrl } from "./convertImageFileToDataUrl";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export { convertImageFileToDataUrl, cn }