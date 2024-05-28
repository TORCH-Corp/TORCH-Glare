import { ButtonHTMLAttributes, ReactNode } from 'react'
import './variants/default.scss'
import loadingIcon from './icons/loading.svg'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  left_icon?: ReactNode
  right_icon?: ReactNode
  is_loading?: boolean
  component_style?: "BlueSecStyle" | "YelSecStyle" | "RedSecStyle" | "BorderStyle" | "PrimeContStyle" | "BlueContStyle" | "RedContStyle"
  component_size?: "S" | "M" | "L"
}

export default function Button(props: Props) {

  return (
    <button
      {...props}
      className={`glare-button  glare-button-${props.component_size ? props.component_size : "S"}  glare-button-without-icon-${!props.children && props.component_size}  ${props.is_loading && !props.right_icon && !props.left_icon ? "glare-button-loading" : ''} ${props.component_style} ${props.className}`}
    >
      {props.left_icon && !props.is_loading ? <div className='glare-button-icon'>{props.left_icon}</div> : null}
      {props.children}
      {props.right_icon && !props.is_loading ? <div className='glare-button-icon'>{props.right_icon}</div> : null}
      < img className='glare-button-loading-img' src={loadingIcon} alt='loading' />
    </button>
  )
}
