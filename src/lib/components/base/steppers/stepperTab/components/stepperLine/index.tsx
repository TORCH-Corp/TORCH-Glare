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
export default function StepperLine(props: Props) {
  return (
    <section {...props} className="stepper-tab-main-line">
      <Line
        {...props}
      />
      <Circle
        {...props}
      >{props.children}</Circle>
      <Line
        with_start_flag={false}
        is_selected={props.is_selected}
        is_completed={props.is_completed}
        is_negative={props.is_negative}
      />
    </section>
  )
}
