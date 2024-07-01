import { HTMLAttributes } from "react";
import { Circle } from "./components/circle";
import Line from "./components/Line";
import './style.scss'

interface Props extends HTMLAttributes<HTMLDivElement> {
  isSelected?: boolean
  isCompleted?: boolean
  isNegative?: boolean
}
export default function StepperLine(props: Props) {
  return (
    <section {...props} className="stepper-tab-main-line">
      <Line
        is_first
        isSelected={props.isSelected}
        isCompleted={props.isCompleted}
        isNegative={props.isNegative}
      />
      <Circle
        isSelected={props.isSelected}
        isCompleted={props.isCompleted}
        isNegative={props.isNegative}
      >{props.children}</Circle>
      <Line
        isSelected={props.isSelected}
        isCompleted={props.isCompleted}
        isNegative={props.isNegative}
      />
    </section>
  )
}
