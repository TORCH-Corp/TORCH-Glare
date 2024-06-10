import { HTMLAttributes, useEffect, useState } from 'react'
import './style.scss'

interface Props extends HTMLAttributes<HTMLDivElement> {
    value: string
}

export default function PasswordLevel(props: Props) {

    const [level, setLevel] = useState('')

    useEffect(() => {
        const symbolRegex = /[!@#$%^&*(),.?":{}|<>]/;
        const uppercaseRegex = /[A-Z]/;
        let passwordLev = 0

        if (props.value.length >= 6) {

            passwordLev = 1
            setLevel("weak")

            if (symbolRegex.test(props.value)) passwordLev += 1
            else { if (passwordLev > 0) passwordLev - 1 }

            if (uppercaseRegex.test(props.value)) passwordLev += 1
            else { if (passwordLev > 0) passwordLev - 1 }

            if (passwordLev == 2) {
                setLevel("good")
            }
            if (passwordLev == 3) {
                setLevel("great")
            }

        } else {
            passwordLev = 0
            setLevel("")
        }
    }, [{ ...props }])


    return (
        <div {...props} className={`password-level ${level}`}>
            <div className="nagative"></div>
            <div className="warning"></div>
            <div className="success"></div>
        </div>
    )
}
