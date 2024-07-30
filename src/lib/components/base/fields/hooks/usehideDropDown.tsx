import { MutableRefObject, useEffect, useState } from 'react';

export function useHideDropDown(
    // Give it the ref of the parent element to provide true or false to show or hide the drop down
    elementRef: MutableRefObject<HTMLElement | null>
) {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        // This will show the drop down if you click on the parent element 
        // and will hide it if you click on the child element to ensure the drop down is closed after selecting an option
        const hideDropDown = (e: MouseEvent | TouchEvent) => {
            if (elementRef.current) {
                if (elementRef.current.contains(e.target as Node)) {
                    setIsActive(true);
                } else {
                    setIsActive(false);
                }
            }
        };

        window.addEventListener('click', hideDropDown);
        window.addEventListener('touchstart', hideDropDown);

        return () => {
            window.removeEventListener('click', hideDropDown);
            window.removeEventListener('touchstart', hideDropDown);
        };
    }, [elementRef]);

    // Here, isActive gives you true or false to show or hide the drop down with isActive state
    // Also, setIsActive is used to show or hide the drop down outside the hook
    return { isActive, setIsActive };
}
