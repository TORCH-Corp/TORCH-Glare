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
  forward: any // Function to go forward the stepper tab
  backward: any // Function to go backward the stepper tab
}

export function StepperTab({
  stepper_counter,
  stepper_label,
  is_selected,
  is_completed,
  is_negative,
  with_start_flag,
  backward,
  forward,
  ...props
}: Props) {
  return (
    <section {...props} className={"glare-stepper-tab " + props.className}>
      <StepperLabel
        forward={forward}
        backward={backward}
        is_selected={is_selected}
        stepper_label={stepper_label}
      />
      <StepperLine
        with_start_flag={with_start_flag}
        is_selected={is_selected}
        is_completed={is_completed}
        is_negative={is_negative}
      >{stepper_counter}</StepperLine>
    </section>
  )
}
