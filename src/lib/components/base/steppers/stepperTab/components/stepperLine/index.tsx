import { HTMLAttributes } from "react";
import { Circle } from "./components/circle";
import Line from "./components/Line";
import './style.scss'

interface Props extends HTMLAttributes<HTMLDivElement> {
  is_selected?: boolean
  is_completed?: boolean
  is_negative?: boolean
}
export default function StepperLine(props: Props) {
  return (
    <section {...props} className="stepper-tab-main-line">
      <Line
        with_start_flag
        {...props}
      />
      <Circle
        {...props}
      >{props.children}</Circle>
      <Line
        {...props}
      />
    </section>
  )
}
