import { useEffect, useRef } from "react";

export function useClickOutside<T extends HTMLElement>(callback: (event?: any) => void) {
    const ref = useRef<T>(null);

    useEffect(() => {
        function handleOutsideClick(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback(event);
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


