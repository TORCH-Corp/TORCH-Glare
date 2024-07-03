import { HTMLAttributes } from 'react'
import './style.scss'

interface Props extends HTMLAttributes<HTMLDivElement> {
  is_selected?: boolean
  is_completed?: boolean
  is_negative?: boolean
}
export function Circle(props: Props) {
  return (
    <div className={`glare-stepper-counter-circle  ${props.is_selected || props.is_completed && !props.is_negative ? 'glare-stepper-counter-circle-selected' : ''} ${props.is_negative ? 'glare-stepper-counter-circle-negative' : ''}`}>{
      props.is_completed && !props.is_negative ?
        // the checkmark icon
        <i className="ri-check-line"></i>
        :
        // the negative exclamation mark
        props.is_negative ?
          <p>!</p>
          :
          // any other number
          props.children
    }</div>
  )
}
