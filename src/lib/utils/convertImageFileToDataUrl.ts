import { Dispatch, SetStateAction } from "react";

export const convertImageFileToDataUrl = async (file: File | null, setter: Dispatch<SetStateAction<string>>) => {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            const result = e.target?.result;
            if (typeof result === 'string') {
                setter(result)
            }
        };
        reader.readAsDataURL(file);
    }
};