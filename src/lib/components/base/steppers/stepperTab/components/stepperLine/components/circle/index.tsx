import { HTMLAttributes } from 'react'
import './style.scss'

interface Props extends HTMLAttributes<HTMLDivElement> {
  isSelected?: boolean
  isCompleted?: boolean
  isNegative?: boolean
}
export function Circle(props: Props) {
  return (
    <div className={`glare-stepper-counter-circle  ${props.isSelected || props.isCompleted && !props.isNegative ? 'glare-stepper-counter-circle-selected' : ''} ${props.isNegative ? 'glare-stepper-counter-circle-negative' : ''}`}>{
      props.isCompleted && !props.isNegative ?
        // the checkmark icon
        <i className="ri-check-line"></i>
        :
        // the negative exclamation mark
        props.isNegative ?
          <p>!</p>
          :
          // any other number
          props.children
    }</div>
  )
}
