import { ChangeEvent, ChangeEventHandler, useEffect, useRef, useState } from 'react'



export default function useStates(IsChecked: boolean) {

    const [isHover, setIsHover] = useState(false)
    const [isChecked, setIsChecked] = useState(false)
    const checkBoxRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (!checkBoxRef.current) return

        if (IsChecked) {
            checkBoxRef.current.checked = true
            setIsChecked(IsChecked)
        }
    }, [IsChecked])

    const handleChecked = (e: ChangeEvent<HTMLInputElement>, eventHandler: ChangeEventHandler<HTMLInputElement> | undefined) => {
        eventHandler && eventHandler(e)
        setIsChecked(e.target.checked)
    }

    return {
        isHover, setIsHover, isChecked, handleChecked, checkBoxRef
    }
}
