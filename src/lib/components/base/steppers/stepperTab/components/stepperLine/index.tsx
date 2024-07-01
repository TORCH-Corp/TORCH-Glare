import { HTMLAttributes } from "react";
import CounterCircle from "./components/counterCircle";
import Line from "./components/Line";
import './style.scss'

interface Props extends HTMLAttributes<HTMLDivElement> {

}
export default function StepperLine(props: Props) {
  return (
    <section {...props} className="stepper-tab-main-line">
      <Line />
      <CounterCircle>{props.children}</CounterCircle>
      <Line />
    </section>
  )
}
