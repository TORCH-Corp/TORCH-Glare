import { MutableRefObject, useEffect, useState } from 'react'

export function useHideDropDown(elementRef: MutableRefObject<any>) {

    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        const hideDropDown = (e: any) => {
            if (elementRef.current) {
                if (elementRef.current.contains(e.target)) {
/*                     setIsActive(true)
 */                } else setIsActive(false)
            }
        }

        window.addEventListener("click", hideDropDown)
        return () => window.removeEventListener("click", hideDropDown)
    }, [])

    return { isActive, setIsActive }
}