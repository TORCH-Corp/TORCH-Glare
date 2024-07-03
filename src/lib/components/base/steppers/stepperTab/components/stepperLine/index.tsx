import { HTMLAttributes } from "react";
import { Circle } from "./components/circle";
import Line from "./components/Line";
import './style.scss'

interface Props extends HTMLAttributes<HTMLDivElement> {
  is_selected?: boolean
  is_completed?: boolean
  is_negative?: boolean
  with_start_flag: boolean
}
export default function StepperLine({
  with_start_flag,
  is_selected,
  is_completed,
  is_negative,
  ...props }: Props) {
  return (
    <section {...props} className="stepper-tab-main-line">
      <Line
        with_start_flag={with_start_flag}
        is_selected={is_selected}
        is_completed={is_completed}
        is_negative={is_negative}
      />
      <Circle
        is_selected={is_selected}
        is_completed={is_completed}
        is_negative={is_negative}
      >{props.children}</Circle>
      <Line
        with_start_flag={false}
        is_selected={is_selected}
        is_completed={is_completed}
        is_negative={is_negative}
      />
    </section>
  )
}
