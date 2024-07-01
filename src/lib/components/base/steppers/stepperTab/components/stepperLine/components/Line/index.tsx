import './style.scss'
interface Props {
  is_first?: boolean
  isSelected?: boolean
  isCompleted?: boolean
  isNegative?: boolean
}
export default function Line(props: Props) {
  return (
    <section className="stepper-tab-line-wrapper">
      {props.is_first && <div className="stepper-tab-start-line"></div>}
      <div className={`stepper-tab-line ${props.isSelected || props.isCompleted && !props.isNegative ? 'stepper-tab-line-selected' : ''} ${props.isNegative ? 'stepper-tab-line-negative' : ''}`}></div>
      {props.is_first && <div className="stepper-tab-start-line"></div>}
    </section>
  )
}
