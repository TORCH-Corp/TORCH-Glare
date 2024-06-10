import { ButtonHTMLAttributes } from 'react'
import './style.scss'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
}

export default function AuthButton(props: Props) {
  return (
    <button {...props} className={`sign-in-button ${props.className}`} ></button>
  )
}
