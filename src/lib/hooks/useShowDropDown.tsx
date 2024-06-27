import { MutableRefObject, useEffect, useState } from 'react'


export function useShowDropDown(elementRef: MutableRefObject<any>) {

    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        const hideDropDown = (e: any) => {
            if (elementRef.current) {
                // here if the click event is on the parent element or on the child element then it will show the drop down
                if (elementRef.current.contains(e.target)) {
                    setIsActive(true)
                } else setIsActive(false)
            }
        }

        window.addEventListener("click", hideDropDown)
        return () => window.removeEventListener("click", hideDropDown)
    }, [])

    // here $isActive give you true or false on the drop down and $setIsActive to show hide the drop down outside the hook
    return { isActive, setIsActive }
}
