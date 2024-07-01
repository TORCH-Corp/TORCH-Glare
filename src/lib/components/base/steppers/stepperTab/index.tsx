import StepperLine from './components/stepperLine'
import './style.scss'
export function StepperTab() {
  return (
    <section className="glare-stepper-tab">
      <StepperLine isCompleted isNegative>1</StepperLine>
    </section>
  )
}
