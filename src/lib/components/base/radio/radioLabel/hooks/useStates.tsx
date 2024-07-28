import { useState } from 'react'

export default function useStates() {
    const [fucus, setFucus] = useState(false)
    // if the input is fucus will have the fucus style
    const handleFocus = (e: boolean) => {
        setFucus(e)
    }

    // returning the states
    return { fucus, handleFocus }
}
