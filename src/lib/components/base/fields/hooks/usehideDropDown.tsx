import { MutableRefObject, useEffect, useState } from 'react'


export function useHideDropDown(
    // give it the ref of the parent element to give you true or false to show or hide the drop down
    elementRef: MutableRefObject<any>
) {

    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        // this will show the drop down if you click on the parent element 
        // and will hide it if you click on the child element to insure the drop down is closed after selecting an option
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

    // here give you true or false to show or hide the drop down with isActive state
    // also setIsActive is used to show or hide the drop down outside the hook
    return { isActive, setIsActive }
}