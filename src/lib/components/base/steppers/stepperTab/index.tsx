import { HTMLAttributes } from 'react'
import StepperLine from './components/stepperLine'
import './style.scss'
import { StepperLabel } from './components/stepperLabel'

interface Props extends HTMLAttributes<HTMLDivElement | HTMLButtonElement> {
  stepper_counter: number // number label of the stepper tab
  stepper_label: string // main label of the stepper tab
  is_selected?: boolean  // if the stepper tab is selected
  is_completed?: boolean // If the stepper tab is completed
  is_negative?: boolean // If the stepper tab is negative
  with_start_flag: boolean // If the stepper tab has a start flag
}

export function StepperTab(props: Props) {
  return (
    <section {...props} className={"glare-stepper-tab " + props.className}>
      <StepperLabel
        is_selected={props.is_selected}
        stepper_label={props.stepper_label}
      />
      <StepperLine
        with_start_flag={props.with_start_flag}
        is_selected={props.is_selected}
        is_completed={props.is_completed}
        is_negative={props.is_negative}
      >{props.stepper_counter}</StepperLine>
    </section>
  )
}
