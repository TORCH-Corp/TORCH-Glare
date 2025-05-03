import { useEffect, useRef } from "react";

export function useClickOutside<T extends HTMLElement>(callback: (event?: MouseEvent | PointerEvent) => void, otherwise?: (event?: MouseEvent | PointerEvent) => void) {
    const ref = useRef<T>(null);

    useEffect(() => {
        function handleOutsideClick(event: MouseEvent | PointerEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback(event);
            } else {
                otherwise?.(event);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("pointerdown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("pointerdown", handleOutsideClick);
        };
    }, [callback]);

    return ref;
}


