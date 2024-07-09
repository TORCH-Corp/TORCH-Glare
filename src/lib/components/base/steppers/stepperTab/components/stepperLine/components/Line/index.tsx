import { HTMLAttributes } from 'react'
import './style.scss'
interface Props extends HTMLAttributes<HTMLDivElement> {
  is_selected?: boolean
  is_completed?: boolean
  is_negative?: boolean
}
export default function Line({
  is_selected,
  is_completed,
  is_negative,
  ...props }: Props) {
  return (
    <section className={`stepper-tab-line-wrapper ${props.className}`}>
      <div className={`stepper-tab-line ${is_selected || is_completed && !is_negative ? 'stepper-tab-line-selected' : ''} ${is_negative ? 'stepper-tab-line-negative' : ''}`}></div>
    </section>
  )
}
