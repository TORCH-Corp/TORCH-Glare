import './style.scss'
interface Props {
  with_start_flag: boolean
  is_selected?: boolean
  is_completed?: boolean
  is_negative?: boolean
}
export default function Line(props: Props) {
  return (
    <section className="stepper-tab-line-wrapper">
      {props.with_start_flag && <div className="stepper-tab-start-line"></div>}
      <div className={`stepper-tab-line ${props.is_selected || props.is_completed && !props.is_negative ? 'stepper-tab-line-selected' : ''} ${props.is_negative ? 'stepper-tab-line-negative' : ''}`}></div>
      {props.with_start_flag && <div className="stepper-tab-start-line"></div>}
    </section>
  )
}
