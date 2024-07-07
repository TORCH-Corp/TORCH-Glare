import { HTMLAttributes } from 'react'
import './style.scss'
interface Props extends HTMLAttributes<HTMLDivElement> {
  with_start_flag: boolean
  is_selected?: boolean
  is_completed?: boolean
  is_negative?: boolean
}
export default function Line({
  with_start_flag,
  is_selected,
  is_completed,
  is_negative,
  ...props }: Props) {
  return (
    <section className={`stepper-tab-line-wrapper ${props.className}`}>
      {with_start_flag && <div className="stepper-tab-start-line"></div>}
      <div className={`stepper-tab-line ${is_selected || is_completed && !is_negative ? 'stepper-tab-line-selected' : ''} ${is_negative ? 'stepper-tab-line-negative' : ''}`}></div>
      {with_start_flag && <div className="stepper-tab-start-line"></div>}
    </section>
  )
}
