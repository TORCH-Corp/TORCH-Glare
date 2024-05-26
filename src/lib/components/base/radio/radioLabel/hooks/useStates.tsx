import { useState } from 'react'

export default function useStates() {
    const [selected, setISselected] = useState(false)
    const [fucus, setFucus] = useState(false)

    const handleSelect = (e: any) => {
        setISselected(e.target.checked)
    }
    const handleFocus = (e: boolean) => {
        setFucus(e)
    }

    return { fucus, handleFocus, selected, handleSelect }
}
