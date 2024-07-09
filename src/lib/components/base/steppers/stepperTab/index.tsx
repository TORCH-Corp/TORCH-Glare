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
}

export function StepperTab({
  stepper_counter,
  stepper_label,
  is_selected,
  is_completed,
  is_negative,
  ...props
}: Props) {
  return (
    <section {...props} dir='ltr' className={"glare-stepper-tab " + props.className}>
      <StepperLabel
        is_selected={is_selected}
        stepper_label={stepper_label}
      />
      <StepperLine
        is_selected={is_selected}
        is_completed={is_completed}
        is_negative={is_negative}
      >{stepper_counter}
      </StepperLine>

    </section>
  )
}
