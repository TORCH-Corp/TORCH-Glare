import { HTMLAttributes, useEffect, useState } from 'react'
import './style.scss'

interface Props extends HTMLAttributes<HTMLDivElement> {
    value: string // this is the password value that we will check
}

export default function PasswordLevel(props: Props) {

    const [level, setLevel] = useState('')

    useEffect(() => {
        // here will make the password level checking by regex

        // here if we have a password with at least one symbol
        const symbolRegex = /[!@#$%^&*(),.?":{}|<>]/;
        // here if we have a password with at least one uppercase
        const uppercaseRegex = /[A-Z]/;
        // here is the password level checking level 
        // if it's 1 is weak
        // if it's 2 is good
        // if it's 3 is great
        let passwordLev = 0

        if (props.value.length >= 6) {

            // if the password length more than 6
            passwordLev = 1
            setLevel("weak") // set the password level also will effect the style, weak is class name

            // if the password has at least one symbol
            if (symbolRegex.test(props.value)) passwordLev += 1
            else { if (passwordLev > 0) passwordLev - 1 }

            // if the password has at least one uppercase char
            if (uppercaseRegex.test(props.value)) passwordLev += 1
            else { if (passwordLev > 0) passwordLev - 1 }

            if (passwordLev == 2) {
                setLevel("good") // good is class name
            }
            if (passwordLev == 3) {
                setLevel("great") // great is class name
            }

        }
        // if the password is less than 6 chars 
        else {
            passwordLev = 0
            setLevel("")
        }
    }, [{ ...props }])


    return (
        // here will show level component based on the ${level} state
        <div {...props} className={`password-level ${level}`}>
            <div className="nagative"></div> {/* weak */}
            <div className="warning"></div>{/* good */}
            <div className="success"></div>{/* great */}
        </div>
    )
}
