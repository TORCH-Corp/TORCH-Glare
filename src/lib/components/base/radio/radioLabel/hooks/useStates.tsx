import { useState } from 'react'

export default function useStates() {
    const [selected, setISselected] = useState(false)
    const [fucus, setFucus] = useState(false)

    // if the input is checked we will show the check box icon by returning true 
    const handleSelect = (e: any) => {
        setISselected(e.target.checked)
    }
    // if the input is fucus will have the fucus style
    const handleFocus = (e: boolean) => {
        setFucus(e)
    }

    // returning the states
    return { fucus, handleFocus, selected, handleSelect }
}
