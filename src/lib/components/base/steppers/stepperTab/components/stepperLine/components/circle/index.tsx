import { HTMLAttributes } from 'react'
import './style.scss'

interface Props extends HTMLAttributes<HTMLDivElement> {
  is_selected?: boolean
  is_completed?: boolean
  is_negative?: boolean
}
export function Circle({ is_selected, is_completed, is_negative, ...props }: Props) {
  return (
    <div className={`glare-stepper-counter-circle  ${is_selected || is_completed && !is_negative ? 'glare-stepper-counter-circle-selected' : ''} ${is_negative ? 'glare-stepper-counter-circle-negative' : ''}`}>{
      is_completed && !is_negative ?
        // the checkmark icon
        <i className="ri-check-line"></i>
        :
        // the negative exclamation mark
        is_negative ?
          <p>!</p>
          :
          // any other number
          props.children
    }</div>
  )
}
